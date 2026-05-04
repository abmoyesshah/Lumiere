const EMBEDDING_API_URL = process.env.EMBEDDING_API_URL || "https://moizshah956-embedding-service.hf.space/embed";

export async function generateEmbedding(text) {
  try {
    if (!text || typeof text !== "string") {
      throw new Error("Invalid text input for embedding");
    }

    const response = await fetch(EMBEDDING_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Embedding API error:", errorText);
      throw new Error("Embedding service failed");
    }

    const data = await response.json();

    if (!data.embedding || !Array.isArray(data.embedding)) {
      throw new Error("Invalid embedding response format");
    }

    return data.embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

export async function generateProfileEmbedding(profile) {
  try {
    // Create rich text representation for better embeddings
    const textContent = `
      Name: ${profile.name || ""}
      Age: ${profile.age || ""}
      Bio: ${profile.bio || ""}
      Interests: ${(profile.interests || []).join(", ")}
      Location: ${profile.location || ""}
      Occupation: ${profile.occupation || ""}
      Education: ${profile.education || ""}
      Relationship Goal: ${profile.relationshipGoal || ""}
      Lifestyle: ${profile.workout || ""} ${profile.diet || ""} ${profile.smoking || ""} ${profile.drinking || ""}
      Pets: ${profile.pets || ""}
      Kids: ${profile.kids || ""}
    `.trim().replace(/\s+/g, ' ');
      
    return await generateEmbedding(textContent);
  } catch (error) {
    console.error("Error generating profile embedding:", error);
    throw error;
  }
}











// // lib/embeddings.js

// const EMBEDDING_API_URL = process.env.EMBEDDING_API_URL || "https://moizshah956-embedding-service.hf.space/embed";

// // Generate embedding for raw text
// export async function generateEmbedding(text) {
//   try {
//     if (!text || typeof text !== "string") {
//       throw new Error("Invalid text input for embedding");
//     }

//     const response = await fetch(EMBEDDING_API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ text }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Embedding API error:", errorText);
//       throw new Error("Embedding service failed");
//     }

//     const data = await response.json();

//     if (!data.embedding || !Array.isArray(data.embedding)) {
//       throw new Error("Invalid embedding response format");
//     }

//     return data.embedding;
//   } catch (error) {
//     console.error("Error generating embedding:", error);
//     throw error;
//   }
// }

// // Generate embedding for full user profile
// export async function generateProfileEmbedding(profile) {
//   try {
//     const textContent = `
//       Name: ${profile.name || ""}
//       Age: ${profile.age || ""}
//       Bio: ${profile.bio || ""}
//       Interests: ${(profile.interests || []).join(", ")}
//       Location: ${profile.location || ""}
//       `.trim();
      
//     return await generateEmbedding(textContent);
//   } catch (error) {
//     console.error("Error generating profile embedding:", error);
//     throw error;
//   }
// }








