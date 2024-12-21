import { handler } from './index';
import axios from 'axios';
import { IncomingWebhook } from '@slack/webhook';
import config from './config.json';

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
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                data: {
                    tokens: config.tokens.map(t => ({ symbol: t.symbol, usdPrice: (t.threshold + 0.01).toString() }))
                }
            }
        });

        await handler(mockEvent as any, mockContext);

        expect(mockedWebhook.send).not.toHaveBeenCalled();
    });

    it('should send alert when price is below threshold', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                data: {
                    tokens: config.tokens.map(t => ({ symbol: t.symbol, usdPrice: (t.threshold - 0.01).toString() }))
                }
            }
        });

        await handler(mockEvent as any, mockContext);

        expect(mockedWebhook.send).toHaveBeenCalled();
        const slackMessage = mockedWebhook.send.mock.calls[0][0];
        expect(slackMessage.text).toContain(config.tokens[0].symbol);
        expect(slackMessage.blocks[0].text.text).toContain((config.tokens[0].threshold - 0.01).toFixed(4));
    });

    it('should handle API errors gracefully', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
        const consoleSpy = jest.spyOn(console, 'error');

        await handler(mockEvent as any, mockContext);

        expect(consoleSpy).toHaveBeenCalledWith(
            `Error checking price for ${config.tokens[0].symbol}:`,
            expect.any(Error)
        );
        consoleSpy.mockRestore();
    });

    it('should handle missing token in API response', async () => {
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
        const consoleSpy = jest.spyOn(console, 'error');

        await handler(mockEvent as any, mockContext);

        expect(consoleSpy).toHaveBeenCalledWith(
            `Error checking price for ${config.tokens[0].symbol}:`,
            expect.any(Error)
        );
        consoleSpy.mockRestore();
    });
});
