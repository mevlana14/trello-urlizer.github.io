# Trello Power-Up - Hello World

A simple Trello Power-Up that logs "Hello World" to the console, deployed to AWS Amplify via GitHub Actions.

## Features

- Logs "Hello World" to the browser console when the Power-Up loads
- Adds a "Hello World" button to Trello boards
- Opens a popup when the button is clicked
- Automatically deploys to AWS Amplify when you push to the main branch

## Setup

### Prerequisites

- A Trello account
- An AWS account
- GitHub repository (this repo)

### AWS Amplify Setup

1. Log in to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Configure build settings (or use the default settings)
5. Deploy

### GitHub Actions Setup

The repository includes a GitHub Actions workflow that automatically deploys to AWS Amplify when you push to the main branch.

You'll need to add these secrets to your GitHub repository:
- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `AWS_REGION` - Your AWS region (e.g., us-east-1)
- `AMPLIFY_APP_ID` - Your Amplify app ID

### Trello Power-Up Setup

1. Go to [Trello Power-Ups Admin](https://trello.com/power-ups/admin)
2. Click "Create New Power-Up"
3. Fill in the details:
   - **Name**: Hello World Power-Up
   - **Iframe Connector URL**: Your AWS Amplify URL + `/index.html`
4. Save and enable the Power-Up on your Trello board

## Development

The Power-Up consists of:
- `index.html` - Main connector file that initializes the Power-Up
- `popup.html` - Popup displayed when the "Hello World" button is clicked
- `manifest.json` - Power-Up configuration

## Deployment

Simply push to the main branch and GitHub Actions will automatically deploy to AWS Amplify:

```bash
git add .
git commit -m "Update Power-Up"
git push origin main
```

## Console Logs

When the Power-Up is loaded, you'll see these console logs:
- "Hello World" - When index.html loads
- "Hello World from card-badges" - When viewing cards
- "Hello World from card-buttons" - When viewing cards
- "Hello World from board-buttons" - When viewing boards
- "Trello Power-Up initialized - Hello World" - After initialization
- "Hello World from popup!" - When opening the popup

## License

MIT
