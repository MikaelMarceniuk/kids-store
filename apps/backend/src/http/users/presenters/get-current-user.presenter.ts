import { User } from 'generated/prisma';

export class GetCurrentUserPresenter {
  id: string;
  name: string;
  email: string;

  constructor({ id, name, email }: User) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}
