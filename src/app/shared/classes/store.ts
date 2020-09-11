import { Plan } from './plan';
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
  plan?: Plan | string;
  active?: boolean;
  created_at?: string;
}
