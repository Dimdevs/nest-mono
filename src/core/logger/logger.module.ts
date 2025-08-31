import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
        autoLogging: true,
        redact: {
  paths: [
    'req.headers.authorization',
    'req.headers["x-api-key"]',
    'req.headers.cookie',
    'res.headers["set-cookie"]'
  ],
  remove: true
},
      },
    }),
  ],
})
export class AppLoggerModule {}
