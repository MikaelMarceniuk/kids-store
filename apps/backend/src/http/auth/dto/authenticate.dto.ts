import { IsEmail, IsString } from 'class-validator';

export class AuthenticateDTO {
  @IsEmail()
  @IsString()
  email!: string;

  @IsString()
  password!: string;
}
