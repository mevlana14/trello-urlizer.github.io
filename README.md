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
- An AWS account with AWS CLI configured
- GitHub repository (this repo)
- GitHub Personal Access Token (for Amplify to access your repo)

## Deployment Options

You can deploy this Power-Up in two ways:

### Option 1: CloudFormation Deployment (Recommended)

CloudFormation automates the entire AWS Amplify infrastructure setup.

#### Step 1: Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with `repo` scope
3. Save this token securely

#### Step 2: Configure CloudFormation Parameters

```bash
# Copy the example parameters file
cp cloudformation/parameters.example.json cloudformation/parameters.json

# Edit parameters.json with your values
```

Update the following values in `cloudformation/parameters.json`:
- `RepositoryUrl`: Your GitHub repository URL (e.g., https://github.com/username/repo)
- `GitHubToken`: Your GitHub personal access token
- `BranchName`: Branch to deploy (default: main)
- `AppName`: Name for your Amplify app

#### Step 3: Deploy with CloudFormation

```bash
# Set your AWS region
export AWS_REGION=us-east-1

# Deploy using the script
./cloudformation/deploy.sh
```

Or manually:

```bash
aws cloudformation deploy \
  --template-file cloudformation/amplify.yaml \
  --stack-name trello-powerup-amplify \
  --parameter-overrides file://cloudformation/parameters.json \
  --capabilities CAPABILITY_IAM \
  --region us-east-1
```

#### Step 4: Get Your Amplify URL

```bash
aws cloudformation describe-stacks \
  --stack-name trello-powerup-amplify \
  --query 'Stacks[0].Outputs' \
  --output table
```

#### Step 5: Configure GitHub Actions (Optional)

To enable automatic deployments via GitHub Actions when pushing to main:

Add these secrets to your GitHub repository:
- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `AWS_REGION` - Your AWS region (e.g., us-east-1)
- `USE_CLOUDFORMATION` - Set to `true` to use CloudFormation deployment
- `GITHUB_REPO_URL` - Your GitHub repository URL
- `GITHUB_TOKEN_AMPLIFY` - Your GitHub personal access token

### Option 2: Manual AWS Amplify Setup

1. Log in to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Configure build settings (or use the default settings)
5. Deploy

Add these secrets to your GitHub repository:
- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `AWS_REGION` - Your AWS region (e.g., us-east-1)
- `AMPLIFY_APP_ID` - Your Amplify app ID (from the console)

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
│   ├── parameters.example.json  # Example parameters
│   ├── deploy.sh           # Deployment script
│   └── delete.sh           # Stack deletion script
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

### Update Stack

To update your Amplify infrastructure:

```bash
./cloudformation/deploy.sh
```

### Delete Stack

To completely remove all AWS resources:

```bash
./cloudformation/delete.sh
```

Or manually:

```bash
aws cloudformation delete-stack \
  --stack-name trello-powerup-amplify \
  --region us-east-1
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
