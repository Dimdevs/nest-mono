import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => ({
        store: await redisStore({
          host: cfg.getOrThrow<string>('redis.host'),
          port: cfg.getOrThrow<number>('redis.port'),
          ttl: 60,
        }),
      }),
    }),
  ],
})
export class AppCacheModule {}
