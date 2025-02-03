export interface TokenConfig {
  symbol: string;
  address: string;
  lowerThreshold: number;
  upperThreshold: number;
}

export interface ChainConfig {
  blockchainId: string; // e.g. 'ethereum', 'fraxtal'
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
          address: "0x788D96f655735f52c676A133f4dFC53cEC614d4A",
          lowerThreshold: 0.99,
          upperThreshold: 1.01,
        },
      ],
    },
    {
      blockchainId: "ethereum",
      tokens: [
        {
          symbol: "USDT",
          address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          lowerThreshold: 0.99,
          upperThreshold: 1.01,
        },
      ],
    },
  ],
};
