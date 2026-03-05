// utils/classifier.js
const { classifyCorrection } = require('../services/gemini');

/**
 * Classifies a single text correction using the OpenRouter API.
 * Provides a fallback if JSON parsing fails.
 * @param {string} original The original text snippet.
 * @param {string} enhanced The enhanced text snippet.
 * @returns {Promise<{type: string, reason: string}>} The classification of the change.
 */
async function classifyChange(original, enhanced) {
    try {
        const classification = await classifyCorrection(original, enhanced);
        // Basic validation for the classification object
        if (classification && typeof classification.type === 'string' && typeof classification.reason === 'string') {
            return classification;
        } else {
            console.warn('OpenRouter classification returned invalid JSON, falling back to rule-based.');
            return fallbackClassification(original, enhanced);
        }
    } catch (error) {
        console.error('Error from OpenRouter classification, falling back to rule-based:', error.message);
        return fallbackClassification(original, enhanced);
    }
}

/**
 * Provides a rule-based fallback classification for changes.
 * This is a simplified example and can be expanded for more detailed rules.
 * @param {string} original The original text snippet.
 * @param {string} enhanced The enhanced text snippet.
 * @returns {{type: string, reason: string}} The fallback classification.
 */
function fallbackClassification(original, enhanced) {
    if (!original && enhanced) {
        return { type: "Addition", reason: "Text was added." };
    }
    if (original && !enhanced) {
        return { type: "Deletion", reason: "Text was removed." };
    }
    // Simple heuristic for replacement
    if (original && enhanced) {
        if (original.toLowerCase() === enhanced.toLowerCase()) {
            return { type: "Capitalization correction", reason: "Changed capitalization." };
        }
        if (original.length > enhanced.length && original.includes(enhanced)) {
            return { type: "Clarity improvement", reason: "Text was made more concise." };
        }
        if (enhanced.length > original.length && enhanced.includes(original)) {
            return { type: "Clarity improvement", reason: "Text was expanded for clarity." };
        }
        return { type: "Vocabulary improvement", reason: "Word or phrase was replaced." };
    }
    return { type: "Unknown change", reason: "Could not classify the change." };
}

module.exports = {
    classifyChange
};
