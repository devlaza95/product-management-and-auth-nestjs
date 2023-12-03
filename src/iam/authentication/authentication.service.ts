import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  InvalidatedRefreshTokenError,
  RefreshTokenIdsStorage,
} from './redis/refresh-token-ids.storage';
import { SignOutDto } from './dto/sign-out.dto';

@Injectable()
export class AuthenticationService {
  private JWT_SECRET: string;
  private JWT_AUDIENCE: string;
  private JWT_ISSUER: string;
  private JWT_ACCESS_TOKEN_TTL: number;
  private JWT_REFRESH_TOKEN_TTL: number;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {
    this.JWT_ISSUER = this.configService.get<string>('jwt.issuer');
    this.JWT_AUDIENCE = this.configService.get<string>('jwt.audience');
    this.JWT_SECRET = this.configService.get<string>('jwt.secret');
    this.JWT_ACCESS_TOKEN_TTL =
      this.configService.get<number>('jwt.accessTokenTtl');
    this.JWT_REFRESH_TOKEN_TTL = this.configService.get<number>(
      'jwt.refreshTokenTtl',
    );
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, password, firstName, lastName, phone } = signUpDto;

    const userExists = await this.userRepository.findOne({ email });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashingService.hash(password);

    const user = this.createUser(
      email,
      hashedPassword,
      firstName,
      lastName,
      phone,
    );

    try {
      await this.userRepository.getEntityManager().persistAndFlush(user);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  private createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
  ): User {
    return this.userRepository.create({
      email,
      password,
      firstName,
      lastName,
      phone,
    });
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOne({ email: signInDto.email });

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) {
      throw new BadRequestException('Incorrect password');
    }

    return await this.generateTokens(user);
  }

  async signOut({ userId }: SignOutDto) {
    await this.handleInvalidateTokens(userId);
  }
  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { userId, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'userId'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.JWT_SECRET,
        audience: this.JWT_AUDIENCE,
        issuer: this.JWT_ISSUER,
      });
      const user = await this.userRepository.findOneOrFail({
        id: userId,
      });
      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );
      // Refresh token rotation
      if (isValid) {
        await this.handleInvalidateTokens(user.id);
      } else {
        throw new Error('Refresh token is invalid');
      }
      return this.generateTokens(user);
    } catch (err) {
      if (err instanceof InvalidatedRefreshTokenError) {
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException();
    }
  }

  async generateTokens(user: User) {
    const refreshTokenId = uuidv4();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.JWT_ACCESS_TOKEN_TTL,
        {
          email: user.email,
        },
      ),
      this.signToken(user.id, this.JWT_REFRESH_TOKEN_TTL, {
        refreshTokenId,
      }),
    ]);
    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);
    return { accessToken, refreshToken };
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    const accessToken = await this.jwtService.signAsync(
      {
        userId,
        ...payload,
      },
      {
        audience: this.JWT_AUDIENCE,
        issuer: this.JWT_ISSUER,
        secret: this.JWT_SECRET,
        expiresIn,
      },
    );
    return accessToken;
  }

  async handleInvalidateTokens(userId: string) {
    await this.refreshTokenIdsStorage.invalidate(userId);
  }
}
