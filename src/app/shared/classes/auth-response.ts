import { User } from './user';
import { Response } from './response';

export class AuthResponse extends Response {
  user: User;
  role: string;
  token: string;
}
