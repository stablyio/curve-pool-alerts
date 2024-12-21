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

4. Configure the application:
```bash
# Copy the example config file
cp src/lambda/config.example.ts src/lambda/config.ts

# Edit the config file with your settings
# Replace YOUR_SLACK_WEBHOOK_URL with your actual Slack webhook URL
# Customize the chains and tokens you want to monitor
```

## Testing

Run the test suite:
```bash
npm test
```

The project includes:
- Unit tests for individual components
- Integration tests with mocked external services
- Live integration tests against the Curve API

## Linting

The project uses ESLint with TypeScript support for code quality.

- Run linting check:
```bash
npm run lint
```

- Fix auto-fixable issues:
```bash
npm run lint:fix
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

## Project Structure

```
.
├── src/
│   └── lambda/           # Lambda function code
├── lib/                  # CDK infrastructure code
├── bin/                  # CDK app entry point
├── dist/                 # Compiled JavaScript
└── cdk.out/             # CDK output
