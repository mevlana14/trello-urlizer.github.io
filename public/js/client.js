/* global TrelloPowerUp */

// Feedback Link Replacer Power-Up
// Automatically converts feedback:NNNN patterns to GitHub repository links

var Promise = TrelloPowerUp.Promise;

// Power-Up Configuration
var POWER_UP_CONFIG = {
  name: 'Feedback Link Replacer',
  version: '1.0.0',
  capabilities: [
    'card-detail-badges',
    'show-settings'
  ]
};

// Initialize the Power-Up with minimal capabilities
console.log('[Power-Up] Initializing Feedback Link Replacer Power-Up...');
console.log('[Power-Up] Configuration:', POWER_UP_CONFIG);

TrelloPowerUp.initialize({
  // Show a badge on cards to indicate the Power-Up is active
  'card-detail-badges': function(t, options) {
    console.log('[Power-Up] card-detail-badges capability called');
    return Promise.resolve([{
      title: 'Feedback Link Replacer',
      text: 'Active',
      color: 'green'
    }]);
  },
  
  // Show settings option
  'show-settings': function(t, options) {
    console.log('[Power-Up] show-settings capability called');
    return t.popup({
      title: 'Feedback Link Replacer Settings',
      url: './settings.html'
    });
  }
});

console.log('[Power-Up] Initialization complete');
console.log('[Power-Up] Pattern Detection Engine ready!');
console.log('[Power-Up] Available functions:');
console.log('  - PatternDetector.detectFeedbackPatterns(content)');
console.log('  - PatternDetector.validateNumericId(id)');
console.log('  - LinkGenerator.generateGitHubLink(numericId)');

// Simple verification test on startup
console.log('\n=== STARTUP VERIFICATION ===');
var testContent = 'Test feedback:12345 pattern detection';
var patterns = PatternDetector.detectFeedbackPatterns(testContent);
console.log('Verification test completed - found', patterns.length, 'pattern(s)');
console.log('=== VERIFICATION COMPLETE ===\n');

// Add a test function to verify pattern detection works
window.testPatternDetection = function(testContent) {
  console.log('\n=== PATTERN DETECTION TEST ===');
  console.log('Testing with content:', testContent);
  
  var patterns = PatternDetector.detectFeedbackPatterns(testContent);
  
  console.log('Results:');
  patterns.forEach(function(pattern, index) {
    console.log('Pattern ' + (index + 1) + ':', pattern);
    try {
      var githubLink = LinkGenerator.generateGitHubLink(pattern.numericId);
      console.log('Generated link:', githubLink);
    } catch (error) {
      console.error('Error generating link:', error.message);
    }
  });
  
  console.log('=== TEST COMPLETE ===\n');
  return patterns;
};

// Pattern Detection Engine
var PatternDetector = {
  /**
   * Detects feedback patterns in text content
   * @param {string} content - The text content to scan
   * @returns {Array} Array of feedback pattern objects
   */
  detectFeedbackPatterns: function(content) {
    console.log('[PatternDetector] Scanning content:', content);
    
    if (typeof content !== 'string') {
      console.log('[PatternDetector] Invalid content type, returning empty array');
      return [];
    }
    
    var patterns = [];
    var regex = /feedback:(\d+)/g;
    var match;
    
    while ((match = regex.exec(content)) !== null) {
      var pattern = {
        originalText: match[0],
        numericId: match[1],
        startIndex: match.index,
        endIndex: match.index + match[0].length
      };
      patterns.push(pattern);
      console.log('[PatternDetector] Found pattern:', pattern);
    }
    
    console.log('[PatternDetector] Total patterns found:', patterns.length);
    return patterns;
  },
  
  /**
   * Validates that an ID contains only digits
   * @param {string} id - The numeric ID to validate
   * @returns {boolean} True if ID is valid (digits only)
   */
  validateNumericId: function(id) {
    console.log('[PatternDetector] Validating numeric ID:', id);
    
    if (typeof id !== 'string' || id.length === 0) {
      console.log('[PatternDetector] Invalid ID: not a string or empty');
      return false;
    }
    
    var isValid = /^\d+$/.test(id);
    console.log('[PatternDetector] ID validation result:', isValid);
    return isValid;
  }
};

// GitHub Link Generator
var LinkGenerator = {
  /**
   * Converts numeric IDs to GitHub URLs
   * @param {string} numericId - The numeric identifier
   * @returns {string} The formatted GitHub URL
   */
  generateGitHubLink: function(numericId) {
    console.log('[LinkGenerator] Generating GitHub link for ID:', numericId);
    
    if (!PatternDetector.validateNumericId(numericId)) {
      console.error('[LinkGenerator] Invalid numeric ID provided:', numericId);
      throw new Error('Invalid numeric ID: must contain only digits');
    }
    
    var githubUrl = 'https://github.com/' + numericId;
    console.log('[LinkGenerator] Generated GitHub URL:', githubUrl);
    return githubUrl;
  }
};

// Export configuration and modules for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    POWER_UP_CONFIG: POWER_UP_CONFIG,
    PatternDetector: PatternDetector,
    LinkGenerator: LinkGenerator
  };
}