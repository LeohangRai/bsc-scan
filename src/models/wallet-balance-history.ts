import { Document, Model, model, Schema } from 'mongoose';

export type WalletBalanceHistoryDocument = {
  address: string;
  balance: string;
  timestamp: string;
} & Document;

const walletBalanceHistorySchema = new Schema(
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

walletBalanceHistorySchema.statics.getAddressBalanceChange = async function (
  walletAddress: string
) {
  const pipeline: any[] = [
    {
      $match: {
        address: walletAddress
      }
    },
    {
      $sort: {
        timestamp: 1
      }
    },
    {
      $group: {
        _id: {
          address: '$address',
          day: { $dayOfMonth: '$timestamp' },
          week: { $week: '$timestamp' },
          month: { $month: '$timestamp' }
        },
        firstBalance: { $first: { $toDouble: '$balance' } },
        lastBalance: { $last: { $toDouble: '$balance' } }
      }
    },
    {
      $project: {
        _id: 0,
        address: '$_id.address',
        day: '$_id.day',
        week: '$_id.week',
        month: '$_id.month',
        dailyBalanceChange: { $subtract: ['$lastBalance', '$firstBalance'] },
        dailyBalanceChangePercentage: {
          $multiply: [
            {
              $divide: [
                { $subtract: ['$lastBalance', '$firstBalance'] },
                '$firstBalance'
              ]
            },
            100
          ]
        }
      }
    }
  ];
  return this.aggregate(pipeline).exec();
};

export const WalletBalanceHistory = model<WalletBalanceHistoryDocument>(
  'WalletBalanceHistory',
  walletBalanceHistorySchema
) as Model<WalletBalanceHistoryDocument> & {
  getAddressBalanceChange: (address: string) => Promise<any>;
};
