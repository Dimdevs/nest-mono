import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/db/prisma.service';
import { TransferDto } from './dto/transfer.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class LedgerService {
  constructor(private prisma: PrismaService) {}

  /**
   * Safe transfer using single-connection transaction + row-level locks.
   * - Locks rows FOR UPDATE in deterministic order to avoid deadlocks
   * - Checks balance and prevents double-spend
   * - Creates append-only Ledger row and AuditLog
   * - Idempotent by 'reference' unique constraint
   */
  async transfer(actorUserId: string, dto: TransferDto) {
    if (dto.from_account_id === dto.to_account_id) throw new BadRequestException({ code: 'SAME_ACCOUNT' });
    const ref = dto.reference ?? `ref_${randomUUID()}`;

    return this.prisma.$transaction(async (tx) => {
      // lock order by account id to reduce deadlock chance
      const [a, b] = [dto.from_account_id, dto.to_account_id].sort();
      await tx.$executeRawUnsafe(`SELECT id FROM "Account" WHERE id = $1 FOR UPDATE`, a);
      await tx.$executeRawUnsafe(`SELECT id FROM "Account" WHERE id = $1 FOR UPDATE`, b);

      // Idempotency by reference uniqueness: if exists, return success (or throw? choose success)
      const existing = await tx.ledger.findUnique({ where: { reference: ref } });
      if (existing) return existing;

      const from = await tx.account.findUnique({ where: { id: dto.from_account_id } });
      const to = await tx.account.findUnique({ where: { id: dto.to_account_id } });
      if (!from || !to) throw new BadRequestException({ code: 'ACCOUNT_NOT_FOUND' });

      if (from.balanceCents < dto.amount_cents) throw new BadRequestException({ code: 'INSUFFICIENT_FUNDS' });

      await tx.account.update({
        where: { id: from.id },
        data: { balanceCents: { decrement: dto.amount_cents } },
      });
      await tx.account.update({
        where: { id: to.id },
        data: { balanceCents: { increment: dto.amount_cents } },
      });

      const ledger = await tx.ledger.create({
        data: {
          fromAccountId: from.id,
          toAccountId: to.id,
          amountCents: dto.amount_cents,
          reference: ref,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: actorUserId,
          action: 'TRANSFER',
          resource: 'ledger',
          payload: {
            from: from.id, to: to.id, amount_cents: dto.amount_cents, reference: ref,
          } as any,
        },
      });

      return ledger;
    });
  }
}
