// Property-based tests for pattern detection engine
// Uses fast-check for property-based testing

const fc = require('fast-check');

// Mock TrelloPowerUp before requiring client.js
global.TrelloPowerUp = {
  initialize: jest.fn(),
  Promise: Promise
};

const { PatternDetector, LinkGenerator } = require('../public/js/client.js');

describe('Pattern Detection Engine - Property Tests', () => {
  
  // Property 1: Feedback pattern replacement
  // **Validates: Requirements 1.1, 2.1, 2.2, 2.3**
  describe('Property 1: Feedback pattern replacement', () => {
    test('Feature: feedback-link-replacer, Property 1: For any card content containing valid feedback patterns, the Power-Up should replace each pattern with the corresponding GitHub link', () => {
      fc.assert(fc.property(
        fc.array(fc.integer({ min: 1, max: 999999 })), // Generate array of numeric IDs
        fc.string(), // Generate random prefix text
        fc.string(), // Generate random suffix text
        (numericIds, prefix, suffix) => {
          // Skip empty arrays to ensure we have patterns to test
          fc.pre(numericIds.length > 0);
          
          // Create content with feedback patterns, ensuring proper spacing
          const feedbackPatterns = numericIds.map(id => `feedback:${id}`);
          const content = prefix + ' ' + feedbackPatterns.join(' ') + ' ' + suffix;
          
          // Detect patterns
          const detectedPatterns = PatternDetector.detectFeedbackPatterns(content);
          
          // Verify each numeric ID was detected
          const detectedIds = detectedPatterns.map(p => p.numericId);
          const expectedIds = numericIds.map(id => id.toString());
          
          // All expected IDs should be detected (allowing for duplicates)
          expectedIds.forEach(expectedId => {
            expect(detectedIds).toContain(expectedId);
          });
          
          // Each detected pattern should have correct format
          detectedPatterns.forEach(pattern => {
            expect(pattern.originalText).toMatch(/^feedback:\d+$/);
            expect(PatternDetector.validateNumericId(pattern.numericId)).toBe(true);
            
            // Should be able to generate GitHub link
            const githubLink = LinkGenerator.generateGitHubLink(pattern.numericId);
            expect(githubLink).toBe(`https://github.com/${pattern.numericId}`);
          });
        }
      ), { numRuns: 100 });
    });
  });

  // Property 4: Numeric validation  
  // **Validates: Requirements 1.4, 4.4**
  describe('Property 4: Numeric validation', () => {
    test('Feature: feedback-link-replacer, Property 4: For any text matching format "feedback:X" where X contains non-numeric characters, the pattern should be ignored', () => {
      fc.assert(fc.property(
        fc.string().filter(s => s.length > 0 && !/^\d+$/.test(s) && !/\d/.test(s)), // Generate strings with no digits at all
        fc.string(), // Generate random prefix
        fc.string(), // Generate random suffix
        (nonNumericId, prefix, suffix) => {
          const content = prefix + `feedback:${nonNumericId}` + suffix;
          
          // Detect patterns
          const detectedPatterns = PatternDetector.detectFeedbackPatterns(content);
          
          // Should not detect any patterns since ID contains non-numeric characters
          const patternsWithNonNumericId = detectedPatterns.filter(p => p.numericId === nonNumericId);
          expect(patternsWithNonNumericId).toHaveLength(0);
          
          // Validate that the non-numeric ID fails validation
          expect(PatternDetector.validateNumericId(nonNumericId)).toBe(false);
        }
      ), { numRuns: 100 });
    });
    
    test('Feature: feedback-link-replacer, Property 4: validateNumericId should return false for invalid inputs', () => {
      fc.assert(fc.property(
        fc.oneof(
          fc.string().filter(s => !/^\d+$/.test(s)), // Non-numeric strings
          fc.constant(''), // Empty string
          fc.constant(null), // Null
          fc.constant(undefined) // Undefined
        ),
        (invalidInput) => {
          expect(PatternDetector.validateNumericId(invalidInput)).toBe(false);
        }
      ), { numRuns: 100 });
    });
    
    test('Feature: feedback-link-replacer, Property 4: validateNumericId should return true for valid numeric strings', () => {
      fc.assert(fc.property(
        fc.integer({ min: 1, max: 999999 }),
        (numericValue) => {
          const numericString = numericValue.toString();
          expect(PatternDetector.validateNumericId(numericString)).toBe(true);
        }
      ), { numRuns: 100 });
    });
  });
});

describe('Pattern Detection Engine - Unit Tests', () => {
  
  describe('PatternDetector.detectFeedbackPatterns', () => {
    test('should detect single feedback pattern', () => {
      const content = 'Check out feedback:12345 for details';
      const patterns = PatternDetector.detectFeedbackPatterns(content);
      
      expect(patterns).toHaveLength(1);
      expect(patterns[0]).toEqual({
        originalText: 'feedback:12345',
        numericId: '12345',
        startIndex: 10,
        endIndex: 24
      });
    });
    
    test('should detect multiple feedback patterns', () => {
      const content = 'See feedback:123 and feedback:456 for info';
      const patterns = PatternDetector.detectFeedbackPatterns(content);
      
      expect(patterns).toHaveLength(2);
      expect(patterns[0].numericId).toBe('123');
      expect(patterns[1].numericId).toBe('456');
    });
    
    test('should return empty array for content with no patterns', () => {
      const content = 'This has no feedback patterns';
      const patterns = PatternDetector.detectFeedbackPatterns(content);
      
      expect(patterns).toHaveLength(0);
    });
    
    test('should ignore malformed patterns', () => {
      const content = 'feedback: feedback:abc';
      const patterns = PatternDetector.detectFeedbackPatterns(content);
      
      // Should not detect any patterns since both are malformed
      // feedback: has no ID, feedback:abc has non-numeric ID
      expect(patterns).toHaveLength(0);
    });
    
    test('should detect valid patterns even when followed by non-numeric characters', () => {
      const content = 'feedback:123abc';
      const patterns = PatternDetector.detectFeedbackPatterns(content);
      
      // Should detect feedback:123 (the numeric part)
      expect(patterns).toHaveLength(1);
      expect(patterns[0].numericId).toBe('123');
      expect(patterns[0].originalText).toBe('feedback:123');
    });
    
    test('should handle non-string input', () => {
      expect(PatternDetector.detectFeedbackPatterns(null)).toEqual([]);
      expect(PatternDetector.detectFeedbackPatterns(undefined)).toEqual([]);
      expect(PatternDetector.detectFeedbackPatterns(123)).toEqual([]);
    });
  });
  
  describe('PatternDetector.validateNumericId', () => {
    test('should validate numeric strings', () => {
      expect(PatternDetector.validateNumericId('123')).toBe(true);
      expect(PatternDetector.validateNumericId('0')).toBe(true);
      expect(PatternDetector.validateNumericId('999999')).toBe(true);
    });
    
    test('should reject non-numeric strings', () => {
      expect(PatternDetector.validateNumericId('abc')).toBe(false);
      expect(PatternDetector.validateNumericId('123abc')).toBe(false);
      expect(PatternDetector.validateNumericId('12.34')).toBe(false);
      expect(PatternDetector.validateNumericId('')).toBe(false);
    });
  });
  
  describe('LinkGenerator.generateGitHubLink', () => {
    test('should generate correct GitHub URLs', () => {
      expect(LinkGenerator.generateGitHubLink('123')).toBe('https://github.com/123');
      expect(LinkGenerator.generateGitHubLink('456789')).toBe('https://github.com/456789');
    });
    
    test('should throw error for invalid numeric IDs', () => {
      expect(() => LinkGenerator.generateGitHubLink('abc')).toThrow('Invalid numeric ID: must contain only digits');
      expect(() => LinkGenerator.generateGitHubLink('')).toThrow('Invalid numeric ID: must contain only digits');
    });
  });
});