import { PriceChecker } from '../price-checker';
import { TokenPrice } from '../curve-service';

describe('PriceChecker', () => {
    it('should return null when price is above threshold', () => {
        const threshold = 0.99;
        const checker = new PriceChecker(threshold);
        const tokenPrice: TokenPrice = {
            symbol: 'dUSD',
            price: 1.00
        };

        const result = checker.checkPrice(tokenPrice);
        expect(result).toBeNull();
    });

    it('should return alert when price is below threshold', () => {
        const threshold = 0.99;
        const checker = new PriceChecker(threshold);
        const tokenPrice: TokenPrice = {
            symbol: 'dUSD',
            price: 0.98
        };

        const result = checker.checkPrice(tokenPrice);
        expect(result).not.toBeNull();
        expect(result?.symbol).toBe('dUSD');
        expect(result?.currentPrice).toBe(0.98);
        expect(result?.threshold).toBe(threshold);
        expect(result?.timestamp).toBeDefined();
    });

     it('should return null when price equals threshold', () => {
        const threshold = 0.99;
        const checker = new PriceChecker(threshold);
         const tokenPrice: TokenPrice = {
            symbol: 'dUSD',
            price: threshold
        };

        const result = checker.checkPrice(tokenPrice);
        expect(result).toBeNull();
    });
});
