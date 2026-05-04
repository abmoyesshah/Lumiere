export function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

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

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

export function findTopMatches(userEmbedding, candidates, topN = 10) {
  const scores = candidates.map((candidate) => ({
    ...candidate,
    score: cosineSimilarity(userEmbedding, candidate.embedding),
  }));

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(({ score, ...candidate }) => ({
      ...candidate,
      matchScore: parseFloat((score * 100).toFixed(2)),
    }));
}
