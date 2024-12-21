import { ScheduledEvent } from "aws-lambda";
import { CurveService } from "./services/curve-service";
import { PriceChecker } from "./services/price-checker";
import { NotificationService } from "./services/notification-service";
import { config } from "./config";

export const handler = async (event: any) => {
  console.log("Event:", JSON.stringify(event, null, 2));
  // Your Lambda function logic here
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success" }),
  };
};
