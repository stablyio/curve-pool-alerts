import { handler } from './index';
import axios from 'axios';
import { IncomingWebhook } from '@slack/webhook';
import { config } from './config';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Slack webhook
jest.mock('@slack/webhook');
const mockedWebhook = {
    send: jest.fn()
};
(IncomingWebhook as jest.Mock).mockImplementation(() => mockedWebhook);

describe('Lambda Integration Tests', () => {
    const mockEvent = {
        time: '2023-01-01T00:00:00Z',
        detail: {}
    };
    const mockContext = {
        awsRequestId: 'test-request-id',
        functionName: 'test-function'
    } as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not send alert when price is above threshold', async () => {
        // Mock responses for each chain
        for (const chain of config.chains) {
            mockedAxios.get.mockResolvedValueOnce({
                data: {
                    data: {
                        tokens: chain.tokens.map(t => ({
                            symbol: t.symbol,
                            usdPrice: (t.threshold + 0.01).toString()
                        }))
                    }
                }
            });
        }

        await handler(mockEvent as any);

        expect(mockedWebhook.send).not.toHaveBeenCalled();
    });

    it('should send alert when price is below threshold', async () => {
        // Mock responses for each chain
        for (const chain of config.chains) {
            mockedAxios.get.mockResolvedValueOnce({
                data: {
                    data: {
                        tokens: chain.tokens.map(t => ({
                            symbol: t.symbol,
                            usdPrice: (t.threshold - 0.01).toString()
                        }))
                    }
                }
            });
        }

        await handler(mockEvent as any);

        expect(mockedWebhook.send).toHaveBeenCalled();
        const slackMessage = mockedWebhook.send.mock.calls[0][0];
        const firstChain = config.chains[0];
        const firstToken = firstChain.tokens[0];
        expect(slackMessage.text).toContain(firstToken.symbol);
        expect(slackMessage.text).toContain(firstChain.blockchainId);
        expect(slackMessage.blocks[0].text.text).toContain((firstToken.threshold - 0.01).toFixed(4));
    });

    it('should handle API errors gracefully', async () => {
        // Mock error for first chain
        mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
        // Mock success for other chains
        for (let i = 1; i < config.chains.length; i++) {
            mockedAxios.get.mockResolvedValueOnce({
                data: {
                    data: {
                        tokens: config.chains[i].tokens.map(t => ({
                            symbol: t.symbol,
                            usdPrice: (t.threshold + 0.01).toString()
                        }))
                    }
                }
            });
        }
        const consoleSpy = jest.spyOn(console, 'error');

        await handler(mockEvent as any);

        expect(consoleSpy).toHaveBeenCalledWith(
            `Error checking price for ${config.chains[0].tokens[0].symbol} on ${config.chains[0].blockchainId}:`,
            expect.any(Error)
        );
        consoleSpy.mockRestore();
    });

    it('should handle missing token in API response', async () => {
        // Mock missing token for first chain
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                data: {
                    tokens: [
                        {
                            symbol: 'OTHER',
                            usdPrice: '1.00'
                        }
                    ]
                }
            }
        });
        // Mock success for other chains
        for (let i = 1; i < config.chains.length; i++) {
            mockedAxios.get.mockResolvedValueOnce({
                data: {
                    data: {
                        tokens: config.chains[i].tokens.map(t => ({
                            symbol: t.symbol,
                            usdPrice: (t.threshold + 0.01).toString()
                        }))
                    }
                }
            });
        }
        const consoleSpy = jest.spyOn(console, 'error');

        await handler(mockEvent as any);

        expect(consoleSpy).toHaveBeenCalledWith(
            `Error checking price for ${config.chains[0].tokens[0].symbol} on ${config.chains[0].blockchainId}:`,
            expect.any(Error)
        );
        consoleSpy.mockRestore();
    });
});
