export interface TokenConfig {
  symbol: string;
  threshold: number;
}

export interface ChainConfig {
  blockchainId: string;  // e.g. 'ethereum', 'fraxtal'
  tokens: TokenConfig[];
}

export interface Config {
  slackWebhookUrl: string;
  chains: ChainConfig[];
}

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
