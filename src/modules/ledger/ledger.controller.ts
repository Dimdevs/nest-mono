import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LedgerService } from './ledger.service';
import { TransferDto } from './dto/transfer.dto';

@UseGuards(JwtAuthGuard)
@Controller('ledger')
export class LedgerController {
  constructor(private service: LedgerService) {}
  @Post('transfer')
  async transfer(@Req() req: any, @Body() dto: TransferDto) {
    const actor = req.user?.sub as string;
    return this.service.transfer(actor, dto);
  }
}
