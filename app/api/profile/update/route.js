export const runtime = "nodejs";
import { connectDB } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { generateProfileEmbedding } from '@/lib/embeddings';
import User from '@/models/User';

export async function PUT(req) {
  try {
    const { userId } = await verifyAuth();
    const { 
      name, age, location, bio, interests, 
      profilePicture, coverPhoto, timelinePhotos,
      occupation, education, height, gender, lookingFor,
      religion, zodiacSign, languages,
      smoking, drinking, workout, diet, pets, kids, relationshipGoal,
      ageRangePreference, maxDistance
    } = await req.json();

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update all fields
    if (name) user.name = name;
    if (age) user.age = age;
    if (location) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (interests) user.interests = interests;
    
    // Photo fields
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (coverPhoto !== undefined) user.coverPhoto = coverPhoto;
    if (timelinePhotos) user.timelinePhotos = timelinePhotos;
    
    // Professional info
    if (occupation) user.occupation = occupation;
    if (education) user.education = education;
    if (height) user.height = height;
    
    // Personal info
    if (gender) user.gender = gender;
    if (lookingFor) user.lookingFor = lookingFor;
    if (religion) user.religion = religion;
    if (zodiacSign) user.zodiacSign = zodiacSign;
    if (languages) user.languages = languages;
    
    // Lifestyle
    if (smoking) user.smoking = smoking;
    if (drinking) user.drinking = drinking;
    if (workout) user.workout = workout;
    if (diet) user.diet = diet;
    if (pets) user.pets = pets;
    if (kids) user.kids = kids;
    if (relationshipGoal) user.relationshipGoal = relationshipGoal;
    
    // Matching preferences
    if (ageRangePreference) user.ageRangePreference = ageRangePreference;
    if (maxDistance) user.maxDistance = maxDistance;

    // Generate new embedding with all profile data
    const profileData = {
      name: user.name,
      age: user.age,
      location: user.location,
      bio: user.bio,
      interests: user.interests,
      occupation: user.occupation,
      education: user.education,
      relationshipGoal: user.relationshipGoal,
      gender: user.gender,
      lookingFor: user.lookingFor,
      workout: user.workout,
      diet: user.diet,
      smoking: user.smoking,
      drinking: user.drinking,
      pets: user.pets,
      kids: user.kids,
    };

    user.embedding = await generateProfileEmbedding(profileData);
    await user.save();

    return Response.json({
      user: {
        id: user._id,
        name: user.name,
        age: user.age,
        location: user.location,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return Response.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}








// export const runtime = "nodejs";
// import { connectDB } from '@/lib/db';
// import { verifyAuth } from '@/lib/auth';
// import { generateProfileEmbedding } from '@/lib/embeddings';
// import User from '@/models/User';

// export async function PUT(req) {
//   try {
//     const { userId } = await verifyAuth();
//     const { 
//       name, age, location, bio, interests, 
//       profilePicture, coverPhoto, timelinePhotos,
//       occupation, education, height, gender, lookingFor,
//       religion, zodiacSign, languages,
//       smoking, drinking, workout, diet, pets, kids, relationshipGoal 
//     } = await req.json();

//     await connectDB();

//     const user = await User.findById(userId);
//     if (!user) {
//       return Response.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // Update all fields
//     if (name) user.name = name;
//     if (age) user.age = age;
//     if (location) user.location = location;
//     if (bio !== undefined) user.bio = bio;
//     if (interests) user.interests = interests;
    
//     // Photo fields - SEPARATE as requested
//     if (profilePicture !== undefined) user.profilePicture = profilePicture;
//     if (coverPhoto !== undefined) user.coverPhoto = coverPhoto;
//     if (timelinePhotos) user.timelinePhotos = timelinePhotos;
    
//     // Professional info
//     if (occupation) user.occupation = occupation;
//     if (education) user.education = education;
//     if (height) user.height = height;
    
//     // Personal info
//     if (gender) user.gender = gender;
//     if (lookingFor) user.lookingFor = lookingFor;
//     if (religion) user.religion = religion;
//     if (zodiacSign) user.zodiacSign = zodiacSign;
//     if (languages) user.languages = languages;
    
//     // Lifestyle
//     if (smoking) user.smoking = smoking;
//     if (drinking) user.drinking = drinking;
//     if (workout) user.workout = workout;
//     if (diet) user.diet = diet;
//     if (pets) user.pets = pets;
//     if (kids) user.kids = kids;
//     if (relationshipGoal) user.relationshipGoal = relationshipGoal;

//     // Generate new embedding with enhanced profile data for better matching
//     const profileData = {
//       name: user.name,
//       age: user.age,
//       location: user.location,
//       bio: user.bio,
//       interests: user.interests,
//       occupation: user.occupation,
//       education: user.education,
//       relationshipGoal: user.relationshipGoal,
//       gender: user.gender,
//       lookingFor: user.lookingFor,
//     };

//     user.embedding = await generateProfileEmbedding(profileData);
//     await user.save();

//     return Response.json({
//       user: {
//         id: user._id,
//         name: user.name,
//         age: user.age,
//         location: user.location,
//       },
//     });
//   } catch (error) {
//     console.error('Update profile error:', error);
//     return Response.json(
//       { error: 'Failed to update profile' },
//       { status: 500 }
//     );
//   }
// }



