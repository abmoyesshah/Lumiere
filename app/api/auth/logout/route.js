export const runtime = "nodejs";
import { clearAuthCookie } from '@/lib/auth';

export async function POST(req) {
  try {
    await clearAuthCookie();
    return Response.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
