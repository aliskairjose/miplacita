import { User } from './user';
import { Store } from './store';
import { ShipmentOption } from './shipment-option';

export interface Order {
  _id?: string;
  status?: string;
  amount?: number;
  tax?: number;
  created_at?: string;
  updated_at?: string;
  user?: User;
  store?: Store;
  type?: string;
  sponsor_code?: string;
  shipment_option?: ShipmentOption;
  items?: Item[];
  address?: Address;
}

export interface Item {
  _id?: string;
  product_id?: string;
  product_name?: string;
  quantity?: number;
  tax?: number;
  unit_price?: number;
  total_price?: number; // unit_price   x quantity
}

export interface Address {
  id?: string;
  address?: string;
  landMark?: string;
  location?: [];
  phone?: number;
}



