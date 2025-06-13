import { HttpStatus } from '@nestjs/common';
import { BaseError } from '../bases/error.base';

export class UserAlreadyExistsError extends BaseError {
  constructor() {
    super({ message: 'User already exists.', statusCode: HttpStatus.CONFLICT });
  }
}
