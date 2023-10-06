import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const dbUrl = process.env.DB_URI ?? '';

function connectDB() {
  mongoose.connect(dbUrl);
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
