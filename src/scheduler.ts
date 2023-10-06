import 'reflect-metadata';
import './helpers/set-bsc-scan-tokens.helper'; // sets api url and api key tokens on the typedi container
import cron from 'node-cron';
import connectDB from './database/connection';
import Container from 'typedi';
import { WalletJob } from './jobs/wallet.job';

connectDB();
const walletJob = Container.get(WalletJob);
const job = cron.schedule('5 * * * *', async function () {
  await walletJob.updateBalanceOfAllWallets();
  console.log(`Wallet balance update job run at ${new Date().toISOString()}`);
});

job.start();
