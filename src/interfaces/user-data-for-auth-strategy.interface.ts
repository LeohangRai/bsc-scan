export interface UserDataForAuthStrategy {
  _id: string;
  username: string;
  token: string;
  isPasswordValid: (password: string) => boolean;
}
