import cron from 'node-cron';
import WalletService from '../services/wallet.service';

const ws = new WalletService();
const job = cron.schedule('5 * * * *', async function () {
  const balanceData = await ws.getBalanceDataForWalletId();
  console.log('Balance data:', balanceData);
  console.log(`This is a job console at ${new Date().toISOString()}`);
});

export default job;
