// services/gemini.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Calls the Gemini chat completion API to enhance text.
 * @param {string} text The original text to enhance.
 * @returns {Promise<string>} The enhanced text.
 */
async function getEnhancedText(text) {
    try {
        const response = await axios.post(`${GEMINI_BASE_URL}/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            contents: [
                {
                    parts: [
                        {text: "You are a professional grammar correction assistant. Improve grammar, spelling, clarity, and sentence structure. Strictly preserve original meaning. Do NOT summarize. Do NOT expand. Output ONLY corrected text."},
                        {text: text}
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1000 // Manage token usage
            }
        });
        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error getting enhanced text from Gemini:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get enhanced text from Gemini.');
    }
}

/**
 * Calls the Gemini embeddings API to get vector embeddings for text.
 * @param {string} text The text to get embeddings for.
 * @returns {Promise<number[]>} The embedding vector.
 */
async function getEmbeddings(text) {
    try {
        const response = await axios.post(`${GEMINI_BASE_URL}/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`, {
            content: {
                parts: [{ text: text }]
            }
        });
        return response.data.embedding.values;
    } catch (error) {
        console.error('Error getting embeddings from Gemini:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get embeddings from Gemini.');
    }
}

/**
 * Calls the Gemini chat completion API to classify a grammar correction.
 * @param {string} original The original text snippet.
 * @param {string} enhanced The enhanced text snippet.
 * @returns {Promise<{type: string, reason: string}>} The classification of the change.
 */
async function classifyCorrection(original, enhanced) {
    try {
        const prompt = `You are an expert grammar correction classifier.
Classify this correction strictly into one of:

- Subject–Verb Agreement
- Tense
- Article
- Pronoun usage
- Preposition usage
- Helping Verb usage
- Subject correction
- Verb correction
- Object correction
- Spelling correction
- Capitalization correction
- Vocabulary improvement
- Clarity improvement

Return ONLY JSON:
{
"type": "",
"reason": ""
}

Original: "${original}"
Enhanced: "${enhanced}"`;

        const response = await axios.post(`${GEMINI_BASE_URL}/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            contents: [
                {
                    parts: [
                        {text: "You are an expert grammar correction classifier. Classify the correction strictly into one of the provided categories and provide a reason. Return ONLY JSON."},
                        {text: prompt}
                    ]
                }
            ],
            generationConfig: {
                temperature: 0,
                maxOutputTokens: 150 // Manage token usage
            }
        });
        return JSON.parse(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
        console.error('Error classifying correction with Gemini:', error.response ? error.response.data : error.message);
        throw new Error('Failed to classify correction with Gemini.');
    }
}

module.exports = {
    getEnhancedText,
    getEmbeddings,
    classifyCorrection
};
