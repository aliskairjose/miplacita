import { Store } from './store';
export class User {
  _id?: string;
  avatar?: string;
  fullname?: string;
  email?: string;
  role?: string;
  stores?: Store[];
}
