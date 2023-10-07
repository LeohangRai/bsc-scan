export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
  contact?: string;
  gender: 'Male' | 'Female' | 'Others';
  age: number;
}
