import { Service } from 'typedi';
import User from '../models/user';
import { RegisterUserDto } from './dtos/register-user.dto';

@Service()
export class AuthService {
  private readonly model = User;

  async register({ username, email, contact, gender, age }: RegisterUserDto) {
    const data = new this.model({
      username,
      email,
      contact,
      gender,
      age
    });
    return data.save();
  }
}
