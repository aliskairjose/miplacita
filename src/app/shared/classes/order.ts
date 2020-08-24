import { Product } from './product';
export interface Order {
  _id?: string;
  user: string; // Id del usuario
  store: string; // Id de la tienda
  status: string;
  amount: number;
  tax: number;
  created_at: string;
  updated_at: string;
  shipment_option: ShipmentOptions  ;
  items: Array<Item>;
}

export interface Item {
  _id: string;
  product: string; // Id de producto
  quantity: number;
  tax: number;
  amount_single: number;
  amount_amount: number;
}

export interface ShipmentOptions {
  _id: string;
  name: string;
  active: boolean;
  deleted: boolean;
  price: number;
  store_id: string;
}