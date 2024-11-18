// Import the database connection utility
import dbConnect from "@/lib/mongodb";
// Import the User model
import User from "@/models/User";

// Handler for GET requests to fetch all users
export async function GET(req) {
  // Establish a connection to the database
  await dbConnect();
  // Fetch all users from the database
  const users = await User.find({});
  // Return the users as a JSON response with status 200
  return new Response(JSON.stringify(users), { status: 200 });
}

// Handler for POST requests to create a new user
export async function POST(req) {
  // Establish a connection to the database
  await dbConnect();
  // Parse the request body to get user data
  const body = await req.json();
  try {
    // Create a new User instance with the parsed data
    const user = new User(body);
    // Save the new user to the database
    await user.save();
    // Return the created user as a JSON response with status 201
    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    // Return an error message with status 400 if an error occurs
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

