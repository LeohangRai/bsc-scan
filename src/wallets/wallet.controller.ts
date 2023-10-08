import { Inject, Service } from 'typedi';
import { WalletService } from './wallet.service';
import { Request, Response } from 'express';
import { AddWalletsDto } from './dtos/add-wallets.dto';
import { UserDocument } from '../models/user';

@Service()
export class WalletController {
  constructor(@Inject() private readonly service: WalletService) {
    this.add = this.add.bind(this);
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
}
