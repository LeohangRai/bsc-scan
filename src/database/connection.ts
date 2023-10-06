import mongoose from 'mongoose';
import { DB_CONFIGS } from '../configs';

function connectDB() {
  mongoose.connect(DB_CONFIGS.URL);
  const database = mongoose.connection;
  database.on('error', (error) => {
    console.log('error:', error);
  });
  database.once('connected', () => {
    console.log('Database connection successful!');
  });
  return mongoose;
}

export default connectDB;
