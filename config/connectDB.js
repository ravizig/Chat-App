import mongoose from 'mongoose';
import uuidPlugin from '../plugins/uuidPlugin.js';

mongoose.plugin(uuidPlugin);

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URL);

    console.log(`MongoDB connected to: ${connection.connection.name}`);
  } catch (error) {
    console.log('Something went wrong: ', error);
  }
};

export default connectDB;
