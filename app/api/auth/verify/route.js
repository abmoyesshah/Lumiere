export const runtime = "nodejs";
import { getAuthToken, verifyToken } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET(req) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return Response.json(
        { error: 'No authentication token' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    await connectDB();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // IMPORTANT: Include profilePicture in the response
    return Response.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        profilePicture: user.profilePicture || null, // ADD THIS LINE
        location: user.location, // Optional: add if you need it
      },
    });
  } catch (error) {
    return Response.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}// export const runtime = "nodejs";
// import { getAuthToken, verifyToken } from '@/lib/auth';
// import { connectDB } from '@/lib/db';
// import User from '@/models/User';

// export async function GET(req) {
//   try {
//     const token = await getAuthToken();
//     if (!token) {
//       return Response.json(
//         { error: 'No authentication token' },
//         { status: 401 }
//       );
//     }

//     const decoded = verifyToken(token);
//     await connectDB();

//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return Response.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     return Response.json({
//       user: {
//         id: user._id,
//         email: user.email,
//         name: user.name,
//         age: user.age,
//       },
//     });
//   } catch (error) {
//     return Response.json(
//       { error: 'Authentication failed' },
//       { status: 401 }
//     );
//   }
// }
