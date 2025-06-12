import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterDTO {
  @Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'string') return value.trim();
    return value as string;
  })
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsStrongPassword()
  @IsString()
  password!: string;
}
