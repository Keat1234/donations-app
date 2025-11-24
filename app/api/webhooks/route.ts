import { waitUntil } from "@vercel/functions";
import type { Payment } from "@whop/sdk/resources.js";
import type { NextRequest } from "next/server";
import { whopsdk } from "@/lib/whop-sdk";

export async function POST(request: NextRequest): Promise<Response> {
	// Validate the webhook to ensure it's from Whop
	const requestBodyText = await request.text();
	const headers = Object.fromEntries(request.headers);
	const webhookData = whopsdk.webhooks.unwrap(requestBodyText, { headers });

	// Handle the webhook event
	if (webhookData.type === "payment.succeeded") {
		const { amount, currency, to_account_id, metadata } = webhookData.data as any;

		if (metadata?.type === "donation") {
			// Calculate split
			const totalAmount = amount;
			const creatorShare = Math.floor(totalAmount * 0.9); // 90% to creator
			// The remaining 10% stays in the app's account (which received the payment)

			// Transfer 90% to the creator (who installed the app)
			// Note: 'to_account_id' in the payment event might be the app's account or the user's.
			// We need to transfer TO the creator's account. 
			// Assuming we have the creator's account ID from the installation context or metadata.
			// For this template, we'll assume 'to_account_id' is the context we need or we look it up.

			// Actually, for a Whop App, the payment usually goes to the App's account first.
			// We then transfer to the company that installed the app.
			// We'll use a placeholder for the destination account ID logic.

			try {
				await whopsdk.transfers.create({
					amount: creatorShare,
					currency: currency,
					destination_account_id: "CREATOR_ACCOUNT_ID_PLACEHOLDER", // TODO: Retrieve actual creator account ID
					description: "Donation payout (90%)",
				});
				console.log(`Transferred ${creatorShare} ${currency} to creator.`);
			} catch (transferError) {
				console.error("Transfer failed:", transferError);
				// Don't fail the webhook, just log it. We might need to retry manually.
			}
		}
		waitUntil(handlePaymentSucceeded(webhookData.data));
	}

	// Make sure to return a 2xx status code quickly. Otherwise the webhook will be retried.
	return new Response("OK", { status: 200 });
}

async function handlePaymentSucceeded(payment: Payment) {
	// This is a placeholder for a potentially long running operation
	// In a real scenario, you might need to fetch user data, update a database, etc.
	console.log("[PAYMENT SUCCEEDED]", payment);
}
