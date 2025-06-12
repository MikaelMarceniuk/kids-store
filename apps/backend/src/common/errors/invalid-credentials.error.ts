import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base-error.error';

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super({
      message: 'Invalid credentials.',
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}
