import { Inject, Service } from 'typedi';
import Wallet, { WalletDocument } from '../models/wallet';
import { WalletBalanceHistory } from '../models/wallet-balance-history';
import { BscScanService } from '../services/core/bsc-scan.service';
import { UserDocument } from '../models/user';
import CustomError from '../errors/custom-error';
import { FilterQuery } from 'mongoose';

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
}
