import { HttpStatus } from '@nestjs/common';
import { BaseError } from '../bases/error.base';

export class UserNotFoundError extends BaseError {
  constructor() {
    super({ message: 'User not found', statusCode: HttpStatus.NOT_FOUND });
  }
}
