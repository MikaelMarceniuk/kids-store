import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base-error.error';

export class UserAlreadyExistsError extends BaseError {
  constructor() {
    super({ message: 'User already exists.', statusCode: HttpStatus.CONFLICT });
  }
}
