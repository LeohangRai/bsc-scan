import { WalletService } from '../services/wallet.service';
import { Inject, Service } from 'typedi';

@Service()
export class WalletJob {
  constructor(@Inject() private readonly walletService: WalletService) {
    this.updateBalanceOfAllWallets = this.updateBalanceOfAllWallets.bind(this);
  }

  async updateBalanceOfAllWallets() {
    const wallets = await this.walletService.getAllWallets();
    const updateWalletPromises = [];
    for (const wallet of wallets) {
      const { result: newBalance } =
        await this.walletService.getBalanceDataOfWalletAddr(wallet.address);
      updateWalletPromises.push(
        this.walletService.updateBalanceDatOfWalletId(wallet.id, newBalance)
      );
    }
    await Promise.all(updateWalletPromises);
  }
}
