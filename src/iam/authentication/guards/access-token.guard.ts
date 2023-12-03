import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  private readonly JWT_SECRET: string;
  private readonly JWT_AUDIENCE: string;
  private readonly JWT_ISSUER: string;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.JWT_SECRET = configService.get<string>('jwt.secret');
    this.JWT_AUDIENCE = configService.get<string>('jwt.audience');
    this.JWT_ISSUER = configService.get<string>('jwt.issuer');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.JWT_SECRET,
        audience: this.JWT_AUDIENCE,
        issuer: this.JWT_ISSUER,
      });
      request[REQUEST_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
