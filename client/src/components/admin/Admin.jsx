import AdminStatCard from "../components/admin/AdminStatCard";
import ApprovalTrendChart from "../components/admin/ApprovalTrendChart";
import RiskDistributionChart from "../components/admin/RiskDistributionChart";

function Admin() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage loan applications and monitor analytics.
        </p>

        {/* KPI Cards */}

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-5 mt-8">

          <AdminStatCard
            title="Applications"
            value="1,248"
            color="text-blue-600"
          />

          <AdminStatCard
            title="Approved"
            value="1,016"
            color="text-green-600"
          />

          <AdminStatCard
            title="Rejected"
            value="232"
            color="text-red-600"
          />

          <AdminStatCard
            title="High Risk"
            value="87"
            color="text-orange-500"
          />

          <AdminStatCard
            title="Avg Income"
            value="₹68K"
            color="text-purple-600"
          />

          <AdminStatCard
            title="Credit Score"
            value="742"
            color="text-indigo-600"
          />

        </div>

        {/* Charts */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">

          <ApprovalTrendChart />

          <RiskDistributionChart />

        </div>

        {/* Recent Applications */}

        <div className="bg-white rounded-2xl shadow-md mt-10 p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-semibold">
              Recent Applications
            </h2>

            <input
              type="text"
              placeholder="Search..."
              className="border rounded-lg px-4 py-2"
            />

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-100">

                  <th className="py-3 text-left px-3">Name</th>
                  <th>Amount</th>
                  <th>Credit Score</th>
                  <th>Status</th>
                  <th>Risk</th>

                </tr>

              </thead>

              <tbody>

                <tr className="border-b text-center">

                  <td className="py-4 text-left px-3">
                    Rahul Sharma
                  </td>

                  <td>₹5,00,000</td>

                  <td>782</td>

                  <td className="text-green-600 font-semibold">
                    Approved
                  </td>

                  <td>Low</td>

                </tr>

                <tr className="border-b text-center">

                  <td className="py-4 text-left px-3">
                    Priya Patel
                  </td>

                  <td>₹8,00,000</td>

                  <td>610</td>

                  <td className="text-red-600 font-semibold">
                    Rejected
                  </td>

                  <td>High</td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

        {/* Quick Actions */}

        <div className="grid md:grid-cols-4 gap-5 mt-10">

          <button className="bg-blue-600 text-white rounded-xl py-4 hover:bg-blue-700">
            Export CSV
          </button>

          <button className="bg-green-600 text-white rounded-xl py-4 hover:bg-green-700">
            Export PDF
          </button>

          <button className="bg-purple-600 text-white rounded-xl py-4 hover:bg-purple-700">
            View Reports
          </button>

          <button className="bg-orange-500 text-white rounded-xl py-4 hover:bg-orange-600">
            Manage Users
          </button>

        </div>

      </div>
    </div>
  );
}

export default Admin;