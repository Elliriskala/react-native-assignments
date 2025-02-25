import {User, UserWithNoPassword} from 'hybrid-types/DBTypes';

type Credentials = Pick<User, 'username' | 'password'>;
type RegisterCredentials = Pick<User, 'username' | 'password' | 'email'>;

type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
};

export type {Credentials, RegisterCredentials, AuthContextType};
