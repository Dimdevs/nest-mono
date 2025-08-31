import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { createAdapter } from '@socket.io/redis-adapter';
import { ServerOptions, Server } from 'socket.io';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor!: ReturnType<typeof createAdapter>;
  private pubClient!: Redis;
  private subClient!: Redis;
  private connected = false;

  constructor(private app: INestApplication, private config: ConfigService) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
  const host = this.config.get<string>('redis.host')!;
  const port = this.config.get<number>('redis.port')!;
  try {
    this.pubClient = new (Redis as any)({ host, port, lazyConnect: true });
    await this.pubClient.connect();
    this.subClient = this.pubClient.duplicate();
    await this.subClient.connect();
    this.adapterConstructor = createAdapter(this.pubClient, this.subClient);
    this.connected = true;
  } catch {
    this.connected = false;
  }
}


createIOServer(port: number, options?: ServerOptions): any {
  const server: Server = super.createIOServer(port, {
    ...options,
    cors: { origin: this.config.get('corsOrigins') || [], credentials: true },
  });

    if (!this.adapterConstructor) {
      // void this.connectToRedis();
      server.adapter(this.adapterConstructor);
    }

    const secureNs = server.of('/secure');
    secureNs.use((socket, next) => {
      try {
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;
        if (!token) return next(new Error('NO_TOKEN'));
        const secret = this.config.get<string>('jwt.accessSecret')!;
        const payload = jwt.verify(String(token), secret) as any;
        (socket as any).user = { sub: payload.sub, email: payload.email, role: payload.role };
        return next();
      } catch {
        return next(new Error('INVALID_TOKEN'));
      }
    });

    return server;
  }
}
