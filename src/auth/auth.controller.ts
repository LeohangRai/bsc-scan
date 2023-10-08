import { Inject, Service } from 'typedi';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UserDocument } from '../models/user';

@Service()
export class AuthController {
  constructor(@Inject() private readonly service: AuthService) {
    this.register = this.register.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  async register(req: Request, res: Response) {
    const userData = req.body as RegisterUserDto;
    const user = await this.service.register(userData);
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
}
