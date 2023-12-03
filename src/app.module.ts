import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerErrorInterceptor, LoggerModule } from 'nestjs-pino';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import configModuleOptions from './infrastructure/config';
import logModuleOptions from './infrastructure/logger';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    LoggerModule.forRoot(logModuleOptions),
    MikroOrmModule.forRoot(),
    ProductsModule,
    UsersModule,
    IamModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerErrorInterceptor,
    },
  ],
})
export class AppModule {}
