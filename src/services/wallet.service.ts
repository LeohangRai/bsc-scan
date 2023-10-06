import { Inject, Service } from 'typedi';
import Wallet from '../models/wallet';
import { BscScanService } from './core/bsc-scan.service';

@Service()
export class WalletService {
  model = Wallet;
  constructor(@Inject() private readonly bscScanService: BscScanService) {}

  getAllWallets() {
    return this.model.find({}).exec();
  }

  getBalanceDataOfWalletAddr(address: string) {
    return this.bscScanService.getBalanceOfWalletAddress(address);
  }

  updateBalanceDatOfWalletId(id: string, balance: string) {
    return this.model.findByIdAndUpdate(id, { balance }, { new: true });
  }
}
