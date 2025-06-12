import type { Session, User } from 'generated/prisma';

export type CheckIfRefreshTokenIsValidResponse = Session & {
  user: User;
};
