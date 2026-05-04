export const runtime = "nodejs";
import { connectDB } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import User from '@/models/User';

export async function POST(req) {
  try {
    const { userId } = await verifyAuth();
    const { likedUserId } = await req.json();

    await connectDB();

    const currentUser = await User.findById(userId);
    const likedUser = await User.findById(likedUserId);

    if (!currentUser || !likedUser) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!currentUser.likedProfiles.includes(likedUserId)) {
      currentUser.likedProfiles.push(likedUserId);
    }

    await currentUser.save();

    // Check if mutual like
    const isMutualMatch = likedUser.likedProfiles.includes(userId);

    if (isMutualMatch) {
      // Add to matches
      if (!currentUser.matches.find((m) => m.userId.toString() === likedUserId)) {
        currentUser.matches.push({ userId: likedUserId, matchedAt: new Date() });
        await currentUser.save();
      }

      if (!likedUser.matches.find((m) => m.userId.toString() === userId)) {
        likedUser.matches.push({ userId, matchedAt: new Date() });
        await likedUser.save();
      }

      return Response.json({
        matched: true,
        message: 'You matched!',
      });
    }

    return Response.json({
      matched: false,
      message: 'Like sent',
    });
  } catch (error) {
    console.error('Like error:', error);
    return Response.json(
      { error: 'Failed to like user' },
      { status: 500 }
    );
  }
}
