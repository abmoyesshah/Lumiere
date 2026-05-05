export const runtime = "nodejs";
import { connectDB } from '@/lib/db';
import { hashPassword, setAuthCookie } from '@/lib/auth';
import User from '@/models/User';
import { generateProfileEmbedding } from '@/lib/embeddings';

export async function POST(req) {
  try {
    await connectDB();
    const { email, password, name, age, location, bio, interests } = await req.json();

    if (!email || !password || !name || !age || !location) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    
    const profileData = {
      name,
      age,
      location,
      bio,
      interests: interests || [],
    };

    const embedding = await generateProfileEmbedding(profileData);

    const user = new User({
      email,
      password: hashedPassword,
      name,
      age,
      location,
      bio: bio || '',
      interests: interests || [],
      embedding,
    });

    await user.save();
    await setAuthCookie(user._id.toString());

    // IMPORTANT: Include profilePicture in response (even if empty)
    return Response.json(
      {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          age: user.age,
          profilePicture: user.profilePicture || null, // ADD THIS LINE
          location: user.location,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return Response.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}






// export const runtime = "nodejs";
// import { connectDB } from '@/lib/db';
// import { hashPassword, setAuthCookie } from '@/lib/auth';
// import User from '@/models/User';
// import { generateProfileEmbedding } from '@/lib/embeddings';

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { email, password, name, age, location, bio, interests } = await req.json();

//     if (!email || !password || !name || !age || !location) {
//       return Response.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return Response.json(
//         { error: 'User already exists' },
//         { status: 400 }
//       );
//     }

//     const hashedPassword = await hashPassword(password);
    
//     const profileData = {
//       name,
//       age,
//       location,
//       bio,
//       interests: interests || [],
//     };

//     const embedding = await generateProfileEmbedding(profileData);

//     const user = new User({
//       email,
//       password: hashedPassword,
//       name,
//       age,
//       location,
//       bio: bio || '',
//       interests: interests || [],
//       embedding,
//     });

//     await user.save();
//     await setAuthCookie(user._id.toString());

//     return Response.json(
//       {
//         user: {
//           id: user._id,
//           email: user.email,
//           name: user.name,
//           age: user.age,
//         },
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Register error:', error);
//     return Response.json(
//       { error: 'Registration failed' },
//       { status: 500 }
//     );
//   }
// }
