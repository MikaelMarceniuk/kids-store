import { User } from '@prisma/client';
import { RequestWithCookies } from './request-with-cookies.type';

export interface RequestWithUser extends RequestWithCookies {
  user: User;
}
