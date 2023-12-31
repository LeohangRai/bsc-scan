import { Inject, Service } from 'typedi';
import { WalletService } from './wallet.service';
import { Request, Response } from 'express';
import { AddWalletsDto } from './dtos/add-wallets.dto';
import { UserDocument } from '../models/user';
import { UpdateWalletDto } from './dtos/update-wallet.dto';
import { GetWalletTrendDto } from './dtos/get-wallet-trend.dto';

@Service()
export class WalletController {
  constructor(@Inject() private readonly service: WalletService) {
    this.add = this.add.bind(this);
    this.get = this.get.bind(this);
    this.getOneById = this.getOneById.bind(this);
    this.updateOneById = this.updateOneById.bind(this);
    this.delete = this.delete.bind(this);
    this.getWalletBalanceTrend = this.getWalletBalanceTrend.bind(this);
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
    const wallet = await this.service.getOneById(id, user._id);
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

  async delete(req: Request, res: Response) {
    const user = req.user as UserDocument;
    const { id } = req.params;
    const wallet = await this.service.delete(id, user._id);
    return res.status(200).json({
      status: 'success',
      data: wallet
    });
  }

  async getWalletBalanceTrend(req: Request, res: Response) {
    const user = req.user as UserDocument;
    const { id } = req.params;
    const { type } = req.query as GetWalletTrendDto;
    const trendData = await this.service.getWalletBalanceTrend(
      id,
      user._id,
      type
    );
    return res.status(200).json({
      status: 'success',
      data: trendData
    });
  }
}
