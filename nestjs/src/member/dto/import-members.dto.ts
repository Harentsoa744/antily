import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';

export class ImportedMember {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class ImportMembersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportedMember)
  rows!: ImportedMember[];
}
