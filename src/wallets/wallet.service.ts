import { Inject, Service } from 'typedi';
import Wallet, { WalletDocument } from '../models/wallet';
import { WalletBalanceHistory } from '../models/wallet-balance-history';
import { BscScanService } from '../services/core/bsc-scan.service';
import { UserDocument } from '../models/user';
import CustomError from '../errors/custom-error';
import { FilterQuery } from 'mongoose';
import { UpdateWalletDto } from './dtos/update-wallet.dto';
import { WalletTrendType } from './types/wallet.trend.types';

@Service()
export class WalletService {
  private readonly model = Wallet;
  private readonly walletBalanceHistoryModel = WalletBalanceHistory;
  constructor(@Inject() private readonly bscScanService: BscScanService) {}

  getAllWallets() {
    return this.model.find({}).exec();
  }

  findOneBy(condition: FilterQuery<WalletDocument>) {
    return this.model.findOne(condition).exec();
  }

  getWalletsByUserId(user_id: string) {
    return this.model.find({ user_id }).exec();
  }

  getBalanceDataOfWalletAddr(address: string) {
    return this.bscScanService.getBalanceOfWalletAddress(address);
  }

  async addWalletAddresses(addresses: string[], user: UserDocument) {
    const wallets: { address: string; balance: string; user_id: number }[] = [];
    try {
      for (const address of addresses) {
        const { result } = await this.getBalanceDataOfWalletAddr(address);
        wallets.push({
          address,
          balance: result,
          user_id: user._id
        });
      }
      return this.model.insertMany(wallets);
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.message == 'Error! Invalid address format') {
          throw new CustomError(
            400,
            'One or more of the addresses you provided are invalid.'
          );
        }
      }
      throw error;
    }
  }

  async getOneById(id: string, userId: string) {
    const wallet = await this.model
      .findOne({
        _id: id
      })
      .lean()
      .exec();
    if (!wallet) {
      throw new CustomError(404, 'Wallet not found');
    }
    if (userId != String(wallet.user_id)) {
      throw new CustomError(403, 'Unauthorized');
    }
    return wallet;
  }

  async updateWalletById(id: string, userId: string, payload: UpdateWalletDto) {
    const wallet = await this.model
      .findOne({
        _id: id
      })
      .exec();
    if (!wallet) {
      throw new CustomError(404, 'Wallet not found');
    }
    if (userId != String(wallet.user_id)) {
      throw new CustomError(403, 'Unauthorized');
    }
    wallet.address = payload.address ? payload.address : wallet.address;
    wallet.name_tag = payload.name_tag ? payload.name_tag : wallet.name_tag;
    return wallet.save();
  }

  async updateBalanceDatOfWalletId(id: string, balance: string) {
    /*
      apparently, insertion into a time-series collection is not allowed in a multi-document transaction.
      that's why I could not make use of a transaction here
    */
    const updatedWallet = await this.model
      .findByIdAndUpdate(id, { balance }, { new: true })
      .exec();
    if (updatedWallet) {
      const { address } = updatedWallet;
      const data = new this.walletBalanceHistoryModel({
        address,
        balance,
        timestamp: new Date()
      });
      await data.save();
    }
    return updatedWallet;
  }

  async delete(id: string, userId: string) {
    const wallet = await this.model
      .findOne({
        _id: id
      })
      .exec();
    if (!wallet) {
      throw new CustomError(404, 'Wallet not found');
    }
    if (userId != String(wallet.user_id)) {
      throw new CustomError(403, 'Unauthorized');
    }
    return wallet.deleteOne();
  }

  async getWalletBalanceTrend(
    id: string,
    userId: string,
    type: WalletTrendType = 'daily'
  ) {
    const wallet = await this.model
      .findOne({
        _id: id
      })
      .exec();
    if (!wallet) {
      throw new CustomError(404, 'Wallet not found');
    }
    if (userId != String(wallet.user_id)) {
      throw new CustomError(403, 'Unauthorized');
    }
    switch (type) {
      case 'monthly':
        return this.walletBalanceHistoryModel.getMonthlyAddressBalanceChange(
          wallet.address
        );
      case 'weekly':
        return this.walletBalanceHistoryModel.getWeeklyAddressBalanceChange(
          wallet.address
        );
      case 'daily':
      default:
        return this.walletBalanceHistoryModel.getDailyAddressBalanceChange(
          wallet.address
        );
    }
  }
}
