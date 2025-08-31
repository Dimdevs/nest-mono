import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(app: INestApplication) {
  const cfg = app.get(ConfigService);
  const builder = new DocumentBuilder()
    .setTitle(cfg.getOrThrow('swagger.title'))
    .setVersion(cfg.getOrThrow('swagger.version'))
    .addBearerAuth();
  const doc = SwaggerModule.createDocument(app, builder.build());
  SwaggerModule.setup('/docs', app, doc);
}
