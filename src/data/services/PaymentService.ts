import { customTokenFreeFetch } from "./util";

interface Payload {
  orderId: string;
  businessAuthId: string;
  total: number;
}

interface SubscriptionResponse {
  url: string;
}

export class PaymentService {
  static async makeSubscriptionPayment(
    payload: Payload
  ): Promise<SubscriptionResponse | null> {
    try {
      const data = await customTokenFreeFetch(
        `payment/subscription`,
        "POST",
        payload
      );
      return data as SubscriptionResponse;
    } catch (err: any) {
      console.error("Error making payment:", err.message);
      return null;
    }
  }

  static async makeSpecialPayment(
    payload: Payload
  ): Promise<SubscriptionResponse | null> {
    try {
      const data = await customTokenFreeFetch(
        `payment/special`,
        "POST",
        payload
      );
      return data as SubscriptionResponse;
    } catch (err: any) {
      console.error("Error making payment:", err.message);
      return null;
    }
  }

  static async makeFeaturedPayment(
    payload: Payload
  ): Promise<SubscriptionResponse | null> {
    try {
      const data = await customTokenFreeFetch(
        `payment/featured`,
        "POST",
        payload
      );
      return data as SubscriptionResponse;
    } catch (err: any) {
      console.error("Error making payment:", err.message);
      return null;
    }
  }

  static async makeMessageBlastPayment(
    payload: Payload
  ): Promise<SubscriptionResponse | null> {
    try {
      const data = await customTokenFreeFetch(
        `payment/message-blast`,
        "POST",
        payload
      );
      return data as SubscriptionResponse;
    } catch (err: any) {
      console.error("Error making payment:", err.message);
      return null;
    }
  }
}
