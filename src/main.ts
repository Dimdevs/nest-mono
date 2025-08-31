import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import * as compression from 'compression';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { ResponseEnvelopeInterceptor } from './common/interceptors/response-envelope.interceptor';
import { RequestIdInterceptor } from './common/interceptors/request-id.interceptor';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './core/docs/swagger';
// import { RedisIoAdapter } from './modules/ws/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.use(helmet());
  app.use(compression());

  const cfg = app.get(ConfigService);
  app.enableCors({ origin: cfg.get('corsOrigins') || [], credentials: true });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new HttpErrorFilter());
  app.useGlobalInterceptors(new RequestIdInterceptor(), new ResponseEnvelopeInterceptor());

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Socket.IO with Redis adapter + /secure namespace JWT auth
  // const redisAdapter = new RedisIoAdapter(app, cfg);
  // await redisAdapter.connectToRedis();
  // app.useWebSocketAdapter(redisAdapter);

  setupSwagger(app);
  await app.listen(cfg.get<number>('port') || 3000);
}
bootstrap();
