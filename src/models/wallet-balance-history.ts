import { Document, Model, model, Schema } from 'mongoose';

export interface WalletBalanceHistoryDocument extends Document {
  address: string;
  balance: string;
  timestamp: string;
}

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

walletBalanceHistorySchema.statics.getDailyAddressBalanceChange =
  async function (walletAddress: string) {
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
          dailyBalanceChange: {
            $abs: { $subtract: ['$lastBalance', '$firstBalance'] }
          },
          dailyBalanceChangePercentage: {
            $multiply: [
              {
                $divide: [
                  { $abs: { $subtract: ['$lastBalance', '$firstBalance'] } },
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

walletBalanceHistorySchema.statics.getWeeklyAddressBalanceChange =
  async function (walletAddress: string) {
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
          week: '$_id.week',
          month: '$_id.month',
          weeklyBalanceChange: {
            $abs: { $subtract: ['$lastBalance', '$firstBalance'] }
          },
          weeklyBalanceChangePercentage: {
            $multiply: [
              {
                $divide: [
                  { $abs: { $subtract: ['$lastBalance', '$firstBalance'] } },
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

walletBalanceHistorySchema.statics.getMonthlyAddressBalanceChange =
  async function (walletAddress: string) {
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
          month: '$_id.month',
          monthlyBalanceChange: {
            $abs: { $subtract: ['$lastBalance', '$firstBalance'] }
          },
          monthlyBalanceChangePercentage: {
            $multiply: [
              {
                $divide: [
                  { $abs: { $subtract: ['$lastBalance', '$firstBalance'] } },
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
  getDailyAddressBalanceChange: (address: string) => Promise<any>;
  getMonthlyAddressBalanceChange: (address: string) => Promise<any>;
  getWeeklyAddressBalanceChange: (address: string) => Promise<any>;
};
