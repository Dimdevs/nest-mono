import { Module } from '@nestjs/common';
import { Registry, collectDefaultMetrics } from 'prom-client';

export const registry = new Registry();
collectDefaultMetrics({ register: registry });

@Module({ providers: [{ provide: 'PROM_REGISTRY', useValue: registry }], exports: ['PROM_REGISTRY'] })
export class MetricsModule {}
