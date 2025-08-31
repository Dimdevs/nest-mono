import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const requestId = (req as any).requestId || uuid();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let code = 'INTERNAL_ERROR';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resp: any = exception.getResponse();
      message = resp?.message ?? exception.message;
      code = resp?.code ?? exception.name;
      details = resp?.details;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.error(exception);
    }

    return res.status(status).json({ error: { code, message, details, status, request_id: requestId } });
  }
}
