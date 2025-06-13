import { Role, User } from '@prisma/client';

export class GetUserPresenter {
  id: string;
  name: string;
  email: string;
  role: Role;

  constructor({ id, name, email, role }: User) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
}
