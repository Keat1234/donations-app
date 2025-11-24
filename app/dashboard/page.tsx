import { whopsdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const { userId } = await whopsdk.verifyUserToken(await headers());
  
  // In a real app, we would verify if the user is an admin of the company
  // For this template, we'll just fetch all donations for now or filter by a specific logic
  // if we had the user's company ID.
  
  // Fetch donations from DB
  const donations = await prisma.donation.findMany({
    where: {
      status: "COMPLETED",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  const totalDonated = await prisma.donation.aggregate({
    where: { status: "COMPLETED" },
    _sum: { amount: true },
  });

  const totalAmount = totalDonated._sum.amount || 0;
  const netEarnings = totalAmount * 0.9; // 90% share
  const supporterCount = await prisma.donation.count({
    where: { status: "COMPLETED" },
  });

  const stats = {
    totalDonated: totalAmount.toFixed(2),
    netEarnings: netEarnings.toFixed(2),
    supporters: supporterCount,
  };

  return (
    <div className="min-h-screen bg-brand-dark p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Creator Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-brand-card border border-gray-800 rounded-2xl p-6">
            <h3 className="text-gray-200 text-sm font-medium mb-2">Total Donated</h3>
            <p className="text-3xl font-bold text-white">${stats.totalDonated}</p>
          </div>
          <div className="bg-brand-card border border-gray-800 rounded-2xl p-6">
            <h3 className="text-gray-200 text-sm font-medium mb-2">Net Earnings</h3>
            <p className="text-3xl font-bold text-white">${stats.netEarnings}</p>
          </div>
          <div className="bg-brand-card border border-gray-800 rounded-2xl p-6">
            <h3 className="text-gray-200 text-sm font-medium mb-2">Supporters</h3>
            <p className="text-3xl font-bold text-white">{stats.supporters}</p>
          </div>
        </div>

        <div className="bg-brand-card border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          {donations.length > 0 ? (
            <div className="space-y-4">
              {donations.map((donation: any) => (
                <div key={donation.id} className="flex justify-between items-center border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="text-white font-medium">{donation.senderName || "Anonymous"}</p>
                    <p className="text-gray-400 text-sm">{donation.message || "No message"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-brand-accent font-bold">${donation.amount}</p>
                    <p className="text-gray-500 text-xs">{new Date(donation.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-200">No recent activity to show.</p>
          )}
        </div>
      </div>
    </div>
  );
}
