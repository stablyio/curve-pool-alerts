import { IncomingWebhook } from '@slack/webhook';
import { PriceAlert } from './price-checker';

export class NotificationService {
    private webhook: IncomingWebhook;

    constructor(webhookUrl: string) {
        this.webhook = new IncomingWebhook(webhookUrl);
    }

    async sendAlert(alert: PriceAlert): Promise<void> {
        const message = {
            text: `🚨 Price Alert for ${alert.symbol}!`,
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*Price Alert for ${alert.symbol}*\n\n` +
                              `Current Price: $${alert.currentPrice.toFixed(4)}\n` +
                              `Threshold: $${alert.threshold.toFixed(4)}\n` +
                              `Time: ${new Date(alert.timestamp).toLocaleString()}`
                    }
                }
            ]
        };

        try {
            await this.webhook.send(message);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to send Slack notification: ${error.message}`);
            }
            throw error;
        }
    }
}
