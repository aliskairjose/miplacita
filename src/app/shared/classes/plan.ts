export interface Plan {
  price?: number;
  currencyPay?: string;
  payRate?: string;
  linkPay?: boolean;
  retireBank?: boolean;
  onlineStore?: boolean;
  deliveryService?: boolean;
  inventoryService?: boolean;
  active?: true;
  created_at?: string;
  updated_at?: string;
  _id?: string;
  name?: string;
  description?: string;
}
