# Trello Power-Up - Hello World

A simple Trello Power-Up that logs "Hello World" to the console, deployed to AWS Amplify via GitHub Actions and CloudFormation.

## Features

- Logs "Hello World" to the browser console when the Power-Up loads
- Adds a "Hello World" button to Trello boards
- Opens a popup when the button is clicked
- Automatically deploys to AWS Amplify when you push to the main branch
- Infrastructure as Code using AWS CloudFormation

## Setup

### Prerequisites

- A Trello account
- An AWS account
- GitHub repository (this repo)
- GitHub Personal Access Token (for Amplify to access your repo)

## Deployment

### Step 1: Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with `repo` scope
3. Save this token securely

### Step 2: Configure GitHub Secrets

Add these **3 secrets** to your GitHub repository (Settings → Secrets and variables → Actions):

- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `AMPLIFY_GITHUB_TOKEN` - Your GitHub personal access token (Amplify needs this to clone your repo and deploy it)

**Note**: AWS region (us-east-2) and GitHub repo URL are hardcoded in the workflow.

### Step 3: Push to Main Branch

GitHub Actions will automatically:
1. Deploy CloudFormation stack (creates Amplify app, IAM service role, and branch configuration)
2. Trigger Amplify build and deployment
3. Your Power-Up will be live at the Amplify URL

```bash
git push origin main
```

### Step 4: Get Your Amplify URL

Check the AWS Amplify Console or run:

```bash
aws cloudformation describe-stacks \
  --stack-name trello-powerup-amplify \
  --query 'Stacks[0].Outputs[?OutputKey==`AmplifyAppUrl`].OutputValue' \
  --output text \
  --region us-east-2
```

### Trello Power-Up Setup

1. Go to [Trello Power-Ups Admin](https://trello.com/power-ups/admin)
2. Click "Create New Power-Up"
3. Fill in the details:
   - **Name**: Hello World Power-Up
   - **Iframe Connector URL**: Your AWS Amplify URL + `/index.html`
4. Save and enable the Power-Up on your Trello board

## Project Structure

```
.
├── index.html              # Main Power-Up connector file
├── popup.html              # Popup displayed when button is clicked
├── manifest.json           # Power-Up configuration
├── amplify.yml             # Amplify build configuration
├── cloudformation/
│   ├── amplify.yaml        # CloudFormation template
│   └── parameters.example.json  # Example parameters
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions workflow
```

## Development

The Power-Up consists of:
- `index.html` - Main connector file that initializes the Power-Up
- `popup.html` - Popup displayed when the "Hello World" button is clicked
- `manifest.json` - Power-Up configuration
- `amplify.yml` - AWS Amplify build configuration
- `cloudformation/` - Infrastructure as Code templates

## Continuous Deployment

Once configured, simply push to the main branch and GitHub Actions will automatically deploy to AWS Amplify:

```bash
git add .
git commit -m "Update Power-Up"
git push origin main
```

## CloudFormation Management

### Update Infrastructure

GitHub Actions automatically updates the CloudFormation stack when you push to main. To manually update:

```bash
aws cloudformation deploy \
  --template-file cloudformation/amplify.yaml \
  --stack-name trello-powerup-amplify \
  --parameter-overrides \
    RepositoryUrl=https://github.com/mevlana14/trello-urlizer.github.io \
    GitHubToken=your_token \
    BranchName=main \
    AppName=trello-powerup-hello-world \
  --capabilities CAPABILITY_IAM \
  --region us-east-2
```

### Delete Stack

To completely remove all AWS resources:

```bash
aws cloudformation delete-stack \
  --stack-name trello-powerup-amplify \
  --region us-east-2
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
