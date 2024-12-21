import axios from 'axios';

export interface TokenPrice {
    symbol: string;
    price: number;
}

export class CurveService {
    private readonly baseUrl: string;

    constructor(baseUrl: string = 'https://api.curve.fi/v1/getTokens/all/fraxtal') {
        this.baseUrl = baseUrl;
    }

    async getTokenPrice(symbol: string): Promise<TokenPrice> {
        try {
            const response = await axios.get(this.baseUrl);
            const tokens = response.data?.data?.tokens || [];
            const token = tokens.find((t: any) => t.symbol === symbol);
            
            if (!token) {
                throw new Error(`Token ${symbol} not found`);
            }

            return {
                symbol,
                price: parseFloat(token.usdPrice)
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch token price: ${error.message}`);
            }
            throw error;
        }
    }
}
