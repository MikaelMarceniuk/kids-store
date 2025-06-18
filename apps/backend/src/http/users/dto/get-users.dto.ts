import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class GetUsersDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  role?: Role[];
}
