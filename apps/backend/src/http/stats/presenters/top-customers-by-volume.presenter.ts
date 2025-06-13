type TopCustomersByVolumePresenterParams = {
  id: string;
  name: string;
  amount: number;
  price: number;
};

export class TopCustomersByVolumePresenter {
  id: string;
  name: string;
  amount: number;
  price: number;

  constructor(params: TopCustomersByVolumePresenterParams) {
    this.id = params.id;
    this.name = params.name;
    this.amount = params.amount;
    this.price = params.price;
  }
}
