type TopCustomerByAverageSalePresenterParams = {
  id: string;
  name: string;
  averagePrice: number;
};

export class TopCustomerByAverageSalePresenter {
  id: string;
  name: string;
  averagePrice: number;

  constructor(params: TopCustomerByAverageSalePresenterParams) {
    this.id = params.id;
    this.name = params.name;
    this.averagePrice = params.averagePrice;
  }
}
