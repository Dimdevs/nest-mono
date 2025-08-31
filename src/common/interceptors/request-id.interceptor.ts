import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest();
    req.requestId = req.requestId || uuid();
    return next.handle();
  }
}
