import { HttpStatus } from '@nestjs/common';
import { BaseError } from '../bases/error.base';

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super({
      message: 'Invalid credentials.',
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}
