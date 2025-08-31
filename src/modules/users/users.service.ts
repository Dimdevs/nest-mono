import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/db/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  list(page = 1, perPage = 25) {
    return this.prisma.user.findMany({ skip: (page-1)*perPage, take: perPage, where: { deletedAt: null }, select: { id: true, email: true, role: true, createdAt: true } });
  }
  async get(id: string) {
    const u = await this.prisma.user.findFirst({ where: { id, deletedAt: null }, select: { id: true, email: true, role: true, createdAt: true } });
    if (!u) throw new NotFoundException({ code: 'USER_NOT_FOUND' });
    return u;
  }
}
