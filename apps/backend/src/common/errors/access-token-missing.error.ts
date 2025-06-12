import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base-error.error';

export class AccessTokenMissingError extends BaseError {
  constructor() {
    super({
      message: 'Access token is missing from request.',
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}
