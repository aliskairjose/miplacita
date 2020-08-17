import { Product } from './product';
export interface Order {
  id?: string;
  products: Product[];
  store: string;
  shipment_option: string;
  address: Address;
}

export interface Address {
  address: string;
  landMark: string;
  location: [];
  phone: string;
}
