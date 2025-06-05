import mongoose from "mongoose";

/**
 * Connects to MongoDB using Mongoose.
 * It reads the MongoDB URL and password from environment variables,
 * replaces the placeholder with the actual password, and initiates the connection.
 */
const connectDB = async () => {
  const pass = process.env.MONGO_PASS; // MongoDB password from environment variables
  const rawUrl = process.env.MONGO_URL; // MongoDB connection string with <password> placeholder

  // Replace placeholder <password> with actual password
  const url = rawUrl.replace("<password>", pass);

  // Check if the final URL is valid
  if (!url) {
    console.error("MongoDB connection string is not defined");
    process.exit(1); // Exit the application if the connection string is missing
  }

  try {
    // Try to connect to MongoDB
    await mongoose.connect(url).then(() => {
      console.log("Database Connected successfully");
    });
  } catch (error) {
    // Handle connection errors
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit the application on failure
  }
};

export default connectDB;
