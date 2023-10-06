import mongoose from 'mongoose';

const walletBalanceHistorySchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true
    },
    balance: {
      type: String,
      trim: true
    },
    timestamp: Date
  },
  {
    timeseries: {
      timeField: 'timestamp',
      metaField: 'address',
      granularity: 'minutes'
    }
  }
);

const WalletBalanceHistory = mongoose.model(
  'WalletBalanceHistory',
  walletBalanceHistorySchema
);
export default WalletBalanceHistory;
