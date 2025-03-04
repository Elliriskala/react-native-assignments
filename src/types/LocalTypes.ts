import {MediaItemWithOwner, User, UserWithNoPassword} from 'hybrid-types/DBTypes';

type Credentials = Pick<User, 'username' | 'password'>;
type RegisterCredentials = Pick<User, 'username' | 'password' | 'email'>;

type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
};

export type NavigatorType = {
  // tab screen
  'All Media': undefined;
  'My Profile': undefined;
  Upload: undefined;
  // stack screen
  Back: undefined;
  Single: {item: MediaItemWithOwner};
  'My Files': undefined;
  'My Media App': undefined;
}

export type {Credentials, RegisterCredentials, AuthContextType};
