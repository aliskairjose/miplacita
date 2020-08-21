export interface Product {
  _id?: string;
  uuid?: string;
  name: string;
  description: string;
  price: string;
  quantity: number;
  stock_control: boolean;
  store_id: string;
  status: string;
  category: string;
  images: Images[];
  stock: number;
}

export interface Images {
  url: string;
  principal: boolean;
}
