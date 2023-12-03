import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'src/infrastructure/config/configuration';
import { RefreshTokenIdsStorage } from './authentication/redis/refresh-token-ids.storage';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(configuration)],
      useFactory: () => ({
        secret: new ConfigService().get<string>('jwt.secret'),
        audience: new ConfigService().get<string>('jwt.audience'),
        issuer: new ConfigService().get<string>('jwt.issuer'),
      }),
    }),
    ConfigModule.forFeature(configuration),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    RefreshTokenIdsStorage,
    AuthenticationService,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
