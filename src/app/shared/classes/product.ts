export interface Product {
  _id?: string;
  uuid?: string;
  name?: string;
  description?: string;
  price?: string;
  quantity?: number;
  stock_control?: boolean;
  store_id?: string;
  status?: string;
  category?: string;
  image?: [string];
  stock?: number;
  store?: string;
  tax?: string;
  new?: boolean;
}
