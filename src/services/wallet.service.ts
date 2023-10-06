import { Inject, Service } from 'typedi';
import Wallet from '../models/wallet';
import { BscScanService } from './core/bsc-scan.service';

@Service()
class WalletService {
  model = Wallet;
  constructor(@Inject() private readonly bscScanService: BscScanService) {}

  async getAllWallets() {
    const wallets = await Wallet.find({}).exec();
    console.log('wallets:', wallets);
    return wallets;
  }

  async getBalanceDataForWalletId() {
    return this.bscScanService.getBalanceOfWalletAddress(
      '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3'
    );
  }
}

export default WalletService;
