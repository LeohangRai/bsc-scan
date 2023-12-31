import { Service } from 'typedi';
import { User } from '../models/user';
import { RegisterUserDto } from './dtos/register-user.dto';
import { FilterQuery } from 'mongoose';
import { UpdateProfileDto } from './dtos/update-profile.dto';

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

  async register(data: RegisterUserDto) {
    const parsedData = this.parseData(data);
    const userInstance = new this.model(parsedData);
    return userInstance.save();
  }

  findOneByEmail(email: string) {
    return this.model.findOne({ email }).exec();
  }

  findOneBy(condition: FilterQuery<typeof User>) {
    return this.model.findOne(condition).exec();
  }

  async updateProfile(id: string, payload: UpdateProfileDto) {
    const parsedData = this.parseData(payload);
    const newProfile = await this.model
      .findOneAndUpdate({ _id: id }, parsedData, {
        new: true
      })
      .exec();
    /* because 'findOneAndUpdate()' returns the original document by default. */
    return newProfile?.toJSON();
  }
}
