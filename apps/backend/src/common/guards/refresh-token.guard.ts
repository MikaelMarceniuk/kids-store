import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SessionService } from 'src/providers/session/session.service';
import { RefreshTokenMissingError } from '../errors/refresh-token-missing.error';
import { RequestWithCookies } from '../types/request-with-cookies.type';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithCookies>();
    const refreshToken = request.cookies?.['refresh_token'];

    if (!refreshToken) throw new RefreshTokenMissingError();

    await this.sessionService.checkIfRefreshTokenIsValid(refreshToken);

    return true;
  }
}
