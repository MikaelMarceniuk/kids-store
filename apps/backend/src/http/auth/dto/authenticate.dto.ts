import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class AuthenticateDTO {
  @IsEmail()
  @IsString()
  email!: string;

  @IsStrongPassword()
  @IsString()
  password!: string;
}
