// Calculate location similarity score (closer = higher score)
export function calculateLocationScore(userLoc, matchLoc, maxDistance = 100) {
    if (!userLoc || !matchLoc) return 0.5;
    
    // Simple string matching for city/region
    if (userLoc === matchLoc) return 1.0;
    
    const userParts = userLoc.toLowerCase().split(/[\s,]+/);
    const matchParts = matchLoc.toLowerCase().split(/[\s,]+/);
    
    let matches = 0;
    for (const part of userParts) {
      if (matchParts.includes(part)) matches++;
    }
    
    return Math.min(0.3 + (matches / Math.max(userParts.length, matchParts.length)) * 0.7, 1.0);
  }
  
  // Calculate age preference score
  export function calculateAgeScore(userAge, matchAge, ageRangePref) {
    if (!userAge || !matchAge) return 0.5;
    
    // Check if match is within user's age preference
    if (matchAge < ageRangePref.min || matchAge > ageRangePref.max) {
      return 0;
    }
    
    const ageDiff = Math.abs(userAge - matchAge);
    if (ageDiff <= 2) return 1.0;
    if (ageDiff <= 5) return 0.8;
    if (ageDiff <= 10) return 0.5;
    return 0.3;
  }
  
  // Calculate interest similarity score
  export function calculateInterestsScore(userInterests, matchInterests) {
    if (!userInterests?.length || !matchInterests?.length) return 0.5;
    
    const userSet = new Set(userInterests.map(i => i.toLowerCase().trim()));
    const matchSet = new Set(matchInterests.map(i => i.toLowerCase().trim()));
    
    let matches = 0;
    for (const interest of userSet) {
      if (matchSet.has(interest)) matches++;
    }
    
    const union = new Set([...userSet, ...matchSet]).size;
    return union > 0 ? matches / union : 0;
  }
  
  // Calculate zodiac sign compatibility
  export function calculateZodiacScore(userZodiac, matchZodiac) {
    if (!userZodiac || !matchZodiac) return 0.5;
    
    const compatiblePairs = {
      'aries': ['leo', 'sagittarius', 'gemini', 'aquarius'],
      'taurus': ['virgo', 'capricorn', 'cancer', 'pisces'],
      'gemini': ['libra', 'aquarius', 'aries', 'leo'],
      'cancer': ['scorpio', 'pisces', 'taurus', 'virgo'],
      'leo': ['sagittarius', 'aries', 'gemini', 'libra'],
      'virgo': ['capricorn', 'taurus', 'cancer', 'scorpio'],
      'libra': ['aquarius', 'gemini', 'leo', 'sagittarius'],
      'scorpio': ['pisces', 'cancer', 'virgo', 'capricorn'],
      'sagittarius': ['aries', 'leo', 'libra', 'aquarius'],
      'capricorn': ['taurus', 'virgo', 'scorpio', 'pisces'],
      'aquarius': ['gemini', 'libra', 'aries', 'sagittarius'],
      'pisces': ['cancer', 'scorpio', 'taurus', 'capricorn']
    };
    
    const userSign = userZodiac.toLowerCase();
    const matchSign = matchZodiac.toLowerCase();
    
    if (userSign === matchSign) return 0.9;
    if (compatiblePairs[userSign]?.includes(matchSign)) return 0.8;
    return 0.3;
  }
  
  // Calculate relationship goal compatibility
  export function calculateRelationshipScore(userGoal, matchGoal) {
    if (!userGoal || !matchGoal) return 0.5;
    
    if (userGoal === matchGoal) return 1.0;
    
    const compatibility = {
      'marriage': { 'long term': 0.8, 'short term': 0.2, 'friendship': 0.1 },
      'long term': { 'marriage': 0.8, 'short term': 0.5, 'friendship': 0.3 },
      'short term': { 'long term': 0.5, 'friendship': 0.6, 'marriage': 0.2 },
      'friendship': { 'short term': 0.6, 'long term': 0.3, 'marriage': 0.1 },
    };
    
    return compatibility[userGoal]?.[matchGoal] || 0.3;
  }
  
  // Calculate religion compatibility
  export function calculateReligionScore(userReligion, matchReligion) {
    if (!userReligion || !matchReligion) return 0.5;
    if (userReligion === 'prefer not to say' || matchReligion === 'prefer not to say') return 0.7;
    return userReligion === matchReligion ? 1.0 : 0.4;
  }
  
  // Calculate language compatibility
  export function calculateLanguagesScore(userLangs, matchLangs) {
    if (!userLangs?.length || !matchLangs?.length) return 0.5;
    
    const userSet = new Set(userLangs.map(l => l.toLowerCase()));
    const matchSet = new Set(matchLangs.map(l => l.toLowerCase()));
    
    let common = 0;
    for (const lang of userSet) {
      if (matchSet.has(lang)) common++;
    }
    
    return common > 0 ? 0.8 : 0.2;
  }
  
  // Cosine similarity function
  export function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (normA * normB);
  }
  
  // Main scoring function combining all factors with weights
  export function calculateOverallScore(user, match, weights = {
    embedding: 0.30,
    interests: 0.15,
    age: 0.12,
    location: 0.10,
    zodiac: 0.08,
    relationship: 0.08,
    religion: 0.07,
    languages: 0.05,
    random: 0.05,
  }) {
    
    // 1. Embedding score
    const embeddingScore = user.embedding && match.embedding 
      ? cosineSimilarity(user.embedding, match.embedding) 
      : 0.5;
    
    // 2. Interests score
    const interestsScore = calculateInterestsScore(user.interests, match.interests);
    
    // 3. Age score
    const ageScore = calculateAgeScore(user.age, match.age, user.ageRangePreference || { min: 18, max: 100 });
    
    // 4. Location score
    const locationScore = calculateLocationScore(user.location, match.location, user.maxDistance || 100);
    
    // 5. Zodiac score
    const zodiacScore = calculateZodiacScore(user.zodiacSign, match.zodiacSign);
    
    // 6. Relationship goal score
    const relationshipScore = calculateRelationshipScore(user.relationshipGoal, match.relationshipGoal);
    
    // 7. Religion score
    const religionScore = calculateReligionScore(user.religion, match.religion);
    
    // 8. Languages score
    const languagesScore = calculateLanguagesScore(user.languages, match.languages);
    
    // 9. Random factor
    const randomScore = 0.5 + (Math.random() * 0.1);
    
    const totalScore = 
      (embeddingScore * weights.embedding) +
      (interestsScore * weights.interests) +
      (ageScore * weights.age) +
      (locationScore * weights.location) +
      (zodiacScore * weights.zodiac) +
      (relationshipScore * weights.relationship) +
      (religionScore * weights.religion) +
      (languagesScore * weights.languages) +
      (randomScore * weights.random);
    
    return Math.min(totalScore, 1.0);
  }