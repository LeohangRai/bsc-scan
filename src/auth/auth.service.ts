import { Service } from 'typedi';
import User from '../models/user';
import { RegisterUserDto } from './dtos/register-user.dto';
import { FilterQuery } from 'mongoose';

@Service()
export class AuthService {
  private readonly model = User;

  parseData(userData: Partial<RegisterUserDto>) {
    const parsed: Record<string, any> = {};
    const keys = Object.keys(userData);
    for (const key of keys) {
      const currKey = key as keyof RegisterUserDto;
      const value = userData[currKey];
      if (typeof value !== 'undefined') {
        parsed[currKey] = value;
      }
    }
    return parsed as Partial<RegisterUserDto>;
  }

  async register({ username, email, contact, gender, age }: RegisterUserDto) {
    const parsedData = this.parseData({
      username,
      email,
      contact,
      gender,
      age
    });
    const data = new this.model(parsedData);
    return data.save();
  }

  findOneByEmail(email: string) {
    return this.model.findOne({ email }).exec();
  }

  findOneBy(condition: FilterQuery<typeof User>) {
    return this.model.findOne(condition).exec();
  }
}
