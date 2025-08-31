import { IsUUID, IsInt, Min, IsOptional, IsString } from 'class-validator';
export class TransferDto {
  @IsUUID() from_account_id!: string;
  @IsUUID() to_account_id!: string;
  @IsInt() @Min(1) amount_cents!: number;
  @IsOptional() @IsString() reference?: string;
}
