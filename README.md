# Trello Power-Up - Feedback Replacer

A Trello Power-Up that automatically detects and replaces `feedback: NNNN` patterns with `feedback: mevlana: NNNN` in Trello cards.

## Features

- **Pattern Detection**: Automatically detects `feedback: 123123` patterns in cards
- **Smart Replacement**: Replaces patterns with `feedback: mevlana: 123123`
- **Card Badge**: Shows an orange "Feedback" badge on cards with replaceable patterns
- **Card Button**: "Replace Feedback" button on each card for one-click replacement
- **Full Card Support**: Works with:
  - Card names
  - Card descriptions
  - Checklist items
  - Comments
- **Card Back Section**: Shows pattern status directly on the card back

## How It Works

The Power-Up scans your Trello cards for patterns like:
```
feedback: 123123
feedback:456789
feedback:  987654
```

And replaces them with:
```
feedback: mevlana: 123123
feedback: mevlana: 456789
feedback: mevlana: 987654
```

## Setup

### Prerequisites

- A Trello account
- A Trello API key (get one at https://trello.com/app-key)

### Trello Power-Up Setup

1. Go to [Trello Power-Ups Admin](https://trello.com/power-ups/admin)
2. Click "Create New Power-Up"
3. Fill in the details:
   - **Name**: Feedback Replacer Power-Up
   - **Iframe Connector URL**: Your hosted URL + `/index.html`
4. Add your API key to the code (replace `your-app-key-here` in index.html and popup.html)
5. Save and enable the Power-Up on your Trello board

## Project Structure

```
.
├── index.html              # Main Power-Up connector file
├── popup.html              # Replacement popup interface
├── card-back.html          # Card back section display
├── manifest.json           # Power-Up configuration
└── js/
    └── feedback-replacer.js # Pattern detection and replacement logic
```

## Usage

1. **Automatic Detection**: Cards with feedback patterns will show an orange "Feedback" badge
2. **View Status**: Open a card to see the "Feedback Replacer" section showing detected patterns
3. **Replace Patterns**:
   - Click the "Replace Feedback" button on the card
   - Or click "Replace All" in the card back section
4. **Authorization**: First use will prompt you to authorize the Power-Up to edit your cards

## Development

### Core Files

- `index.html` - Main connector that initializes the Power-Up with capabilities
- `popup.html` - UI for triggering replacements with status feedback
- `card-back.html` - Shows pattern detection status on card back
- `js/feedback-replacer.js` - Core pattern detection and replacement logic

### FeedbackReplacer Module

The module provides three main functions:

```javascript
// Detect all patterns in text
FeedbackReplacer.detectPatterns(text);
// Returns: [{originalText, numericId, startIndex, endIndex}, ...]

// Replace patterns and get result
FeedbackReplacer.replacePatterns(text);
// Returns: {text: "replaced text", count: numberOfReplacements}

// Check if text has replaceable patterns
FeedbackReplacer.hasReplaceablePatterns(text);
// Returns: boolean
```

## Deployment

Host the files on any static web server (AWS Amplify, GitHub Pages, Netlify, etc.) and configure the Trello Power-Up to point to your hosted URL.

## License

MIT
