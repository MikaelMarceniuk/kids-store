import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(Role)
  role: Role;
}
