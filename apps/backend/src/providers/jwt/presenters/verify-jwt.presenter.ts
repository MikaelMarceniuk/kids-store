interface VerifyJwtPresenterParams {
  userId: string;
  email: string;
}

export class VerifyJwtPresenter {
  userId: string;
  email: string;

  constructor({ userId, email }: VerifyJwtPresenterParams) {
    this.userId = userId;
    this.email = email;
  }
}
