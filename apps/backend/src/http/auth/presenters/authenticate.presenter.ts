type AuthenticatePresenterParams = {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpirationDate: Date;
};

export class AuthenticatePresenter {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpirationDate: Date;

  constructor({
    accessToken,
    refreshToken,
    refreshTokenExpirationDate,
  }: AuthenticatePresenterParams) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.refreshTokenExpirationDate = refreshTokenExpirationDate;
  }
}
