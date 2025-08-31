import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  constructor(@Inject('CACHE_MANAGER') private cache: Cache) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.method !== 'POST') return next();
    const key = req.header('Idempotency-Key');
    if (!key) return next();

    const cached = await this.cache.get(`idem:${key}`);
    if (cached) return res.status(200).json(cached);

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      void this.cache.set(`idem:${key}`, body, 60);
      return originalJson(body);
    };
    next();
  }
}
