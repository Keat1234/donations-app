export function RecentDonations() {
  const donations = [
    { name: "Alex", amount: 20, message: "Keep up the great work!", time: "2m ago" },
    { name: "Sarah", amount: 5, message: "", time: "5m ago" },
    { name: "Mike", amount: 50, message: "Love the content!", time: "1h ago" },
  ];

  return (
    <div className="bg-brand-card border border-gray-800 rounded-2xl p-6 shadow-xl w-full max-w-md mx-auto mt-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Supporters</h3>
      <div className="space-y-4">
        {donations.map((donation, i) => (
          <div key={i} className="flex items-start space-x-3 pb-4 border-b border-gray-800 last:border-0 last:pb-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-brand-accent font-bold">
              {donation.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <span className="font-medium text-white">{donation.name}</span>
                <span className="text-brand-accent font-bold">${donation.amount}</span>
              </div>
              {donation.message && (
                <p className="text-white text-sm mt-1">{donation.message}</p>
              )}
              <p className="text-white text-xs mt-1">{donation.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
