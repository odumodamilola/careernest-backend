import mongoose from "mongoose";

// MongoDB connection function
export const connectDB = async () => {
  try {
    const dbUri = process.env.MONGODB_URI || "mongodb://localhost:27017/careerNest";
    
    // Connect to MongoDB
    await mongoose.connect(dbUri);
    
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on("error", err => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// Handle application termination
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});
