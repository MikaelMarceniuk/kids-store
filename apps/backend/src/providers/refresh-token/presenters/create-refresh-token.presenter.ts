type CreateRefreshTokenPresenterParams = {
  refreshToken: string;
  refreshTokenExpirationDate: Date;
};

export class CreateRefreshTokenPresenter {
  refreshToken: string;
  refreshTokenExpirationDate: Date;

  constructor({
    refreshToken,
    refreshTokenExpirationDate,
  }: CreateRefreshTokenPresenterParams) {
    this.refreshToken = refreshToken;
    this.refreshTokenExpirationDate = refreshTokenExpirationDate;
  }
}
