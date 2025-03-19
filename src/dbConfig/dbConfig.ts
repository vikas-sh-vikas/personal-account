import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL!;

if (!MONGO_URL) {
  throw new Error("Please define MONGO_URL in the environment variables");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL).then((mongoose) => {
      console.log("MongoDB Connected Successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
