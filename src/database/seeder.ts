import { User } from '../models/user';
import Wallet from '../models/wallet';
import userSeedData from '../data/users';
import walletSeedData from '../data/wallets';
import connectDB from './connection';
const connectionObj = connectDB();

const seedUsers = async () => {
  const userCount = await User.countDocuments({}).exec();
  if (!userCount) {
    await User.insertMany(userSeedData);
  }
};

const seedWallets = async () => {
  const walletCount = await Wallet.countDocuments({}).exec();
  if (!walletCount) {
    await Wallet.insertMany(walletSeedData);
  }
};

const seedData = async () => {
  console.log('🌳 Seeding data... 🌳');
  await seedUsers();
  await seedWallets();
};

seedData().then(() => {
  connectionObj.connection.close();
  console.log('Data seeding complete!');
});
