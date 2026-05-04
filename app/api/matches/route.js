export const runtime = "nodejs";
import { connectDB } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { calculateOverallScore } from '@/lib/matching';
import User from '@/models/User';

export async function GET(req) {
  try {
    const { userId } = await verifyAuth();
    await connectDB();

    const currentUser = await User.findById(userId);
    if (!currentUser || !currentUser.embedding) {
      return Response.json(
        { error: 'User profile incomplete' },
        { status: 400 }
      );
    }

    // --- GENDER PREFERENCE FILTER (MOST IMPORTANT) ---
    let genderFilter = {};
    
    if (currentUser.lookingFor && currentUser.lookingFor !== '' && currentUser.lookingFor !== 'everyone') {
      genderFilter.gender = currentUser.lookingFor;
    }

    // --- AGE PREFERENCE FILTER ---
    let ageFilter = {};
    if (currentUser.ageRangePreference) {
      ageFilter.age = {
        $gte: currentUser.ageRangePreference.min || 18,
        $lte: currentUser.ageRangePreference.max || 100,
      };
    }

    // Exclude already liked/blocked users
    const exclusionFilter = {
      _id: {
        $nin: [
          userId,
          ...(currentUser.likedProfiles || []),
          ...(currentUser.blockedUsers || [])
        ],
      },
    };

    // Get all potential candidates
    const candidates = await User.find({
      ...exclusionFilter,
      ...genderFilter,
      ...ageFilter,
    }).select(
      'name age location bio interests embedding profilePicture photos coverPhoto ' +
      'gender lookingFor zodiacSign relationshipGoal religion languages ' +
      'occupation education height smoking drinking workout diet pets kids ' +
      'ageRangePreference maxDistance'
    );

    if (!candidates.length) {
      return Response.json({ matches: [] });
    }

    // Calculate comprehensive scores for each candidate
    const scoredMatches = candidates.map((candidate) => {
      const score = calculateOverallScore(currentUser, candidate);
      
      return {
        _id: candidate._id,
        name: candidate.name,
        age: candidate.age,
        location: candidate.location,
        bio: candidate.bio,
        interests: candidate.interests,
        profilePhoto: candidate.profilePicture,
        photos: candidate.photos,
        coverPhoto: candidate.coverPhoto,
        gender: candidate.gender,
        lookingFor: candidate.lookingFor,
        zodiacSign: candidate.zodiacSign,
        relationshipGoal: candidate.relationshipGoal,
        religion: candidate.religion,
        languages: candidate.languages,
        occupation: candidate.occupation,
        education: candidate.education,
        height: candidate.height,
        smoking: candidate.smoking,
        drinking: candidate.drinking,
        workout: candidate.workout,
        diet: candidate.diet,
        pets: candidate.pets,
        kids: candidate.kids,
        matchScore: parseFloat((score * 100).toFixed(2)),
      };
    });

    // Sort by score and take top 50
    const matches = scoredMatches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 50);

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
// import { findTopMatches } from '@/lib/similarity';
// import User from '@/models/User';

// export async function GET(req) {
//   try {
//     const { userId } = await verifyAuth();
//     await connectDB();

//     const currentUser = await User.findById(userId);
//     if (!currentUser || !currentUser.embedding) {
//       return Response.json(
//         { error: 'User profile incomplete' },
//         { status: 400 }
//       );
//     }

//     // FIX: Use profilePicture instead of profilePhoto
//     const allUsers = await User.find({
//       _id: {
//         $nin: [userId, ...currentUser.likedProfiles, ...currentUser.blockedUsers],
//       },
//     }).select('name age location bio interests embedding profilePicture photos coverPhoto');

//     const candidates = allUsers.map((user) => ({
//       _id: user._id,
//       name: user.name,
//       age: user.age,
//       location: user.location,
//       bio: user.bio,
//       interests: user.interests,
//       profilePhoto: user.profilePicture, // Map profilePicture to profilePhoto for frontend
//       photos: user.photos,
//       coverPhoto: user.coverPhoto,
//       embedding: user.embedding,
//     }));

//     const matches = findTopMatches(currentUser.embedding, candidates, 50);

//     return Response.json({ matches });
//   } catch (error) {
//     console.error('Get matches error:', error);
//     return Response.json(
//       { error: 'Failed to get matches' },
//       { status: 500 }
//     );
//   }
// }
