import { Inject, Service } from 'typedi';
import Wallet from '../models/wallet';
import { WalletBalanceHistory } from '../models/wallet-balance-history';
import { BscScanService } from './core/bsc-scan.service';

@Service()
export class WalletService {
  private readonly model = Wallet;
  private readonly walletBalanceHistoryModel = WalletBalanceHistory;
  constructor(@Inject() private readonly bscScanService: BscScanService) {}

  getAllWallets() {
    return this.model.find({}).exec();
  }

  getBalanceDataOfWalletAddr(address: string) {
    return this.bscScanService.getBalanceOfWalletAddress(address);
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
