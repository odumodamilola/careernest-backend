import mongoose from 'mongoose';

// Create a MongoDB connection
const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables or use a default local URI
    const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/careernest';
    
    // Set Mongoose options
    const options = {
      autoIndex: true,
      autoCreate: true,
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(dbURI, options);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    return conn;
  } catch (error: any) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
