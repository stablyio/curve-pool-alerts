import { TokenPrice } from './curve-service';

export interface PriceAlert {
    symbol: string;
    currentPrice: number;
    threshold: number;
    timestamp: string;
    blockchainId: string;
}

export class PriceChecker {
    constructor(private readonly threshold: number) {}

    checkPrice(tokenPrice: TokenPrice): PriceAlert | null {
        if (tokenPrice.price < this.threshold) {
            return {
                symbol: tokenPrice.symbol,
                currentPrice: tokenPrice.price,
                threshold: this.threshold,
                timestamp: new Date().toISOString(),
                blockchainId: tokenPrice.blockchainId,
            };
        }
        return null;
    }
}
