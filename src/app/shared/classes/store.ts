import { Product } from './product';
export interface Store {
  id?: string;
  name: string;
  description: string;
  url_store: string;
  phone: string;
  email: string;
  logo: string;
  owner_id: string;
  plan: string;
}
