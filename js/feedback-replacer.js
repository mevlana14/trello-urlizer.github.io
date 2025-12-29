/**
 * Feedback Replacer Module
 * Detects and replaces "feedback: NNNN" patterns with "feedback: mevlana: NNNN"
 */

const FeedbackReplacer = {
    // Pattern to match "feedback:" followed by optional spaces and digits
    // Matches: "feedback: 123123", "feedback:123123", "feedback:  456"
    PATTERN: /feedback:\s*(\d+)/gi,

    /**
     * Detect all feedback patterns in the given text
     * @param {string} text - The text to search
     * @returns {Array} Array of matches with original text and numeric ID
     */
    detectPatterns: function(text) {
        if (!text || typeof text !== 'string') {
            return [];
        }

        const matches = [];
        let match;

        // Reset regex lastIndex for global matching
        this.PATTERN.lastIndex = 0;

        while ((match = this.PATTERN.exec(text)) !== null) {
            matches.push({
                originalText: match[0],
                numericId: match[1],
                startIndex: match.index,
                endIndex: match.index + match[0].length
            });
        }

        return matches;
    },

    /**
     * Replace all feedback patterns in text with mevlana prefix
     * @param {string} text - The text to process
     * @returns {Object} Object containing replaced text and count of replacements
     */
    replacePatterns: function(text) {
        if (!text || typeof text !== 'string') {
            return { text: text, count: 0 };
        }

        // Reset regex lastIndex
        this.PATTERN.lastIndex = 0;

        let count = 0;
        const replacedText = text.replace(this.PATTERN, function(match, numericId) {
            count++;
            return 'feedback: mevlana: ' + numericId;
        });

        return {
            text: replacedText,
            count: count
        };
    },

    /**
     * Check if text contains any feedback patterns that need replacement
     * (i.e., patterns that don't already have "mevlana:")
     * @param {string} text - The text to check
     * @returns {boolean} True if replaceable patterns exist
     */
    hasReplaceablePatterns: function(text) {
        if (!text || typeof text !== 'string') {
            return false;
        }

        // Pattern for already replaced text (with mevlana)
        const alreadyReplacedPattern = /feedback:\s*mevlana:\s*\d+/gi;

        // Get all feedback patterns
        this.PATTERN.lastIndex = 0;
        const allMatches = text.match(this.PATTERN) || [];

        // Get already replaced patterns
        const replacedMatches = text.match(alreadyReplacedPattern) || [];

        // If there are more total patterns than already-replaced ones, there are replaceable patterns
        return allMatches.length > replacedMatches.length;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeedbackReplacer;
}
