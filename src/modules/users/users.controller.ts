import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}
  @Get() list(@Query('page') page = 1, @Query('per_page') per = 25) { return this.service.list(+page, +per); }
  @Get(':id') get(@Param('id') id: string) { return this.service.get(id); }
}
