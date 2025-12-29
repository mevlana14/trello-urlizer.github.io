#!/bin/bash

# Deploy Trello Power-Up to AWS Amplify using CloudFormation

set -e

STACK_NAME="trello-powerup-amplify"
TEMPLATE_FILE="cloudformation/amplify.yaml"
PARAMETERS_FILE="cloudformation/parameters.json"

echo "Deploying CloudFormation stack: $STACK_NAME"

# Check if parameters file exists
if [ ! -f "$PARAMETERS_FILE" ]; then
    echo "Error: $PARAMETERS_FILE not found!"
    echo "Please copy parameters.example.json to parameters.json and fill in your values"
    exit 1
fi

# Deploy the CloudFormation stack
aws cloudformation deploy \
    --template-file $TEMPLATE_FILE \
    --stack-name $STACK_NAME \
    --parameter-overrides file://$PARAMETERS_FILE \
    --capabilities CAPABILITY_IAM \
    --region ${AWS_REGION:-us-east-1}

# Get the outputs
echo ""
echo "Deployment complete! Fetching outputs..."
echo ""

aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs' \
    --output table \
    --region ${AWS_REGION:-us-east-1}
