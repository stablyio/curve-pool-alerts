import { PriceChecker } from "../price-checker";
import { TokenPrice } from "../curve-service";

describe("PriceChecker", () => {
  it("should return null when price is within thresholds", () => {
    const lowerThreshold = 0.99;
    const upperThreshold = 1.01;
    const checker = new PriceChecker(lowerThreshold, upperThreshold);
    const tokenPrice: TokenPrice = {
      symbol: "dUSD",
      price: 1.0,
      blockchainId: "fraxtal",
    };

    const result = checker.checkPrice(tokenPrice);
    expect(result).toBeNull();
  });

  it("should return alert when price is below lower threshold", () => {
    const lowerThreshold = 0.99;
    const upperThreshold = 1.01;
    const checker = new PriceChecker(lowerThreshold, upperThreshold);
    const tokenPrice: TokenPrice = {
      symbol: "dUSD",
      price: 0.98,
      blockchainId: "fraxtal",
    };

    const result = checker.checkPrice(tokenPrice);
    expect(result).not.toBeNull();
    expect(result?.symbol).toBe("dUSD");
    expect(result?.currentPrice).toBe(0.98);
    expect(result?.breachedThreshold).toBe(lowerThreshold);
    expect(result?.thresholdType).toBe("lower");
    expect(result?.timestamp).toBeDefined();
    expect(result?.blockchainId).toBe("fraxtal");
  });

  it("should return alert when price is above upper threshold", () => {
    const lowerThreshold = 0.99;
    const upperThreshold = 1.01;
    const checker = new PriceChecker(lowerThreshold, upperThreshold);
    const tokenPrice: TokenPrice = {
      symbol: "dUSD",
      price: 1.02,
      blockchainId: "fraxtal",
    };

    const result = checker.checkPrice(tokenPrice);
    expect(result).not.toBeNull();
    expect(result?.symbol).toBe("dUSD");
    expect(result?.currentPrice).toBe(1.02);
    expect(result?.breachedThreshold).toBe(upperThreshold);
    expect(result?.thresholdType).toBe("upper");
    expect(result?.timestamp).toBeDefined();
    expect(result?.blockchainId).toBe("fraxtal");
  });

  it("should return null when price equals lower threshold", () => {
    const lowerThreshold = 0.99;
    const upperThreshold = 1.01;
    const checker = new PriceChecker(lowerThreshold, upperThreshold);
    const tokenPrice: TokenPrice = {
      symbol: "dUSD",
      price: lowerThreshold,
      blockchainId: "fraxtal",
    };

    const result = checker.checkPrice(tokenPrice);
    expect(result).toBeNull();
  });

  it("should return null when price equals upper threshold", () => {
    const lowerThreshold = 0.99;
    const upperThreshold = 1.01;
    const checker = new PriceChecker(lowerThreshold, upperThreshold);
    const tokenPrice: TokenPrice = {
      symbol: "dUSD",
      price: upperThreshold,
      blockchainId: "fraxtal",
    };

    const result = checker.checkPrice(tokenPrice);
    expect(result).toBeNull();
  });
});
