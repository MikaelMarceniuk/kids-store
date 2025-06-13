import { User } from '@prisma/client';
import { GetUserPresenter } from './get-users.presenter';

export type GetUserPaginationPresenterProps = {
  total: number;
  users: User[];
};

export class GetUsersPaginationPresenter {
  public total: number;
  public users: GetUserPresenter[];

  constructor(props: GetUserPaginationPresenterProps) {
    this.total = props.total;
    this.users = props.users.map((u) => new GetUserPresenter({ ...u }));
  }
}
