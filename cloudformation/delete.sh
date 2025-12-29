#!/bin/bash

# Delete the CloudFormation stack

set -e

STACK_NAME="trello-powerup-amplify"

echo "Deleting CloudFormation stack: $STACK_NAME"

aws cloudformation delete-stack \
    --stack-name $STACK_NAME \
    --region ${AWS_REGION:-us-east-1}

echo "Stack deletion initiated. Waiting for completion..."

aws cloudformation wait stack-delete-complete \
    --stack-name $STACK_NAME \
    --region ${AWS_REGION:-us-east-1}

echo "Stack deleted successfully!"
