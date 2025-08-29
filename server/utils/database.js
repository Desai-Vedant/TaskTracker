import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // Parse the MongoDB URI to get the base connection without database
    const mongoURI = process.env.MONGODB_URI;
    const dbName = 'task-tracker';
    
    // First connect without database specification
    await mongoose.connect(mongoURI, {
      dbName: dbName // Explicitly specify the database name
    });
    
    // Get the database instance
    const db = mongoose.connection.db;
    
    // Database is automatically created when we connect with the dbName option
    console.log(`Connected to MongoDB database: ${dbName}`);
    
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit if database connection fails
  }
};

export default connectDB;
