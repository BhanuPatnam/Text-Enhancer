// routes/enhance.js
const express = require('express');
const router = express.Router();
const { getEnhancedText, getEmbeddings } = require('../services/gemini');
const { cosineSimilarity } = require('../utils/similarity');
const { detectChanges } = require('../utils/diff');
const { classifyChange } = require('../utils/classifier');

router.get('/', (req, res) => {
    res.json({ status: 'ok', endpoint: '/enhance', method: 'POST', usage: 'POST { text }' });
});

router.post('/', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Missing "text" in request body.' });
    }

    try {
        // 1. Text Enhancement
        const revised_text = await getEnhancedText(text);

        // 2. Semantic Similarity
        const originalEmbeddings = await getEmbeddings(text);
        const revisedEmbeddings = await getEmbeddings(revised_text);
        const similarity_score = cosineSimilarity(originalEmbeddings, revisedEmbeddings);

        // 3. Changelog Generation
        let changes_log = detectChanges(text, revised_text);

        // Classify each change
        for (let i = 0; i < changes_log.length; i++) {
            const change = changes_log[i];
            if (change.original || change.enhanced) { // Only classify actual changes
                const classification = await classifyChange(change.original, change.enhanced);
                changes_log[i].type = classification.type;
                changes_log[i].reason = classification.reason;
            }
        }

        res.json({
            revised_text,
            similarity_score,
            changes_log
        });

    } catch (error) {
        console.error('Error in /enhance endpoint:', error);
        res.status(500).json({ error: 'Internal server error during text enhancement.' });
    }
});

module.exports = router;
