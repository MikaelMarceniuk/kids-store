import type { Session, User } from '@prisma/client';

export type CheckIfRefreshTokenIsValidResponse = Session & {
  user: User;
};
