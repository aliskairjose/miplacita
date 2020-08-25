import { Product } from './product';
import { User } from './user';
export interface Order {
  _id?: string;
  status?: string;
  amount?: number;
  tax?: number;
  created_at?: string;
  updated_at?: string;
  user?: User;
  shipment_option?: ShipmentOptions;
  items?: Item[];
}

export interface Item {
  _id?: string;
  product_id?: string;
  product_name?: string
  quantity?: number;
  tax?: number;
  unit_price?: number;
  total_price?: number; // unit_price   x quantity
}

export interface ShipmentOptions {
  _id?: string;
  name?: string;
  active?: boolean;
  deleted?: boolean;
  price?: number;
  store_id?: string;
}