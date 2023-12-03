import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { json, urlencoded } from 'body-parser';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './infrastructure/exceptions/http-exception.filter';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function useHelmet(app: INestApplication): void {
  app.use(helmet());
}

function useLog(app: INestApplication): Logger {
  app.useLogger(app.get(Logger));

  return app.get(Logger);
}

function useGlobalPipes(app: INestApplication): void {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
}

function useGlobalFilters(app: INestApplication, logger: Logger): void {
  app.useGlobalFilters(new HttpExceptionFilter(logger));
}

function useHttp(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.getHttpAdapter().getInstance().disable('x-powered-by');
}

function useHooks(app: INestApplication): void {
  app.enableShutdownHooks();
}

async function useBodyParser(app: INestApplication): Promise<void> {
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
}

function useSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('API for user authentication')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'Bearer', bearerFormat: 'JWT' },
      'accessToken',
    )
    .addSecurity('accessToken', { type: 'http', scheme: 'Bearer' })
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api/docs', app, document);
}

async function useAppAsync(
  app: INestApplication,
  configService: ConfigService<unknown, boolean>,
  logger: Logger,
): Promise<void> {
  const httpPort = configService.get<number>('http.port');

  app.enableCors();

  await app.listen(httpPort);

  logger.log(`🚀 Http server listening on ${await app.getUrl()}`);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const logger = useLog(app);

  useHelmet(app);
  useGlobalPipes(app);
  useHttp(app);
  useHooks(app);
  useGlobalFilters(app, logger);
  useSwagger(app);
  useBodyParser(app);

  await useAppAsync(app, configService, logger);
}

bootstrap();
