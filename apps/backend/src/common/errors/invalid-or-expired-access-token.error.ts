import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base-error.error';

export class InvalidOrExpiredAccessTokenError extends BaseError {
  constructor() {
    super({
      message: 'Invalid or expired access token.',
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}
