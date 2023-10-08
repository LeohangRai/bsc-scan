import { RegisterUserDto } from './register-user.dto';

export type UpdateProfileDto = Partial<
  Omit<RegisterUserDto, 'password' | 'confirmPassword'>
>;
