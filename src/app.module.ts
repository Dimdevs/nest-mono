import { Module } from '@nestjs/common';
import { AppConfigModule } from './core/config/config.module';
import { AppLoggerModule } from './core/logger/logger.module';
import { PrismaModule } from './core/db/prisma.module';
import { AppCacheModule } from './core/cache/cache.module';
import { QueueModule } from './core/queue/queue.module';
import { HealthModule } from './core/health/health.module';
import { MetricsModule } from './core/metrics/metrics.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LedgerModule } from './modules/ledger/ledger.module';
import { WsModule } from './modules/ws/ws.module';

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule,
    PrismaModule,
    // AppCacheModule,
    // QueueModule,
    HealthModule,
    MetricsModule,
    AuthModule,
    UsersModule,
    LedgerModule,
    WsModule,
  ],
})
export class AppModule {}
