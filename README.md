# Curve Pool Alerts Bot

A TypeScript AWS Lambda bot that runs on a schedule to monitor Curve pools.

## Prerequisites

- Node.js v18 or later
- AWS CLI configured with appropriate credentials
- AWS CDK CLI installed globally (`npm install -g aws-cdk`)

## Setup

1. Clone the repository:
```bash
git clone [your-repo-url]
cd curve-pool-alerts
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Local Development

- Build the project: `npm run build`
- Watch for changes: `npm run watch`
- Synthesize CloudFormation template: `npm run synth`
- Compare deployed stack with current state: `npm run diff`

## Deployment

### Manual Deployment

1. Make sure you have AWS credentials configured:
```bash
aws configure
```

2. Deploy the stack:
```bash
npm run deploy
```

### Automated Deployment (GitHub Actions)

The project includes a GitHub Actions workflow that automatically deploys to AWS Lambda when pushing to the main branch.

To enable automated deployments:

1. Add the following secrets to your GitHub repository:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

2. Push to the main branch to trigger deployment.

## Infrastructure

The project uses AWS CDK to define infrastructure as code:

- AWS Lambda function running on Node.js 18.x
- CloudWatch Events (EventBridge) rule for hourly execution
- IAM roles and permissions

## Cleanup

To remove all deployed resources:

```bash
npm run destroy
```

## Project Structure

```
.
├── src/
│   └── lambda/           # Lambda function code
├── lib/                  # CDK infrastructure code
├── bin/                  # CDK app entry point
├── dist/                 # Compiled JavaScript
└── cdk.out/             # CDK output
