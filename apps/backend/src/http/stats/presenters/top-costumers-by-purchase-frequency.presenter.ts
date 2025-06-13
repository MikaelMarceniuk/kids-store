type TopCustomerByPurchaseFrequencyPresenterParams = {
  id: string;
  name: string;
  uniqueDays: number;
};

export class TopCustomerByPurchaseFrequencyPresenter {
  id: string;
  name: string;
  uniqueDays: number;

  constructor(params: TopCustomerByPurchaseFrequencyPresenterParams) {
    this.id = params.id;
    this.name = params.name;
    this.uniqueDays = params.uniqueDays;
  }
}
