import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: '',
    },
    interests: [String],
    
    // Profile Pictures
    profilePicture: {
      type: String,
      default: '',
    },
    coverPhoto: {
      type: String,
      default: '',
    },
    timelinePhotos: [String],
    
    // Professional Info
    occupation: String,
    education: String,
    height: String,
    
    // Personal Info
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'prefer not to say'],
      default: 'prefer not to say',
    },
    lookingFor: {
      type: String,
      enum: ['male', 'female', 'everyone', ''],
      default: '',
    },
    religion: {
      type: String,
      enum: ['Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Judaism', 'Other', 'prefer not to say'],
      default: 'prefer not to say',
    },
    zodiacSign: String,
    languages: [String],
    
    // Lifestyle
    smoking: {
      type: String,
      enum: ['non-smoker', 'occasional', 'regular', 'prefer not to say'],
      default: 'prefer not to say',
    },
    drinking: {
      type: String,
      enum: ['non-drinker', 'occasional', 'regular', 'prefer not to say'],
      default: 'prefer not to say',
    },
    workout: {
      type: String,
      enum: ['daily', 'often', 'sometimes', 'never', ''],
      default: '',
    },
    diet: {
      type: String,
      enum: ['vegetarian', 'vegan', 'pescatarian', 'omnivore', 'keto', 'other', ''],
      default: '',
    },
    pets: {
      type: String,
      enum: ['dog', 'cat', 'both', 'none', 'allergic', ''],
      default: '',
    },
    kids: {
      type: String,
      enum: ['no kids', 'have kids', 'want kids', 'don\'t want kids', 'prefer not to say'],
      default: 'prefer not to say',
    },
    relationshipGoal: {
      type: String,
      enum: ['marriage', 'long term', 'short term', 'friendship', 'not sure yet'],
      default: 'not sure yet',
    },
    
    // Matching Preferences
    ageRangePreference: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 100 },
    },
    maxDistance: {
      type: Number,
      default: 100, // miles or km
    },
    
    // For location-based matching (optional - add coordinates)
    coordinates: {
      lat: Number,
      lng: Number,
    },
    
    // AI Matching
    embedding: [Number],
    
    // Social Features
    likedProfiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    matches: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        matchedAt: Date,
      },
    ],
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);














// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     age: {
//       type: Number,
//       required: true,
//     },
//     location: {
//       type: String,
//       required: true,
//     },
//     bio: {
//       type: String,
//       default: '',
//     },
//     interests: [String],
    
//     // Profile Pictures - SEPARATE FIELDS as requested
//     profilePicture: {
//       type: String,
//       default: '',
//     },
//     coverPhoto: {
//       type: String,
//       default: '',
//     },
//     timelinePhotos: [String], // Multiple daily life pics
    
//     // Professional Info
//     occupation: String,
//     education: String,
//     height: String,
    
//     // Personal Info
//     gender: {
//       type: String,
//       enum: ['male', 'female', 'non-binary', 'prefer not to say'],
//       default: 'prefer not to say',
//     },
//     lookingFor: {
//       type: String,
//       enum: ['male', 'female', 'everyone', ''],
//       default: '',
//     },
//     religion: {
//       type: String,
//       enum: ['Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Judaism', 'Other', 'prefer not to say'],
//       default: 'prefer not to say',
//     },
//     zodiacSign: String,
//     languages: [String],
    
//     // Lifestyle
//     smoking: {
//       type: String,
//       enum: ['non-smoker', 'occasional', 'regular', 'prefer not to say'],
//       default: 'prefer not to say',
//     },
//     drinking: {
//       type: String,
//       enum: ['non-drinker', 'occasional', 'regular', 'prefer not to say'],
//       default: 'prefer not to say',
//     },
//     workout: {
//       type: String,
//       enum: ['daily', 'often', 'sometimes', 'never', ''],
//       default: '',
//     },
//     diet: {
//       type: String,
//       enum: ['vegetarian', 'vegan', 'pescatarian', 'omnivore', 'keto', 'other', ''],
//       default: '',
//     },
//     pets: {
//       type: String,
//       enum: ['dog', 'cat', 'both', 'none', 'allergic', ''],
//       default: '',
//     },
//     kids: {
//       type: String,
//       enum: ['no kids', 'have kids', 'want kids', 'don\'t want kids', 'prefer not to say'],
//       default: 'prefer not to say',
//     },
//     relationshipGoal: {
//       type: String,
//       enum: ['marriage', 'long term', 'short term', 'friendship', 'not sure yet'],
//       default: 'not sure yet',
//     },
    
//     // AI Matching
//     embedding: [Number],
    
//     // Social Features
//     likedProfiles: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//       },
//     ],
//     matches: [
//       {
//         userId: mongoose.Schema.Types.ObjectId,
//         matchedAt: Date,
//       },
//     ],
//     blockedUsers: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//       },
//     ],
//   },
//   { timestamps: true }
// );

// export default mongoose.models.User || mongoose.model('User', userSchema);
