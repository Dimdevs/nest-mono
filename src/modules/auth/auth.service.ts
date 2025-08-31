import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../core/db/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private cfg: ConfigService) {}

  async register(email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({ data: { email, password: hash } });
    // create default account
    await this.prisma.account.create({ data: { userId: user.id, balanceCents: 0 } });
    return { id: user.id, email: user.email };
    }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) throw new UnauthorizedException({ code: 'INVALID_CREDENTIALS' });

    const access = await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role }, { secret: this.cfg.get('jwt.accessSecret'), expiresIn: this.cfg.get('jwt.accessTtl') });
    const refresh = await this.jwt.signAsync({ sub: user.id }, { secret: this.cfg.get('jwt.refreshSecret'), expiresIn: this.cfg.get('jwt.refreshTtl') });
    return { access_token: access, refresh_token: refresh };
  }
}
