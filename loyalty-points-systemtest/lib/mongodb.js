
import mongoose from "mongoose";

// Get the MongoDB connection string
const MONGO_URI = mongodb+srv://AlphaBiz:loyalty@bizpoints.2hbno.mongodb.net/?retryWrites=true&w=majority&appName=BizPoints;

// If the connection string is not defined, throw an error
if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI variable");
}

// Get the cached connection (if any) from the global object
let cached = global.mongoose;

// If there is no cached connection, create an empty object to store it
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Connect to MongoDB if not already connected
async function dbConnect() {
  // If we already have a connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If we don't have a connection promise yet, create one
  if (!cached.promise) {
    // Define the options for the connection
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // Create a promise that resolves with the connected mongoose instance
    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  // Wait for the connection promise to resolve, then return the connection
  cached.conn = await cached.promise;
  return cached.conn;
}

// Export the dbConnect function as the default export
export default dbConnect;

