import { User } from './user';
import { Response } from './response';

export interface AuthResponse extends Response<T> {
  user: User;
  role: string;
  token: string;
}
