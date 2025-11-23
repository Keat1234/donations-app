export default function DashboardPage() {
  // Mock data for now
  const stats = {
    totalDonated: 1250,
    netEarnings: 1125, // 90%
    supporterCount: 45,
  };

  return (
    <div className="min-h-screen bg-brand-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Creator Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-brand-card border border-gray-800 rounded-2xl p-6">
            <h3 className="text-gray-200 text-sm font-medium mb-2">Total Donated</h3>
            <p className="text-3xl font-bold text-white">${stats.totalDonated}</p>
          </div>
          <div className="bg-brand-card border border-gray-800 rounded-2xl p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Net Earnings</h3>
            <p className="text-3xl font-bold text-brand-accent">${stats.netEarnings}</p>
          </div>
          <div className="bg-brand-card border border-gray-800 rounded-2xl p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Supporters</h3>
            <p className="text-3xl font-bold text-white">{stats.supporterCount}</p>
          </div>
        </div>

        <div className="bg-brand-card border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <p className="text-gray-200">No recent activity to show.</p>
        </div>
      </div>
    </div>
  );
}
