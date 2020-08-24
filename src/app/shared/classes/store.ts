import { Product } from './product';
export interface Store {
  _id?: string;
  name?: string;
  description?: string;
  url_store?: string;
  phone?: string;
  currency?: string;
  email?: string;
  logo?: string;
  owner_id?: string;
  plan?: string;
  active?: boolean;
}
