import { Inject, Service } from 'typedi';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RegisterUserDto } from './dtos/register-user.dto';

@Service()
export class AuthController {
  constructor(@Inject() private readonly service: AuthService) {
    this.register = this.register.bind(this);
  }

  async register(req: Request, res: Response) {
    const userData = req.body as RegisterUserDto;
    const user = await this.service.register(userData);
    return res.status(201).json({
      status: 'success',
      data: user
    });
  }
}
