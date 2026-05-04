export const runtime = "nodejs";
import { connectDB } from '@/lib/db';
import { comparePassword, setAuthCookie } from '@/lib/auth';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    await setAuthCookie(user._id.toString());

    // IMPORTANT: Include profilePicture here too
    return Response.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        profilePicture: user.profilePicture || null, // ADD THIS LINE
        location: user.location,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}// export const runtime = "nodejs";
// import { connectDB } from '@/lib/db';
// import { comparePassword, setAuthCookie } from '@/lib/auth';
// import User from '@/models/User';

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return Response.json(
//         { error: 'Email and password required' },
//         { status: 400 }
//       );
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return Response.json(
//         { error: 'Invalid credentials' },
//         { status: 401 }
//       );
//     }

//     const isMatch = await comparePassword(password, user.password);
//     if (!isMatch) {
//       return Response.json(
//         { error: 'Invalid credentials' },
//         { status: 401 }
//       );
//     }

//     await setAuthCookie(user._id.toString());

//     return Response.json({
//       user: {
//         id: user._id,
//         email: user.email,
//         name: user.name,
//         age: user.age,
//       },
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     return Response.json(
//       { error: 'Login failed' },
//       { status: 500 }
//     );
//   }
// }
