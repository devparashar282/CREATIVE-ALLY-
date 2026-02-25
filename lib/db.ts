import mongoose from "mongoose";

const DEFAULT_LOCAL_MONGODB_URI = "mongodb://127.0.0.1:27017/creative-ally";

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const cached = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

function getMongoUri() {
  const envUri = process.env.MONGODB_URI?.trim();
  if (envUri) return envUri;

  if (process.env.NODE_ENV === "production") {
    throw new Error("Please define MONGODB_URI in environment.");
  }

  return DEFAULT_LOCAL_MONGODB_URI;
}

export async function connectDb() {
  const mongoUri = getMongoUri();

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, {
      dbName: "creative-ally",
      serverSelectionTimeoutMS: 5000
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
