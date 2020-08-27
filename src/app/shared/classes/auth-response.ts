import { User } from './user';
import { Response } from './response';

export interface AuthResponse {
  user: User;
  role: string;
  token: string;
  message: Array<string>;
  success: boolean;
}
