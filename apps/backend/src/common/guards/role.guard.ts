import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Type,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { RequestWithUser } from '../types/request-with-user.type';

export function RoleGuard(allowedRoles: Role[]): Type<CanActivate> {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest<RequestWithUser>();
      const user = req.user;

      try {
        if (!user) throw new UserNotFoundError();

        const hasPermission = allowedRoles.includes(user.role);

        if (!hasPermission) {
          throw new ForbiddenException(
            `User does not have permission to access this resource.`,
          );
        }

        return true;
      } catch (err) {
        throw err instanceof ForbiddenException ||
          err instanceof UserNotFoundError
          ? err
          : new InternalServerErrorException(
              'Unexpected error during permission check',
            );
      }
    }
  }

  return RoleGuardMixin;
}
