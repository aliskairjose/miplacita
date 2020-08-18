import { User } from './user';
import { Response } from './response';

export class LoginResponse extends Response {
  user: User;
  role: string;
  token: string;
}
