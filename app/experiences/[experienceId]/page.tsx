import { DonationCard } from "@/components/DonationCard";
import { RecentDonations } from "@/components/RecentDonations";
import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	const { experienceId } = await params;
	// Ensure the user is logged in on whop.
	const { userId } = await whopsdk.verifyUserToken(await headers());

	// Fetch the neccessary data we want from whop.
	const user = await whopsdk.users.retrieve(userId);

	const displayName = user.name || `@${user.username}`;

	return (
		<div className="min-h-screen bg-brand-dark py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl mb-2">
						Hi {displayName}!
					</h1>
					<p className="text-lg text-white">
						Support the creator of this Whop directly.
					</p>
				</div>

				<DonationCard experienceId={experienceId} />
				<RecentDonations />
			</div>
		</div>
	);
}
