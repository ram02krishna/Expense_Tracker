const mongoose = require("mongoose");

// Global variable to cache the connection promise for serverless environments
let cachedPromise = null;

const connectDB = async () => {
  // 1. If already connected, return
  if (mongoose.connection.readyState === 1) {
    // console.log("MongoDB is already connected.");
    return;
  }

  // 2. If a connection is currently in progress, wait for it
  if (cachedPromise) {
    // console.log("Waiting for existing MongoDB connection request...");
    await cachedPromise;
    return;
  }

  // 3. Otherwise, create a new connection request
  try {
    // console.log("Initiating new MongoDB connection...");
    const options = {
      bufferCommands: false, // Disable Mongoose buffering for serverless
      serverSelectionTimeoutMS: 5000, // Fail fast if DB is down
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    // Store the promise so subsequent calls wait for this one
    cachedPromise = mongoose.connect(process.env.MONGO_URI, options);
    
    await cachedPromise;
    console.log("MongoDB connected successfully.");
    
    // Optional: Reset cachedPromise if you want strict re-checks, 
    // but keeping it handles the "connecting" state (readyState 2) automatically via the promise.
    // However, if connection fails, we must clear it.

  } catch (error) {
    console.error("MongoDB connection error:", error);
    cachedPromise = null; // Reset promise so we can try again next time
    throw new Error("Database connection failed.");
  }
};

module.exports = connectDB;
