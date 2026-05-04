export const runtime = "nodejs";
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET(req, { params }) {
  try {
    await connectDB();
    
    // Await the params Promise before accessing its properties
    const { id } = await params;
    const userId = id;

    // Select all fields except sensitive ones
    const user = await User.findById(userId).select(
      '-password -embedding -likedProfiles -blockedUsers'
    );

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    return Response.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    );
  }
}











// export const runtime = "nodejs";
// import { connectDB } from '@/lib/db';
// import User from '@/models/User';

// export async function GET(req, { params }) {
//   try {
//     await connectDB();
//     const userId = params.id;

//     const user = await User.findById(userId).select('-password -embedding -likedProfiles -blockedUsers');

//     if (!user) {
//       return Response.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     return Response.json({ user });
//   } catch (error) {
//     console.error('Get profile error:', error);
//     return Response.json(
//       { error: 'Failed to get profile' },
//       { status: 500 }
//     );
//   }
// }
