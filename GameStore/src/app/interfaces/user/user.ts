import { Role } from '../../enums/auth.enum';
export interface IUserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  // userName: string;
  role?: Role | string;
}
