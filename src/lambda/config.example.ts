import { Config } from './config';

export const config: Config = {
    slackWebhookUrl: "YOUR_SLACK_WEBHOOK_URL",
    chains: [
        {
            blockchainId: "fraxtal",
            tokens: [
                {
                    symbol: "dUSD",
                    threshold: 0.99
                }
            ]
        },
        {
            blockchainId: "ethereum",
            tokens: [
                {
                    symbol: "USDT",
                    threshold: 0.99
                }
            ]
        }
    ]
};
