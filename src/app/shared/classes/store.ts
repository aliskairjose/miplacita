import { User } from './user';
export interface Store {
  _id?: string;
  name?: string;
  description?: string;
  url_store?: string;
  phone?: string;
  currency?: string;
  email?: string;
  logo?: string;
  owner_id?: string | User;
  plan?: any;
  active?: boolean;
  created_at?: string;
  config?: Config;
  affiliate_program?: boolean;
}

export interface Config {
  font?: string;
  color?: string;
  _id?: string;
  images: [];
}
