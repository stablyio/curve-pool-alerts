import { ScheduledEvent } from 'aws-lambda';
import { CurveService } from './services/curve-service';
import { PriceChecker } from './services/price-checker';
import { NotificationService } from './services/notification-service';
import { config } from './config';

export const handler = async (event: ScheduledEvent): Promise<void> => {
    console.log('Event:', JSON.stringify(event, null, 2));

    const notificationService = new NotificationService(config.slackWebhookUrl);

    for (const chainConfig of config.chains) {
        console.log(`Checking prices for chain: ${chainConfig.blockchainId}`);
        const curveService = new CurveService(chainConfig.blockchainId);

        for (const tokenConfig of chainConfig.tokens) {
            const priceChecker = new PriceChecker(tokenConfig.threshold);
            try {
                const tokenPrice = await curveService.getTokenPrice(tokenConfig.symbol);
                console.log(`Current ${tokenConfig.symbol} price on ${chainConfig.blockchainId}: ${tokenPrice.price}`);

                const alert = priceChecker.checkPrice(tokenPrice);
                if (alert) {
                    console.log(`Price alert triggered for ${tokenConfig.symbol} on ${chainConfig.blockchainId}, sending notification`);
                    await notificationService.sendAlert(alert);
                } else {
                    console.log(`Price of ${tokenConfig.symbol} on ${chainConfig.blockchainId} is above threshold, no alert needed`);
                }
            } catch (error) {
                console.error(`Error checking price for ${tokenConfig.symbol} on ${chainConfig.blockchainId}:`, error);
            }
        }
    }
};
