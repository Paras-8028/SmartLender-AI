import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import {
  FaUsers,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaMoneyBillWave,
  FaShieldAlt,
  FaSyncAlt,
  FaUserShield,
  FaEye,
  FaTimes,
  FaSearch,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api";

function Admin() {
  const navigate = useNavigate();

  const [statistics, setStatistics] = useState(null);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] =
    useState("applications");

  const [actionLoading, setActionLoading] =
    useState(null);

  const [selectedLoan, setSelectedLoan] =
    useState(null);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [loanSearch, setLoanSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [riskFilter, setRiskFilter] =
    useState("All");

  const [userSearch, setUserSearch] =
    useState("");

  // ============================================================
  // Authentication
  // ============================================================

  const getToken = () =>
    localStorage.getItem("token");

  // ============================================================
  // Currency Formatter
  // ============================================================

  const formatCurrency = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "N/A";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return "N/A";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(number);
  };

  // ============================================================
  // Fetch Admin Data
  // ============================================================

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // --------------------------------------------------------
      // Dashboard Statistics
      // --------------------------------------------------------

      const dashboardResponse = await fetch(
        `${API_URL}/admin/dashboard`,
        { headers }
      );

      if (
        dashboardResponse.status === 401 ||
        dashboardResponse.status === 403
      ) {
        navigate("/dashboard");
        return;
      }

      const dashboardData =
        await dashboardResponse.json();

      if (!dashboardData.success) {
        throw new Error(
          dashboardData.message ||
            "Unable to load dashboard"
        );
      }

      setStatistics(
        dashboardData.statistics
      );

      // --------------------------------------------------------
      // Loan Applications
      // --------------------------------------------------------

      const loansResponse = await fetch(
        `${API_URL}/admin/loans`,
        { headers }
      );

      if (
        loansResponse.status === 401 ||
        loansResponse.status === 403
      ) {
        navigate("/dashboard");
        return;
      }

      const loansData =
        await loansResponse.json();

      if (!loansData.success) {
        throw new Error(
          loansData.message ||
            "Unable to load applications"
        );
      }

      setApplications(
        loansData.applications || []
      );

      // --------------------------------------------------------
      // Users
      // --------------------------------------------------------

      const usersResponse = await fetch(
        `${API_URL}/admin/users`,
        { headers }
      );

      if (
        usersResponse.status === 401 ||
        usersResponse.status === 403
      ) {
        navigate("/dashboard");
        return;
      }

      const usersData =
        await usersResponse.json();

      if (!usersData.success) {
        throw new Error(
          usersData.message ||
            "Unable to load users"
        );
      }

      setUsers(usersData.users || []);
    } catch (err) {
      console.error(
        "Admin dashboard error:",
        err
      );

      setError(
        err.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // ============================================================
  // Approve Loan
  // ============================================================

  const handleApproveLoan = async (
    loanId
  ) => {
    if (
      !window.confirm(
        "Are you sure you want to approve this loan?"
      )
    ) {
      return;
    }

    try {
      setActionLoading(loanId);

      const response = await fetch(
        `${API_URL}/admin/loans/${loanId}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to approve loan"
        );
      }

      setSelectedLoan(null);

      await fetchAdminData();

      window.alert(
        "Loan approved successfully."
      );
    } catch (err) {
      console.error(
        "Approve loan error:",
        err
      );

      window.alert(
        err.message ||
          "Unable to approve loan."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // Reject Loan
  // ============================================================

  const handleRejectLoan = async (
    loanId
  ) => {
    if (
      !window.confirm(
        "Are you sure you want to reject this loan?"
      )
    ) {
      return;
    }

    try {
      setActionLoading(loanId);

      const response = await fetch(
        `${API_URL}/admin/loans/${loanId}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to reject loan"
        );
      }

      setSelectedLoan(null);

      await fetchAdminData();

      window.alert(
        "Loan rejected successfully."
      );
    } catch (err) {
      console.error(
        "Reject loan error:",
        err
      );

      window.alert(
        err.message ||
          "Unable to reject loan."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // Approval Chart Data
  // ============================================================

  const approvalData = useMemo(() => {
    if (!statistics) {
      return [];
    }

    return [
      {
        name: "Approved",
        value: statistics.approved || 0,
      },
      {
        name: "Rejected",
        value: statistics.rejected || 0,
      },
      {
        name: "Pending",
        value: statistics.pending || 0,
      },
    ];
  }, [statistics]);

  // ============================================================
  // Risk Chart Data
  // ============================================================

  const riskData = useMemo(() => {
    if (!statistics) {
      return [];
    }

    return [
      {
        category: "Low Risk",
        count: statistics.lowRisk || 0,
      },
      {
        category: "Medium Risk",
        count: statistics.mediumRisk || 0,
      },
      {
        category: "High Risk",
        count: statistics.highRisk || 0,
      },
    ];
  }, [statistics]);

  // ============================================================
  // Filter Applications
  // ============================================================

  const filteredApplications =
    useMemo(() => {
      const query =
        loanSearch.trim().toLowerCase();

      return applications.filter(
        (loan) => {
          const applicant =
            loan.applicant?.name ||
            loan.applicantName ||
            loan.name ||
            "";

          const email =
            loan.applicant?.email ||
            loan.applicantEmail ||
            loan.email ||
            "";

          const status =
            loan.status || "Pending";

          const risk =
            loan.riskCategory ??
            loan.risk_category ??
            "";

          const matchesSearch =
            !query ||
            applicant
              .toLowerCase()
              .includes(query) ||
            email
              .toLowerCase()
              .includes(query) ||
            String(loan.id || "")
              .toLowerCase()
              .includes(query) ||
            String(
              loan.loanAmount || ""
            ).includes(query);

          const matchesStatus =
            statusFilter === "All" ||
            status.toLowerCase() ===
              statusFilter.toLowerCase();

          const matchesRisk =
            riskFilter === "All" ||
            risk.toLowerCase() ===
              riskFilter.toLowerCase();

          return (
            matchesSearch &&
            matchesStatus &&
            matchesRisk
          );
        }
      );
    }, [
      applications,
      loanSearch,
      statusFilter,
      riskFilter,
    ]);

  // ============================================================
  // Filter Users
  // ============================================================

  const filteredUsers = useMemo(() => {
    const query =
      userSearch.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) =>
      [
        user.name,
        user.email,
        user.phone,
        user.role,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [users, userSearch]);

  // ============================================================
  // Get User Loans
  // ============================================================

  const getUserLoans = (user) => {
    return applications.filter(
      (loan) =>
        loan.userId === user.id ||
        loan.user?.id === user.id ||
        loan.applicant?.id === user.id
    );
  };

  // ============================================================
  // Status Badge
  // ============================================================

  const getStatusBadge = (status) => {
    const normalized =
      status?.toLowerCase();

    if (normalized === "approved") {
      return "bg-green-100 text-green-700";
    }

    if (normalized === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  // ============================================================
  // Risk Badge
  // ============================================================

  const getRiskBadge = (risk) => {
    if (risk === "Low Risk") {
      return "bg-green-100 text-green-700";
    }

    if (risk === "Medium Risk") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (risk === "High Risk") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  // ============================================================
  // Applicant Helpers
  // ============================================================

  const applicantName = (loan) =>
    loan.applicant?.name ||
    loan.applicantName ||
    loan.name ||
    "Unknown";

  const applicantEmail = (loan) =>
    loan.applicant?.email ||
    loan.applicantEmail ||
    loan.email ||
    "N/A";

  const applicantPhone = (loan) =>
    loan.applicant?.phone ||
    loan.applicantPhone ||
    loan.phone ||
    "N/A";

  // ============================================================
  // Loading State
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <FaSyncAlt
            className="animate-spin text-blue-600 mx-auto"
            size={40}
          />

          <p className="text-gray-500 mt-4">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // Error State
  // ============================================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="max-w-3xl mx-auto mt-20">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold">
              Unable to Load Admin Dashboard
            </h1>

            <p className="mt-3">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchAdminData}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // Admin Dashboard
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-3 rounded-xl">
              <FaUserShield size={25} />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Admin Dashboard
              </h1>

              <p className="text-gray-500 mt-1">
                SmartLender AI administration panel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchAdminData}
            className="flex items-center justify-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-xl hover:bg-gray-50 transition"
          >
            <FaSyncAlt />
            Refresh Data
          </button>
        </div>

        {/* Primary Statistics */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <StatCard
            title="Total Users"
            value={statistics?.totalUsers || 0}
            icon={<FaUsers size={25} />}
            iconClass="bg-blue-100 text-blue-600"
          />

          <StatCard
            title="Applications"
            value={
              statistics?.totalApplications || 0
            }
            icon={
              <FaFileInvoiceDollar
                size={25}
              />
            }
            iconClass="bg-purple-100 text-purple-600"
          />

          <StatCard
            title="Approved Loans"
            value={statistics?.approved || 0}
            icon={<FaCheckCircle size={25} />}
            iconClass="bg-green-100 text-green-600"
            valueClass="text-green-600"
          />

          <StatCard
            title="Rejected Loans"
            value={statistics?.rejected || 0}
            icon={<FaTimesCircle size={25} />}
            iconClass="bg-red-100 text-red-600"
            valueClass="text-red-600"
          />
        </div>

        {/* Secondary Statistics */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <StatCard
            title="Pending"
            value={statistics?.pending || 0}
            icon={<FaClock />}
            iconClass="bg-yellow-100 text-yellow-600"
          />

          <StatCard
            title="Total Loan Amount"
            value={formatCurrency(
              statistics?.totalLoanAmount
            )}
            icon={<FaMoneyBillWave />}
            iconClass="bg-green-100 text-green-600"
            valueClass="text-xl"
          />

          <StatCard
            title="Average Risk Score"
            value={`${statistics?.averageRiskScore ?? 0}/100`}
            icon={<FaShieldAlt />}
            iconClass="bg-orange-100 text-orange-600"
            valueClass="text-2xl"
          />

          <StatCard
            title="User Accounts"
            value={users.length}
            icon={<FaUsers />}
            iconClass="bg-blue-100 text-blue-600"
          />
        </div>

        {/* Charts */}

        <div className="grid lg:grid-cols-2 gap-8 mt-8">

          {/* Approval Chart */}

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Loan Approval Overview
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Distribution of loan applications
            </p>

            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <PieChart>
                <Pie
                  data={approvalData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={110}
                  paddingAngle={3}
                  label
                >
                  {approvalData.map(
                    (entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          [
                            "#16a34a",
                            "#ef4444",
                            "#f59e0b",
                          ][index]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Chart */}

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Risk Distribution
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              AI risk categories
            </p>

            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="category" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="count"
                  name="Applications"
                  fill="#2563eb"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Management Tabs */}

        <div className="bg-white rounded-2xl shadow-sm mt-8">

          <div className="border-b flex">
            <button
              type="button"
              onClick={() =>
                setActiveTab("applications")
              }
              className={`px-6 py-4 font-semibold ${
                activeTab === "applications"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
            >
              Loan Applications
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab("users")
              }
              className={`px-6 py-4 font-semibold ${
                activeTab === "users"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
            >
              Users
            </button>
          </div>

          {/* ====================================================
              Applications Tab
          ==================================================== */}

          {activeTab === "applications" && (
            <div className="p-6">

              <div className="grid md:grid-cols-3 gap-4 mb-6">

                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    value={loanSearch}
                    onChange={(e) =>
                      setLoanSearch(
                        e.target.value
                      )
                    }
                    placeholder="Search applicant, email, ID..."
                    className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">
                    All Status
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Approved">
                    Approved
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>
                </select>

                <select
                  value={riskFilter}
                  onChange={(e) =>
                    setRiskFilter(
                      e.target.value
                    )
                  }
                  className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">
                    All Risk
                  </option>

                  <option value="Low Risk">
                    Low Risk
                  </option>

                  <option value="Medium Risk">
                    Medium Risk
                  </option>

                  <option value="High Risk">
                    High Risk
                  </option>
                </select>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Showing{" "}
                {filteredApplications.length}{" "}
                of {applications.length}{" "}
                applications
              </p>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                  <thead>
                    <tr className="border-b text-gray-500 text-sm">
                      <th className="text-left py-4 px-2">
                        Applicant
                      </th>

                      <th className="text-left py-4 px-2">
                        Loan Amount
                      </th>

                      <th className="text-left py-4 px-2">
                        Status
                      </th>

                      <th className="text-left py-4 px-2">
                        Risk
                      </th>

                      <th className="text-left py-4 px-2">
                        Risk Score
                      </th>

                      <th className="text-left py-4 px-2">
                        EMI
                      </th>

                      <th className="text-left py-4 px-2">
                        Date
                      </th>

                      <th className="text-left py-4 px-2">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredApplications.map(
                      (loan) => {
                        const riskScore =
                          loan.riskScore ??
                          loan.risk_score;

                        const riskCategory =
                          loan.riskCategory ??
                          loan.risk_category;

                        const emi =
                          loan.emi ??
                          loan.monthlyEMI ??
                          loan.monthly_emi;

                        const isPending =
                          loan.status?.toLowerCase() ===
                          "pending";

                        return (
                          <tr
                            key={loan.id}
                            className="border-b hover:bg-slate-50"
                          >
                            <td className="py-4 px-2">
                              <p className="font-semibold text-gray-800">
                                {applicantName(
                                  loan
                                )}
                              </p>

                              <p className="text-xs text-gray-500">
                                {applicantEmail(
                                  loan
                                )}
                              </p>
                            </td>

                            <td className="py-4 px-2 font-semibold">
                              {formatCurrency(
                                loan.loanAmount
                              )}
                            </td>

                            <td className="py-4 px-2">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                                  loan.status
                                )}`}
                              >
                                {loan.status ||
                                  "Pending"}
                              </span>
                            </td>

                            <td className="py-4 px-2">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskBadge(
                                  riskCategory
                                )}`}
                              >
                                {riskCategory ||
                                  "N/A"}
                              </span>
                            </td>

                            <td className="py-4 px-2 font-semibold">
                              {riskScore !==
                                undefined &&
                              riskScore !==
                                null
                                ? `${riskScore}/100`
                                : "N/A"}
                            </td>

                            <td className="py-4 px-2">
                              {formatCurrency(
                                emi
                              )}
                            </td>

                            <td className="py-4 px-2 text-sm text-gray-500">
                              {loan.createdAt
                                ? new Date(
                                    loan.createdAt
                                  ).toLocaleDateString(
                                    "en-IN"
                                  )
                                : "N/A"}
                            </td>

                            <td className="py-4 px-2">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedLoan(
                                      loan
                                    )
                                  }
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                                >
                                  <FaEye />
                                  View
                                </button>

                                {isPending && (
                                  <>
                                    <button
                                      type="button"
                                      disabled={
                                        actionLoading ===
                                        loan.id
                                      }
                                      onClick={() =>
                                        handleApproveLoan(
                                          loan.id
                                        )
                                      }
                                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                                    >
                                      {actionLoading ===
                                      loan.id
                                        ? "..."
                                        : "Approve"}
                                    </button>

                                    <button
                                      type="button"
                                      disabled={
                                        actionLoading ===
                                        loan.id
                                      }
                                      onClick={() =>
                                        handleRejectLoan(
                                          loan.id
                                        )
                                      }
                                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                                    >
                                      {actionLoading ===
                                      loan.id
                                        ? "..."
                                        : "Reject"}
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {filteredApplications.length ===
                0 && (
                <div className="text-center py-12 text-gray-500">
                  No loan applications found.
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              Users Tab
          ==================================================== */}

          {activeTab === "users" && (
            <div className="p-6">

              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    User Management
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {filteredUsers.length} of{" "}
                    {users.length} users
                  </p>
                </div>

                <div className="relative w-full md:w-96">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) =>
                      setUserSearch(
                        e.target.value
                      )
                    }
                    placeholder="Search name, email, phone or role..."
                    className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                  <thead>
                    <tr className="border-b text-gray-500 text-sm">
                      <th className="text-left py-4 px-2">
                        User
                      </th>

                      <th className="text-left py-4 px-2">
                        Phone
                      </th>

                      <th className="text-left py-4 px-2">
                        Role
                      </th>

                      <th className="text-left py-4 px-2">
                        Loans
                      </th>

                      <th className="text-left py-4 px-2">
                        Approved
                      </th>

                      <th className="text-left py-4 px-2">
                        Pending
                      </th>

                      <th className="text-left py-4 px-2">
                        Rejected
                      </th>

                      <th className="text-left py-4 px-2">
                        Total Amount
                      </th>

                      <th className="text-left py-4 px-2">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map(
                      (user) => {
                        const loans =
                          getUserLoans(user);

                        const approved =
                          loans.filter(
                            (loan) =>
                              loan.status?.toLowerCase() ===
                              "approved"
                          ).length;

                        const pending =
                          loans.filter(
                            (loan) =>
                              loan.status?.toLowerCase() ===
                              "pending"
                          ).length;

                        const rejected =
                          loans.filter(
                            (loan) =>
                              loan.status?.toLowerCase() ===
                              "rejected"
                          ).length;

                        const totalAmount =
                          loans.reduce(
                            (
                              total,
                              loan
                            ) => {
                              const amount =
                                Number(
                                  loan.loanAmount
                                );

                              return (
                                total +
                                (Number.isNaN(
                                  amount
                                )
                                  ? 0
                                  : amount)
                              );
                            },
                            0
                          );

                        return (
                          <tr
                            key={user.id}
                            className="border-b hover:bg-slate-50"
                          >
                            <td className="py-4 px-2">
                              <p className="font-semibold text-gray-800">
                                {user.name ||
                                  "N/A"}
                              </p>

                              <p className="text-xs text-gray-500">
                                {user.email ||
                                  "N/A"}
                              </p>
                            </td>

                            <td className="py-4 px-2">
                              {user.phone ||
                                "N/A"}
                            </td>

                            <td className="py-4 px-2">
                              <span
                                className={
                                  user.role ===
                                  "admin"
                                    ? "bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold"
                                    : "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold"
                                }
                              >
                                {user.role ||
                                  "user"}
                              </span>
                            </td>

                            <td className="py-4 px-2 font-semibold">
                              {loans.length}
                            </td>

                            <td className="py-4 px-2 text-green-600 font-semibold">
                              {approved}
                            </td>

                            <td className="py-4 px-2 text-yellow-600 font-semibold">
                              {pending}
                            </td>

                            <td className="py-4 px-2 text-red-600 font-semibold">
                              {rejected}
                            </td>

                            <td className="py-4 px-2 font-semibold">
                              {formatCurrency(
                                totalAmount
                              )}
                            </td>

                            <td className="py-4 px-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedUser(
                                    user
                                  )
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                              >
                                <FaEye />
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length ===
                0 && (
                <div className="text-center py-12 text-gray-500">
                  No users found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}

        <div className="py-8 text-center text-gray-400 text-sm">
          SmartLender AI Admin Panel
        </div>
      </div>

      {/* Loan Details Modal */}

      {selectedLoan && (
        <LoanDetailsModal
          loan={selectedLoan}
          actionLoading={actionLoading}
          getStatusBadge={getStatusBadge}
          getRiskBadge={getRiskBadge}
          formatCurrency={formatCurrency}
          applicantName={applicantName}
          applicantEmail={applicantEmail}
          applicantPhone={applicantPhone}
          onClose={() =>
            setSelectedLoan(null)
          }
          onApprove={handleApproveLoan}
          onReject={handleRejectLoan}
        />
      )}

      {/* User Details Modal */}

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          loans={getUserLoans(
            selectedUser
          )}
          formatCurrency={formatCurrency}
          onClose={() =>
            setSelectedUser(null)
          }
        />
      )}
    </div>
  );
}

// ============================================================
// Stat Card
// ============================================================

function StatCard({
  title,
  value,
  icon,
  iconClass,
  valueClass = "text-3xl",
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2
            className={`${valueClass} font-bold text-gray-800 mt-2`}
          >
            {value}
          </h2>
        </div>

        <div
          className={`${iconClass} p-4 rounded-xl`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Loan Details Modal
// ============================================================

function LoanDetailsModal({
  loan,
  actionLoading,
  getStatusBadge,
  getRiskBadge,
  formatCurrency,
  applicantName,
  applicantEmail,
  applicantPhone,
  onClose,
  onApprove,
  onReject,
}) {
  const riskCategory =
    loan.riskCategory ??
    loan.risk_category;

  const riskScore =
    loan.riskScore ??
    loan.risk_score;

  const approvalProbability =
    loan.approvalProbability ??
    loan.approval_probability;

  const defaultProbability =
    loan.defaultProbability ??
    loan.default_probability;

  const emi =
    loan.emi ??
    loan.monthlyEMI ??
    loan.monthly_emi;

  const debtRatio =
    loan.debtToIncomeRatio ??
    loan.debt_to_income_ratio;

  const explanation = Array.isArray(
    loan.explanation
  )
    ? loan.explanation
    : [];

  const isPending =
    loan.status?.toLowerCase() ===
    "pending";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">

        {/* Modal Header */}

        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Loan Application Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              ID: {loan.id || "N/A"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 p-2"
          >
            <FaTimes size={22} />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Status */}

          <div className="grid md:grid-cols-3 gap-4">
            <Detail
              label="Status"
              value={
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                    loan.status
                  )}`}
                >
                  {loan.status ||
                    "Pending"}
                </span>
              }
            />

            <Detail
              label="Risk Category"
              value={
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRiskBadge(
                    riskCategory
                  )}`}
                >
                  {riskCategory ||
                    "N/A"}
                </span>
              }
            />

            <Detail
              label="Risk Score"
              value={
                riskScore !== undefined &&
                riskScore !== null
                  ? `${riskScore}/100`
                  : "N/A"
              }
            />
          </div>

          {/* Applicant Information */}

          <DetailSection title="Applicant Information">
            <Detail
              label="Name"
              value={applicantName(loan)}
            />

            <Detail
              label="Email"
              value={applicantEmail(loan)}
            />

            <Detail
              label="Phone"
              value={applicantPhone(loan)}
            />

            <Detail
              label="Age"
              value={loan.age}
            />

            <Detail
              label="Gender"
              value={loan.gender}
            />

            <Detail
              label="Marital Status"
              value={loan.maritalStatus}
            />

            <Detail
              label="Education"
              value={
                loan.education ??
                loan.educationLevel
              }
            />

            <Detail
              label="Dependents"
              value={loan.dependents}
            />
          </DetailSection>

          {/* Employment */}

          <DetailSection title="Employment & Income">
            <Detail
              label="Employment Type"
              value={loan.employmentType}
            />

            <Detail
              label="Employment Years"
              value={loan.employmentYears}
            />

            <Detail
              label="Monthly Income"
              value={formatCurrency(
                loan.monthlyIncome
              )}
            />

            <Detail
              label="Annual Income"
              value={formatCurrency(
                loan.annualIncome
              )}
            />

            <Detail
              label="Monthly Expenses"
              value={formatCurrency(
                loan.monthlyExpenses
              )}
            />

            <Detail
              label="Disposable Income"
              value={formatCurrency(
                loan.disposableIncome
              )}
            />
          </DetailSection>

          {/* Loan Information */}

          <DetailSection title="Loan Information">
            <Detail
              label="Loan Amount"
              value={formatCurrency(
                loan.loanAmount
              )}
            />

            <Detail
              label="Loan Tenure"
              value={
                loan.loanTenure
                  ? `${loan.loanTenure} years`
                  : "N/A"
              }
            />

            <Detail
              label="Interest Rate"
              value={
                loan.interestRate !==
                undefined
                  ? `${loan.interestRate}%`
                  : "N/A"
              }
            />

            <Detail
              label="Loan Purpose"
              value={loan.loanPurpose}
            />

            <Detail
              label="Estimated EMI"
              value={formatCurrency(emi)}
            />

            <Detail
              label="Debt-to-Income Ratio"
              value={
                debtRatio !== undefined &&
                debtRatio !== null &&
                debtRatio !== ""
                  ? `${debtRatio}%`
                  : "N/A"
              }
            />
          </DetailSection>

          {/* Credit Information */}

          <DetailSection title="Credit Information">
            <Detail
              label="Credit Score"
              value={loan.creditScore}
            />

            <Detail
              label="Existing Loans"
              value={loan.existingLoans}
            />

            <Detail
              label="Existing EMI"
              value={formatCurrency(
                loan.existingEMI
              )}
            />

            <Detail
              label="Credit History"
              value={
                loan.lengthOfCreditHistory
              }
            />

            <Detail
              label="Previous Defaults"
              value={
                loan.previousLoanDefaults
              }
            />

            <Detail
              label="Bankruptcy History"
              value={
                loan.bankruptcyHistory
              }
            />
          </DetailSection>

          {/* AI Prediction */}

          <DetailSection title="AI Prediction">
            <Detail
              label="Approval Probability"
              value={
                approvalProbability !==
                  undefined &&
                approvalProbability !==
                  null
                  ? `${approvalProbability}%`
                  : "N/A"
              }
            />

            <Detail
              label="Default Probability"
              value={
                defaultProbability !==
                  undefined &&
                defaultProbability !==
                  null
                  ? `${defaultProbability}%`
                  : "N/A"
              }
            />

            <Detail
              label="Risk Score"
              value={
                riskScore !== undefined &&
                riskScore !== null
                  ? `${riskScore}/100`
                  : "N/A"
              }
            />
          </DetailSection>

          {/* Explainable AI */}

          {explanation.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Explainable AI
              </h3>

              <div className="space-y-3">
                {explanation.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="bg-slate-50 rounded-xl p-4"
                    >
                      <p className="font-semibold text-gray-800">
                        {item?.label ||
                          item?.feature ||
                          "AI Factor"}
                      </p>

                      <p className="text-gray-600 text-sm mt-1">
                        {item?.message ||
                          String(item)}
                      </p>

                      {item?.shap_value !==
                        undefined && (
                        <p className="text-xs text-gray-500 mt-2">
                          SHAP impact:{" "}
                          {item.shap_value}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Actions */}

          <div className="border-t pt-5 flex flex-wrap gap-3 justify-end">
            {isPending && (
              <>
                <button
                  type="button"
                  disabled={
                    actionLoading ===
                    loan.id
                  }
                  onClick={() =>
                    onApprove(loan.id)
                  }
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-5 py-3 rounded-xl font-semibold"
                >
                  {actionLoading === loan.id
                    ? "Processing..."
                    : "Approve Loan"}
                </button>

                <button
                  type="button"
                  disabled={
                    actionLoading ===
                    loan.id
                  }
                  onClick={() =>
                    onReject(loan.id)
                  }
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-5 py-3 rounded-xl font-semibold"
                >
                  {actionLoading === loan.id
                    ? "Processing..."
                    : "Reject Loan"}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-xl font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// User Details Modal
// ============================================================

function UserDetailsModal({
  user,
  loans,
  formatCurrency,
  onClose,
}) {
  const approved = loans.filter(
    (loan) =>
      loan.status?.toLowerCase() ===
      "approved"
  ).length;

  const pending = loans.filter(
    (loan) =>
      loan.status?.toLowerCase() ===
      "pending"
  ).length;

  const rejected = loans.filter(
    (loan) =>
      loan.status?.toLowerCase() ===
      "rejected"
  ).length;

  const totalAmount = loans.reduce(
    (total, loan) => {
      const amount = Number(
        loan.loanAmount
      );

      return (
        total +
        (Number.isNaN(amount)
          ? 0
          : amount)
      );
    },
    0
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">

        {/* Header */}

        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              User Details
            </h2>

            <p className="text-sm text-gray-500">
              {user.email || "N/A"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 p-2"
          >
            <FaTimes size={22} />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* User Information */}

          <div className="grid md:grid-cols-2 gap-4">
            <Detail
              label="Name"
              value={user.name}
            />

            <Detail
              label="Email"
              value={user.email}
            />

            <Detail
              label="Phone"
              value={user.phone}
            />

            <Detail
              label="Role"
              value={
                <span
                  className={
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold"
                      : "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold"
                  }
                >
                  {user.role || "user"}
                </span>
              }
            />

            <Detail
              label="User ID"
              value={user.id}
            />

            <Detail
              label="Total Applications"
              value={loans.length}
            />
          </div>

          {/* Loan Summary */}

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Loan Summary
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard
                title="Approved"
                value={approved}
                className="text-green-600"
              />

              <SummaryCard
                title="Pending"
                value={pending}
                className="text-yellow-600"
              />

              <SummaryCard
                title="Rejected"
                value={rejected}
                className="text-red-600"
              />

              <SummaryCard
                title="Total Amount"
                value={formatCurrency(
                  totalAmount
                )}
                className="text-blue-600 text-lg"
              />
            </div>
          </div>

          {/* Loan Applications */}

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Loan Applications
            </h3>

            {loans.length === 0 ? (
              <div className="bg-slate-50 rounded-xl p-6 text-center text-gray-500">
                This user has no loan
                applications.
              </div>
            ) : (
              <div className="space-y-3">
                {loans.map((loan) => {
                  const status =
                    loan.status?.toLowerCase();

                  const statusClass =
                    status === "approved"
                      ? "bg-green-100 text-green-700"
                      : status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700";

                  return (
                    <div
                      key={loan.id}
                      className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {formatCurrency(
                            loan.loanAmount
                          )}
                        </p>

                        <p className="text-sm text-gray-500">
                          {loan.loanPurpose ||
                            "Loan Application"}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}
                      >
                        {loan.status ||
                          "Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Close */}

          <div className="text-right border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Detail Section
// ============================================================

function DetailSection({
  title,
  children,
}) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {title}
      </h3>

      <div className="grid md:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}

// ============================================================
// Detail
// ============================================================

function Detail({
  label,
  value,
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-semibold text-gray-800 mt-1 break-words">
        {value === null ||
        value === undefined ||
        value === ""
          ? "N/A"
          : value}
      </p>
    </div>
  );
}

// ============================================================
// Summary Card
// ============================================================

function SummaryCard({
  title,
  value,
  className,
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p
        className={`text-2xl font-bold mt-1 ${className}`}
      >
        {value}
      </p>
    </div>
  );
}

export default Admin;