import { HttpStatus } from '@nestjs/common';
import { BaseError } from '../bases/error.base';

export class SessionExpiredOrInvalidError extends BaseError {
  constructor() {
    super({
      message: 'Session is expired or invalid.',
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}
