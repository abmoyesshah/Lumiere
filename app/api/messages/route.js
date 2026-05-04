export const runtime = "nodejs";
import { connectDB } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import Message from '@/models/Message';

export async function GET(req) {
  try {
    const { userId } = await verifyAuth();
    const { searchParams } = new URL(req.url);
    const matchId = searchParams.get('matchId');

    await connectDB();

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: matchId },
        { senderId: matchId, receiverId: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(50);

    return Response.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return Response.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { userId } = await verifyAuth();
    const { receiverId, text } = await req.json();

    if (!receiverId || !text) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const message = new Message({
      senderId: userId,
      receiverId,
      text,
    });

    await message.save();

    return Response.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Send message error:', error);
    return Response.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
