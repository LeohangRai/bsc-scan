export type RegisterUserDto = {
  username: string;
  email: string;
  contact?: string;
  gender: 'Male' | 'Female' | 'Others';
  age: number;
};
