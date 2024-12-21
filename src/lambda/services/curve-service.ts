import axios from 'axios';

export interface TokenPrice {
    symbol: string;
    price: number;
    blockchainId: string;
}

interface CurveApiToken {
    symbol: string;
    usdPrice: string;
}

interface CurveApiResponse {
    data: {
        tokens: CurveApiToken[];
    };
}

export class CurveService {
    private readonly baseUrl: string;
    private readonly blockchainId: string;

    constructor(blockchainId: string) {
        this.blockchainId = blockchainId;
        this.baseUrl = `https://api.curve.fi/v1/getTokens/all/${blockchainId}`;
    }

    async getTokenPrice(symbol: string): Promise<TokenPrice> {
        try {
            const response = await axios.get<CurveApiResponse>(this.baseUrl);
            const tokens = response.data?.data?.tokens || [];
            const token = tokens.find((t: CurveApiToken) => t.symbol === symbol);

            if (!token) {
                throw new Error(`Token ${symbol} not found on chain ${this.blockchainId}`);
            }

            return {
                symbol,
                price: parseFloat(token.usdPrice),
                blockchainId: this.blockchainId
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch token price on chain ${this.blockchainId}: ${error.message}`);
            }
            throw error;
        }
    }
}
