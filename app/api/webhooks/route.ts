import { waitUntil } from "@vercel/functions";
import type { Payment } from "@whop/sdk/resources.js";
import type { NextRequest } from "next/server";
import { whopsdk } from "@/lib/whop-sdk";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest): Promise<Response> {
	// Validate the webhook to ensure it's from Whop
	const requestBodyText = await request.text();
	const headers = Object.fromEntries(request.headers);
	const webhookData = whopsdk.webhooks.unwrap(requestBodyText, { headers });

	// Handle the webhook event
	if (webhookData.type === "payment.succeeded") {
		const { amount, currency, to_account_id, metadata } = webhookData.data as any;

		if (metadata?.type === "donation") {
			// Update donation status in DB
			const donationId = metadata.donationId;
			if (donationId) {
				try {
					await prisma.donation.update({
						where: { id: donationId },
						data: {
							status: "COMPLETED",
							senderName: webhookData.data.billing_address?.name || "Anonymous",
						},
					});
				} catch (e) {
					console.error("Failed to update donation status:", e);
				}
			}

			// Calculate split
			const totalAmount = amount;
			const creatorShare = Math.floor(totalAmount * 0.9); // 90% to creator
			// The remaining 10% stays in the app's account (which received the payment)

			// Transfer 90% to the creator (who installed the app)
			const targetCompanyId = metadata.targetCompanyId;

			if (targetCompanyId && targetCompanyId !== "unknown") {
				try {
					// Note: In a real scenario, you need the destination ACCOUNT ID, not Company ID.
					// You would typically look up the account ID associated with the company.
					// For this template, we'll assume we can transfer to the company or we have a mapping.
					// If the SDK requires an Account ID, you'd need to fetch the company's owner or linked account.
					
					// Placeholder: We are using the company ID as the destination for now, 
					// but in production you must resolve this to a valid 'acct_' ID.
					await whopsdk.transfers.create({
						amount: creatorShare,
						currency: currency,
						destination_account_id: targetCompanyId, 
						description: "Donation payout (90%)",
					} as any);
					console.log(`Transferred ${creatorShare} ${currency} to ${targetCompanyId}.`);
				} catch (transferError) {
					console.error("Transfer failed:", transferError);
				}
			} else {
				console.warn("No target company ID found for donation transfer.");
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
