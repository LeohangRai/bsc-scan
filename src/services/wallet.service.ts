import Wallet from '../models/wallet';
import BscScanService from './core/bsc-scan.service';

class WalletService {
  model = Wallet;
  bscScanService = new BscScanService();

  async getAllWallets() {
    const wallets = await Wallet.find({}).exec();
    return wallets;
  }

  async getBalanceDataForWalletId() {
    return this.bscScanService.getBalanceOfWalletAddress(
      '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3'
    );
  }
}

export default WalletService;
