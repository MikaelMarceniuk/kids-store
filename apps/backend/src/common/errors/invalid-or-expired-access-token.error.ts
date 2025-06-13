import { HttpStatus } from '@nestjs/common';
import { BaseError } from '../bases/error.base';

export class InvalidOrExpiredAccessTokenError extends BaseError {
  constructor() {
    super({
      message: 'Invalid or expired access token.',
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}
