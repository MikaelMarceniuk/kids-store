import { HttpStatus } from '@nestjs/common';
import { BaseError } from '../bases/error.base';

export class RefreshTokenMissingError extends BaseError {
  constructor() {
    super({
      message: 'Refresh token is missing from request.',
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}
