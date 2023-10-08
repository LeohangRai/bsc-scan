import { Inject, Service } from 'typedi';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UserDocument } from '../models/user';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Service()
export class AuthController {
  constructor(@Inject() private readonly service: AuthService) {
    this.register = this.register.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }

  async register(req: Request, res: Response) {
    const { username, password, confirmPassword, email, contact, gender, age } =
      req.body as RegisterUserDto;
    const user = await this.service.register({
      username,
      password,
      confirmPassword,
      email,
      contact,
      gender,
      age
    });
    return res.status(201).json({
      status: 'success',
      data: user
    });
  }

  async getProfile(req: Request, res: Response) {
    const user = req.user as UserDocument;
    const profile = await this.service.findOneBy({
      _id: user._id
    });
    return res.status(200).json({
      status: 'success',
      data: profile
    });
  }

  async updateProfile(req: Request, res: Response) {
    const user = req.user as UserDocument;
    const { username, email, contact, gender, age } =
      req.body as UpdateProfileDto;
    const profile = await this.service.updateProfile(user.id, {
      username,
      email,
      contact,
      gender,
      age
    });
    return res.status(200).json({
      status: 'success',
      data: profile
    });
  }
}
