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
TrelloPowerUp.initialize({
  // Show a badge on cards to indicate the Power-Up is active
  'card-detail-badges': function(t, options) {
    return Promise.resolve([{
      title: 'Feedback Link Replacer',
      text: 'Active',
      color: 'green'
    }]);
  },
  
  // Show settings option
  'show-settings': function(t, options) {
    return t.popup({
      title: 'Feedback Link Replacer Settings',
      url: './settings.html'
    });
  }
});

// Export configuration for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    POWER_UP_CONFIG: POWER_UP_CONFIG
  };
}