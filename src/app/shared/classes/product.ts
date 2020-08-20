export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: string;
  quantity: number;
  category_id: string;
  stock_control: boolean;
  store_id: string;
  status: string;
  category: string;
  images: Images[];
}

export interface Images {
  url: string;
  principal: boolean;
}
