export interface Product {
  id?: string;
  title: string;
  description: string;
  price: string;
  quantity: number;
  category_id: string;
  stock_control: boolean;
  store_id: string;
  images: Images[];
}

export interface Images {
  url: string;
  principal: boolean;
}
