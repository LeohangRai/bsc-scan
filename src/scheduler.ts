import job from './jobs/fetch-wallet-balance.job';
import connectDB from './database/connection';

connectDB();
job.start();
