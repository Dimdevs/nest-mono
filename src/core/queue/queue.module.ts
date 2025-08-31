import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (cfg: ConfigService) => ({
    connection: {
      host: cfg.getOrThrow('redis.host'),
      port: cfg.getOrThrow('redis.port'),
      lazyConnect: true,
      enableReadyCheck: false,
      maxRetriesPerRequest: 1,
    },
    defaultJobOptions: { attempts: 5, backoff: { type: 'exponential', delay: 1000 } },
  }),
}),
    BullModule.registerQueue({ name: 'emails' }, { name: 'webhooks' }),
  ],
})
export class QueueModule {}
