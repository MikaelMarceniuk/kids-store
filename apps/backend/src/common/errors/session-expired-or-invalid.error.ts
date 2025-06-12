import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base-error.error';

export class SessionExpiredOrInvalidError extends BaseError {
  constructor() {
    super({
      message: 'Session is expired or invalid.',
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}
