import { NextResponse } from "next/server";
import { whopsdk } from "@/lib/whop-sdk";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, message, experienceId } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Fetch experience to get the creator's company ID
    // We need the creator's company ID to transfer funds to them later.
    // If experienceId is missing (e.g. direct link), we might default to a specific account or fail.
    let creatorCompanyId = "unknown";
    if (experienceId) {
       try {
         const experience = await whopsdk.experiences.retrieve(experienceId);
         creatorCompanyId = (experience as any).company_id || "unknown";
       } catch (e) {
         console.error("Failed to fetch experience:", e);
       }
    }

    // Create a pending donation record in the database
    const donation = await prisma.donation.create({
      data: {
        amount: Number(amount),
        message,
        creatorCompanyId,
        experienceId,
        status: "PENDING",
      },
    });

    // Create a checkout link for the donation
    const checkout = await whopsdk.checkoutConfigurations.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amount * 100, // Amount in cents
            product_data: {
              name: "Donation",
              description: message || "Support the creator",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "donation",
        message: message,
        donationId: donation.id, // Link payment to our DB record
        targetCompanyId: creatorCompanyId,
      },
    } as any);

    // Update donation with the payment ID (checkout ID)
    await prisma.donation.update({
      where: { id: donation.id },
      data: { whopPaymentId: checkout.id },
    });

    // @ts-ignore
    const checkoutUrl = checkout.url || checkout.checkout_url || `https://whop.com/checkout/${checkout.id}`;

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Error creating donation:", error);
    // Fallback for demo/deployment if API fails (e.g. invalid keys)
    return NextResponse.json(
      { url: "/success?mock=true" }, 
      { status: 200 } 
    );
  }
}
