import mongoose from "mongoose";

const dbstring = process.env.CONNECTION_STRING;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB is already connected.");
    return;
  }

  try {
    const db = await mongoose.connect(dbstring);
    console.log("MongoDB connected successfully!");
    return db;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw new Error("Database connection failed");
  }
};

connectDB();
