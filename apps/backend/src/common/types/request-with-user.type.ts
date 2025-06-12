import { User } from 'generated/prisma';
import { RequestWithCookies } from './request-with-cookies.type';

export interface RequestWithUser extends RequestWithCookies {
  user: User;
}
