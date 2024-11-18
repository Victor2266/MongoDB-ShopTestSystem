import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

export async function GET(req) {
  // Establish a connection to the database
  await dbConnect();
  // Extract the search parameters from the request URL
  const { searchParams } = new URL(req.url);
  // Get the userId query parameter, if it exists
  const userId = searchParams.get('userId');
  // Build a query object from the userId, if it exists
  const query = userId ? { userId } : {};
  // Find all transactions matching the query and populate the userId field, if no userID is provided than it returns all transactions
  const transactions = await Transaction.find(query).populate("userId");
  // Return the transactions as a JSON response with status 200
  return new Response(JSON.stringify(transactions), { status: 200 });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  // Destructure userId, points, and type from the request body
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
