export interface Plan {
  _id: string;
  active: boolean;
  name: string;
  description: string;
  price: number;
  currencyPay: string;
  retireBank: boolean;
  onlineStore: boolean;
  deliveryService: boolean;
  inventoryService: boolean;
  payRate: string;
  linkPay: boolean;
}
