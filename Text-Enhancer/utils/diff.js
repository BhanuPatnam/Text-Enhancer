// utils/diff.js
const Diff = require('diff');

/**
 * Splits text into words, handling punctuation and spaces.
 * @param {string} text
 * @returns {string[]} An array of words.
 */
function splitIntoWords(text) {
    // This regex splits by spaces but keeps punctuation attached to words,
    // which might be desired for diffing.
    // If a more strict word-only split is needed, adjust the regex.
    return text.split(/(\s+)/).filter(s => s.length > 0);
}

/**
 * Detects changes between original and enhanced text and formats them for the changes_log.
 * @param {string} originalText The original input text.
 * @param {string} enhancedText The enhanced text.
 * @returns {Array<{original: string, enhanced: string, type: string, reason: string}>} An array of change objects.
 */
function detectChanges(originalText, enhancedText) {
    const diff = Diff.diffWords(originalText, enhancedText);
    const changes = [];

    let i = 0;
    while (i < diff.length) {
        const currentDiff = diff[i];

        if (currentDiff.removed && diff[i + 1] && diff[i + 1].added) {
            // This is a replacement
            changes.push({
                original: currentDiff.value,
                enhanced: diff[i + 1].value,
                type: "", // To be filled by classifier
                reason: "" // To be filled by classifier
            });
            i += 2; // Skip the next 'added' part as it's part of this replacement
        } else if (currentDiff.removed) {
            // This is a deletion
            changes.push({
                original: currentDiff.value,
                enhanced: "",
                type: "Deletion", // Fallback type
                reason: "Text was removed" // Fallback reason
            });
            i++;
        } else if (currentDiff.added) {
            // This is an addition
            changes.push({
                original: "",
                enhanced: currentDiff.value,
                type: "Addition", // Fallback type
                reason: "Text was added" // Fallback reason
            });
            i++;
        } else {
            // No change, just move to the next diff
            i++;
        }
    }
    return changes;
}

module.exports = {
    detectChanges
};
