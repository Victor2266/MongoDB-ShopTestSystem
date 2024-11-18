import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, required: true },
  type: { type: String, enum: ["purchase", "subscription", "event"], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
