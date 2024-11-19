import mongoose from "mongoose";

// Define the User schema
const UserSchema = new mongoose.Schema({
  // User's name, required field
  name: { type: String, required: true },
  // User's email, required and must be unique
  email: { type: String, required: true, unique: true },
  // User's points, default is 0
  points: { type: Number, default: 0 },
  // Array of transaction references not needed as there is a
  //transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  // User's join date
  joinDate: { type: Date, default: Date.now }
});

// Export the User model, create it if it doesn't already exist
export default mongoose.models.User || mongoose.model("User", UserSchema);

