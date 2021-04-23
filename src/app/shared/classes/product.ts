import { Store } from './store';
export interface Product {
  _id?: string;
  uuid?: string;
  name?: string;
  type?: string; // variable si esta vacio es producto base,
  parent?: string; // Id del producto base,
  color?: any; // Id del color
  size?: any; // Id del tamaño,
  description?: string;
  price?: number;
  colors?: string[];
  store_id?: string;
  status?: string;
  category?: string;
  subcategory?: string;
  stock?: number;
  store?: Store;
  tax?: number;
  marketplace?: boolean;
  featured?: boolean;
  sold?: number;
  created_at?: string;
  quantity?: number;
  deliveryDays?: string;
  prefered?: boolean;
  images?: Images[];
}

export interface Images {
  url?: string;
  principal?: boolean;
}

export interface Color {
  _id?: string;
  created_at?: string;
  deleted?: boolean;
  name?: string;
  store?: string;
  type?: string
  updated_at?: string;
  value?: string;
}
