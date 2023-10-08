export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  contact?: string;
  gender: 'Male' | 'Female' | 'Others';
  age: number;
}
