import dbConnect from "../../lib/mongodb";
import Transaction from "../../models/Transaction";
import User from "../../models/User";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { userId, points, type } = req.body;

      const transaction = new Transaction({ userId, points, type });
      await transaction.save();

      const user = await User.findById(userId);
      user.points += points;
      await user.save();

      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    const transactions = await Transaction.find({}).populate("userId");
    res.status(200).json(transactions);
  } else {
    res.status(405).end();
  }
}
