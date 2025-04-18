import mongoose from 'mongoose';

// Define the shape of the cached object
interface MongooseCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

// Extend the global object to include our custom mongoose property
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Initialize the cached variable, defaulting to undefined if not set
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Assign it back to global for persistence across hot reloads
if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect(): Promise<mongoose.Mongoose | true> {
  // Return cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // If no promise is in progress, create one
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000,          // 45 seconds socket timeout
    };

    console.log("connecting....")
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log('connected');
        return mongooseInstance; // Return the Mongoose instance
      })
      .catch((err) => {
        console.error('failed to connect', err);
        throw err; // Rethrow to handle errors upstream
      });
  }

  // Wait for the promise to resolve and store the connection
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;