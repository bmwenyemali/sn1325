import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string | undefined;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

type GlobalWithMongoose = typeof global & {
  mongoose?: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
};
const g = global as GlobalWithMongoose;
if (!g.mongoose) {
  g.mongoose = { conn: null, promise: null };
}
const cached = g.mongoose!;

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((m) => {
      return m;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
