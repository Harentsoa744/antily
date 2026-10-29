import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class ImportedMembership {
  @IsNotEmpty()
  @IsString()
  territoryId!: string;

  @IsOptional()
  @IsString()
  memberId?: string;

  @IsOptional()
  @IsString()
  roleDetail?: string;

  @IsNotEmpty()
  @IsNumber()
  status!: number;

  @IsOptional()
  @IsString()
  membershipFeeId?: string;

  @IsOptional()
  @IsString()
  membershipPaymentId?: string;
}

export class ImportMembershipsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportedMembership)
  rows!: ImportedMembership[];
}
