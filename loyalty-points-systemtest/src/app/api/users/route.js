import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  await dbConnect();
  const users = await User.find({});
  return new Response(JSON.stringify(users), { status: 200 });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  try {
    const user = new User(body);
    await user.save();
    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
