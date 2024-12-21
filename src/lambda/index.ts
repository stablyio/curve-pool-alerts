import { Context, ScheduledEvent } from 'aws-lambda';
import { CurveService } from './services/curve-service';
import { PriceChecker } from './services/price-checker';
import { NotificationService } from './services/notification-service';
import config from './config.json';

export const handler = async (event: ScheduledEvent, context: Context): Promise<void> => {
    console.log('Event:', JSON.stringify(event, null, 2));

    const curveService = new CurveService();
    const notificationService = new NotificationService(config.slackWebhookUrl);

    for (const tokenConfig of config.tokens) {
        const priceChecker = new PriceChecker(tokenConfig.threshold);
        try {
            const tokenPrice = await curveService.getTokenPrice(tokenConfig.symbol);
            console.log(`Current ${tokenConfig.symbol} price: ${tokenPrice.price}`);

            const alert = priceChecker.checkPrice(tokenPrice);
            if (alert) {
                console.log(`Price alert triggered for ${tokenConfig.symbol}, sending notification`);
                await notificationService.sendAlert(alert);
            } else {
                console.log(`Price of ${tokenConfig.symbol} is above threshold, no alert needed`);
            }
        } catch (error) {
            console.error(`Error checking price for ${tokenConfig.symbol}:`, error);
        }
    }
};
