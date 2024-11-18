import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

export async function GET(req) {
  await dbConnect();
  const transactions = await Transaction.find({}).populate("userId");
  return new Response(JSON.stringify(transactions), { status: 200 });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { userId, points, type } = body;

  try {
    const transaction = new Transaction({ userId, points, type });
    await transaction.save();

    const user = await User.findById(userId); //Find the corresponding user
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    user.points += points;  //Update the user points 
    await user.save();      //Save the user document with the new points

    return new Response(JSON.stringify(transaction), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
