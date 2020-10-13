export interface Product {
  _id?: string;
  uuid?: string;
  name?: string;
  type?: string; // variable si esta vacio es producto base,
  parent?: string; // Id del producto base,
  color?: string; // Id del color
  size?: string; // Id del tamaño,
  description?: string;
  price?: string;
  colors?: string[];
  store_id?: string;
  status?: string;
  category?: string;
  images?: Images[];
  stock?: number;
  store?: any;
  tax?: string;
  marketplace?: boolean;
  featured?: boolean;
  sold?: number;
  created_at?: string;
  quantity?: number;
  deliveryDays?: number;
}

export interface Images {
  url?: string;
  principal?: boolean;
}
