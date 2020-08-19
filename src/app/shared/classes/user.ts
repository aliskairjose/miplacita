import { Store } from './store';
export class User {
  id?: string;
  avatar?: string;
  fullname: string;
  email: string;
  role: string;
  stores?: Store[];
}
