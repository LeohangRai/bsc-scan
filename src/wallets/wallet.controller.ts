import { Inject, Service } from 'typedi';
import { WalletService } from './wallet.service';
import { Request, Response } from 'express';
import { AddWalletsDto } from './dtos/add-wallets.dto';
import { UserDocument } from '../models/user';
import { UpdateWalletDto } from './dtos/update-wallet.dto';

@Service()
export class WalletController {
  constructor(@Inject() private readonly service: WalletService) {
    this.add = this.add.bind(this);
    this.get = this.get.bind(this);
    this.getOneById = this.getOneById.bind(this);
    this.updateOneById = this.updateOneById.bind(this);
  }

  async add(req: Request, res: Response) {
    const walletData = req.body as AddWalletsDto;
    const user = req.user as UserDocument;
    const { walletAddresses } = walletData;
    const wallets = await this.service.addWalletAddresses(
      walletAddresses,
      user
    );
    return res.status(201).json({
      status: 'success',
      data: wallets
    });
  }

  async get(req: Request, res: Response) {
    const user = req.user as UserDocument;
    const wallets = await this.service.getWalletsByUserId(user._id);
    return res.status(200).json({
      status: 'success',
      data: wallets
    });
  }

  async getOneById(req: Request, res: Response) {
    const user = req.user as UserDocument;
    const { id } = req.params;
    const wallet = await this.service.findOneBy({
      _id: id,
      user_id: user.id
    });
    return res.status(200).json({
      status: 'success',
      data: wallet
    });
  }

  async updateOneById(req: Request, res: Response) {
    const user = req.user as UserDocument;
    const payload = req.body as UpdateWalletDto;
    const { id } = req.params;
    const wallet = await this.service.updateWalletById(id, user._id, payload);
    return res.status(200).json({
      status: 'success',
      data: wallet
    });
  }
}
