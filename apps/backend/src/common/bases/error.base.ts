import { HttpException } from '@nestjs/common';

type BaseErrorParams<X = undefined> = {
  message: string;
  errors?: string[];
  statusCode: number;
  custom?: X;
};

export class BaseError<X = any> extends HttpException {
  constructor({ message, statusCode, custom }: BaseErrorParams<X>) {
    super({ message, statusCode, custom }, statusCode);
  }
}
