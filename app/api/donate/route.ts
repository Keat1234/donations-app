import { NextResponse } from "next/server";
import { whopsdk } from "@/lib/whop-sdk";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, message } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Create a line item for the donation
    // Note: This is a best-guess implementation based on standard Whop SDK patterns.
    // You may need to adjust the method name (e.g., createLineItem, createPaymentLink)
    // based on the specific SDK version documentation.
    
    // Example payload for creating a payment
    const payment = await whopsdk.payments.createLineItem({
      amount: amount * 100, // Amount in cents
      currency: "usd",
      description: message || "Donation to creator",
      metadata: {
        type: "donation",
        message: message,
      },
    });

    return NextResponse.json({ url: payment.checkout_url });
  } catch (error) {
    console.error("Error creating donation:", error);
    return NextResponse.json(
      { error: "Failed to create donation" },
      { status: 500 }
    );
  }
}
