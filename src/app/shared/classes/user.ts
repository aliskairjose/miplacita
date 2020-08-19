import { Store } from './store';
export class User {
  id?: string;
  fullname: string;
  email: string;
  role: string;
  stores?: Store[];
}
