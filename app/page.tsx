import { DonationCard } from "@/components/DonationCard";
import { RecentDonations } from "@/components/RecentDonations";

export default function Page() {
  return (
    <div className="min-h-screen bg-brand-dark py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl mb-2">
            Support My Work
          </h1>
          <p className="text-lg text-white">
            Your support helps me create more amazing content.
          </p>
        </div>

        <DonationCard />
        <RecentDonations />
      </div>
    </div>
  );
}
