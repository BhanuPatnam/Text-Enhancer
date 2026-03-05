// utils/similarity.js

/**
 * Calculates the dot product of two vectors.
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number}
 */
function dotProduct(vecA, vecB) {
    return vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
}

/**
 * Calculates the magnitude of a vector.
 * @param {number[]} vec
 * @returns {number}
 */
function magnitude(vec) {
    return Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
}

/**
 * Calculates the cosine similarity between two vectors.
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number} The cosine similarity, rounded to 2 decimal places and multiplied by 100 to represent a percentage.
 */
function cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
        throw new Error("Vectors must have the same dimension.");
    }

    const dot = dotProduct(vecA, vecB);
    const magA = magnitude(vecA);
    const magB = magnitude(vecB);

    if (magA === 0 || magB === 0) {
        return 0; // Avoid division by zero
    }

    const similarity = dot / (magA * magB);
    return parseFloat((similarity * 100).toFixed(2)); // Convert to percentage and round to 2 decimals
}

module.exports = {
    cosineSimilarity
};
