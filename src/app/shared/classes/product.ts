export interface Product {
  _id?: string;
  uuid?: string;
  name?: string;
  description?: string;
  price?: string;
  color?: string;
  store_id?: string;
  status?: string;
  category?: string;
  image?: [ string ];
  images?: Images[];
  stock?: number;
  store?: any;
  tax?: string;
  marketplace?: boolean;
  featured?: boolean;
  sold?: number;
  created_at?: string;
  quantity?: number;
}

interface Images {
  url: string;
  principal: boolean;
}
