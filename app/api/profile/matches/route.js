export const runtime = "nodejs";
import { connectDB } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import User from '@/models/User';

export async function GET(req) {
  try {
    const { userId } = await verifyAuth();
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const matches = await User.find({
      _id: { $in: user.matches.map((m) => m.userId) },
    }).select(
      'name age location bio interests profilePicture photos coverPhoto ' +
      'gender lookingFor zodiacSign relationshipGoal religion languages ' +
      'occupation education'
    );

    return Response.json({ matches });
  } catch (error) {
    console.error('Get matches error:', error);
    return Response.json(
      { error: 'Failed to get matches' },
      { status: 500 }
    );
  }
}











// export const runtime = "nodejs";
// import { connectDB } from '@/lib/db';
// import { verifyAuth } from '@/lib/auth';
// import User from '@/models/User';

// export async function GET(req) {
//   try {
//     const { userId } = await verifyAuth();
//     await connectDB();

//     const user = await User.findById(userId);
//     if (!user) {
//       return Response.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // FIXED: Use profilePicture (matches your schema) not profilePhoto
//     const matches = await User.find({
//       _id: { $in: user.matches.map((m) => m.userId) },
//     }).select('name age location bio interests profilePicture _id');

//     return Response.json({ matches });
//   } catch (error) {
//     console.error('Get matches error:', error);
//     return Response.json(
//       { error: 'Failed to get matches' },
//       { status: 500 }
//     );
//   }
// }



