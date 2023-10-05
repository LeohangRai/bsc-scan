import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from '../models/user';
import Wallet from '../models/wallet';
import userSeedData from '../data/users';
import walletSeedData from '../data/wallets';

const dbUrl = process.env.DB_URI ?? '';
mongoose.connect(dbUrl);
const database = mongoose.connection;
database.on('error', (error) => {
  console.log('error:', error);
});
database.once('connected', () => {
  console.log('Database connection successful!\nSeeding data...');
});

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
  await seedUsers();
  await seedWallets();
};

seedData().then(() => {
  mongoose.connection.close();
  console.log('Data seeding complete!');
});
