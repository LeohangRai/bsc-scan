import 'reflect-metadata';
import './helpers/set-bsc-scan-tokens.helper'; // sets api url and api key tokens on the typedi container
import job from './jobs/fetch-wallet-balance.job';
import connectDB from './database/connection';

connectDB();
job.start();
