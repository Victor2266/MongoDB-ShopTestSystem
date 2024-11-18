import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, required: true },
  type: { type: String, enum: ["purchase", "reward_redemption", "bonus", "subscription", "event"], required: true },
  createdAt: { type: Date, default: Date.now },
  description: { type: String },
});

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
