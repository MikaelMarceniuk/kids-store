import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { PrismaService } from 'src/providers/database/prisma.service';
import { JwtService } from 'src/providers/jwt/jwt.service';
import { AccessTokenMissingError } from '../errors/access-token-missing.error';
import { InvalidOrExpiredAccessTokenError } from '../errors/invalid-or-expired-access-token.error';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { RequestWithUser } from '../types/request-with-user.type';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const accessToken = req.cookies['access_token'];

    if (!accessToken) {
      throw new AccessTokenMissingError();
    }

    try {
      const { userId: id } = await this.jwtService.verifyJwt(accessToken);
      const user = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) throw new UserNotFoundError();

      req.user = user;

      return true;
    } catch (err) {
      if (
        err instanceof TokenExpiredError ||
        err instanceof JsonWebTokenError
      ) {
        throw new InvalidOrExpiredAccessTokenError();
      }

      // TODO Directly passing the caught error may leak internal details. Consider logging the error internally and throwing a more generic error message to avoid exposing sensitive information.
      throw new InternalServerErrorException(err);
    }
  }
}
