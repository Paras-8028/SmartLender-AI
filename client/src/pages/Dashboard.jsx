import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaShieldAlt,
  FaMoneyBillWave,
  FaPlus,
  FaCalculator,
  FaRobot,
  FaSyncAlt,
  FaEye,
} from "react-icons/fa";

import api from "../services/api";
import StatCard from "../components/StatCard";

function Dashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

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
  // Fetch Applications
  // ============================================================

  const fetchApplications = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const token =
          localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get(
          "/loan/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.success) {
          setApplications(
            response.data.applications || []
          );
        } else {
          setError(
            response.data?.message ||
              "Unable to load loan applications."
          );
        }
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        if (
          err.response?.status === 401
        ) {
          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigate]
  );

  // ============================================================
  // Initial Load
  // ============================================================

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // ============================================================
  // Statistics
  // ============================================================

  const statistics = useMemo(() => {
    return {
      total: applications.length,

      approved: applications.filter(
        (loan) =>
          loan.status?.toLowerCase() ===
          "approved"
      ).length,

      rejected: applications.filter(
        (loan) =>
          loan.status?.toLowerCase() ===
          "rejected"
      ).length,

      pending: applications.filter(
        (loan) =>
          loan.status?.toLowerCase() ===
          "pending"
      ).length,
    };
  }, [applications]);

  // ============================================================
  // Latest Application
  // ============================================================

  const latestApplication = useMemo(() => {
    if (!applications.length) {
      return null;
    }

    return [...applications].sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )[0];
  }, [applications]);

  // ============================================================
  // Latest Prediction Values
  // ============================================================

  const latestRiskScore =
    latestApplication?.riskScore ??
    latestApplication?.risk_score ??
    null;

  const latestRiskCategory =
    latestApplication?.riskCategory ??
    latestApplication?.risk_category ??
    "N/A";

  const latestEMI =
    latestApplication?.emi ??
    latestApplication?.monthlyEMI ??
    latestApplication?.monthly_emi ??
    null;

  // ============================================================
  // Loan Notification
  // ============================================================

  const loanNotification = useMemo(() => {
    if (!latestApplication) {
      return null;
    }

    const status =
      latestApplication.status?.toLowerCase();

    if (status === "approved") {
      return {
        type: "approved",
        title: "Loan Approved!",
        message:
          "Congratulations! Your loan application has been approved.",
      };
    }

    if (status === "rejected") {
      return {
        type: "rejected",
        title: "Loan Application Rejected",
        message:
          "Your application was not approved based on the current lending evaluation.",
      };
    }

    return {
      type: "pending",
      title: "Loan Under Review",
      message:
        "Your loan application is currently being reviewed.",
    };
  }, [latestApplication]);

  // ============================================================
  // Approval Chart
  // ============================================================

  const approvalData = [
    {
      name: "Approved",
      value: statistics.approved,
    },
    {
      name: "Rejected",
      value: statistics.rejected,
    },
    {
      name: "Pending",
      value: statistics.pending,
    },
  ];

  const approvalColors = [
    "#16a34a",
    "#ef4444",
    "#f59e0b",
  ];

  // ============================================================
  // Risk Chart
  // ============================================================

  const riskData = [
    {
      category: "Low Risk",
      count: applications.filter(
        (loan) =>
          (
            loan.riskCategory ??
            loan.risk_category
          ) === "Low Risk"
      ).length,
    },

    {
      category: "Medium Risk",
      count: applications.filter(
        (loan) =>
          (
            loan.riskCategory ??
            loan.risk_category
          ) === "Medium Risk"
      ).length,
    },

    {
      category: "High Risk",
      count: applications.filter(
        (loan) =>
          (
            loan.riskCategory ??
            loan.risk_category
          ) === "High Risk"
      ).length,
    },
  ];

  // ============================================================
  // Status Badge
  // ============================================================

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ============================================================
  // Status Icon
  // ============================================================

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <FaCheckCircle />;

      case "rejected":
        return <FaTimesCircle />;

      default:
        return <FaClock />;
    }
  };

  // ============================================================
  // Status Text Color
  // ============================================================

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-green-600";

      case "rejected":
        return "text-red-600";

      default:
        return "text-yellow-600";
    }
  };

  // ============================================================
  // Risk Badge
  // ============================================================

  const getRiskClass = (risk) => {
    switch (risk) {
      case "Low Risk":
        return "bg-green-100 text-green-700";

      case "Medium Risk":
        return "bg-yellow-100 text-yellow-700";

      case "High Risk":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ============================================================
  // Open Prediction
  // ============================================================

  const openPrediction = (loan) => {
    const riskScore =
      loan.riskScore ??
      loan.risk_score;

    if (
      riskScore === undefined ||
      riskScore === null
    ) {
      return;
    }

    const prediction = {
      status:
        loan.status || "Pending",

      approval_probability:
        loan.approvalProbability ??
        loan.approval_probability ??
        0,

      rejection_probability:
        loan.rejectionProbability ??
        loan.rejection_probability ??
        0,

      default_probability:
        loan.defaultProbability ??
        loan.default_probability ??
        0,

      risk_score: riskScore,

      risk_category:
        loan.riskCategory ??
        loan.risk_category ??
        "N/A",

      monthly_emi:
        loan.emi ??
        loan.monthlyEMI ??
        loan.monthly_emi ??
        0,

      debt_to_income_ratio:
        loan.debtToIncomeRatio ??
        loan.debt_to_income_ratio ??
        0,

      explanation:
        loan.explanation || [],
    };

    sessionStorage.setItem(
      "latestPrediction",
      JSON.stringify(prediction)
    );

    sessionStorage.setItem(
      "latestLoanApplication",
      JSON.stringify(loan)
    );

    navigate("/prediction");
  };

  // ============================================================
  // Loading
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <FaSyncAlt
            className="animate-spin text-blue-600 mx-auto"
            size={38}
          />

          <p className="mt-4 text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // Dashboard UI
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6">

        {/* =====================================================
            Header
        ====================================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Welcome Back 👋
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your loan applications
              and AI-powered financial insights.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              fetchApplications(true)
            }
            disabled={refreshing}
            className="flex items-center justify-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-xl hover:bg-gray-50 disabled:opacity-60 transition"
          >
            <FaSyncAlt
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {/* =====================================================
            Error
        ====================================================== */}

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center justify-between gap-4">
            <span>{error}</span>

            <button
              type="button"
              onClick={() =>
                fetchApplications(true)
              }
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* =====================================================
            Loan Notification
        ====================================================== */}

        {loanNotification && (
          <div
            className={`mt-8 rounded-2xl border p-5 ${
              loanNotification.type ===
              "approved"
                ? "bg-green-50 border-green-200"
                : loanNotification.type ===
                  "rejected"
                ? "bg-red-50 border-red-200"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <div className="flex items-start gap-4">

              <div
                className={`p-3 rounded-xl ${
                  loanNotification.type ===
                  "approved"
                    ? "bg-green-100 text-green-600"
                    : loanNotification.type ===
                      "rejected"
                    ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {loanNotification.type ===
                  "approved" && (
                  <FaCheckCircle size={24} />
                )}

                {loanNotification.type ===
                  "rejected" && (
                  <FaTimesCircle size={24} />
                )}

                {loanNotification.type ===
                  "pending" && (
                  <FaClock size={24} />
                )}
              </div>

              <div>
                <h2
                  className={`text-lg font-bold ${
                    loanNotification.type ===
                    "approved"
                      ? "text-green-700"
                      : loanNotification.type ===
                        "rejected"
                      ? "text-red-700"
                      : "text-yellow-700"
                  }`}
                >
                  {loanNotification.title}
                </h2>

                <p className="text-gray-600 mt-1">
                  {loanNotification.message}
                </p>

                {latestApplication?.loanAmount && (
                  <p className="text-sm text-gray-500 mt-2">
                    Loan Amount:{" "}
                    <strong>
                      {formatCurrency(
                        latestApplication.loanAmount
                      )}
                    </strong>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            Main Statistics
        ====================================================== */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

          <StatCard
            title="Loan Applications"
            value={statistics.total}
            icon={
              <FaFileInvoiceDollar size={24} />
            }
            color="bg-blue-600"
          />

          <StatCard
            title="Approved Loans"
            value={statistics.approved}
            icon={
              <FaCheckCircle size={24} />
            }
            color="bg-green-600"
          />

          <StatCard
            title="Rejected Loans"
            value={statistics.rejected}
            icon={
              <FaTimesCircle size={24} />
            }
            color="bg-red-600"
          />

          <StatCard
            title="Pending Loans"
            value={statistics.pending}
            icon={<FaClock size={24} />}
            color="bg-yellow-500"
          />

        </div>

        {/* =====================================================
            Latest AI Information
        ====================================================== */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

          {/* Risk Score */}

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3">

              <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                <FaShieldAlt />
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Latest Risk Score
                </p>

                <h2 className="text-3xl font-bold text-gray-800">
                  {latestRiskScore !== null
                    ? `${latestRiskScore}/100`
                    : "N/A"}
                </h2>
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-4">
              Risk Category:{" "}

              <span
                className={`font-semibold px-2 py-1 rounded ${getRiskClass(
                  latestRiskCategory
                )}`}
              >
                {latestRiskCategory}
              </span>
            </p>
          </div>

          {/* EMI */}

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3">

              <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                <FaMoneyBillWave />
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Latest Monthly EMI
                </p>

                <h2 className="text-2xl font-bold text-gray-800">
                  {formatCurrency(
                    latestEMI
                  )}
                </h2>
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-4">
              Based on your latest AI prediction.
            </p>
          </div>

          {/* Latest Decision */}

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3">

              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                <FaRobot />
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Latest Loan Decision
                </p>

                <h2
                  className={`text-2xl font-bold ${getStatusClass(
                    latestApplication?.status
                  )}`}
                >
                  {latestApplication?.status ||
                    "N/A"}
                </h2>
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-4">
              Powered by Random Forest + SHAP.
            </p>
          </div>

        </div>

        {/* =====================================================
            Charts
        ====================================================== */}

        <div className="grid lg:grid-cols-2 gap-8 mt-8">

          {/* Approval Chart */}

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Loan Application Overview
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Current status of your applications.
            </p>

            {statistics.total === 0 ? (
              <div className="h-72 flex items-center justify-center text-gray-400">
                No loan applications yet.
              </div>
            ) : (
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
                    outerRadius={110}
                    innerRadius={55}
                    paddingAngle={3}
                    label
                  >
                    {approvalData.map(
                      (entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={
                            approvalColors[
                              index
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Risk Chart */}

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Risk Distribution
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              AI risk categories across your
              applications.
            </p>

            {statistics.total === 0 ? (
              <div className="h-72 flex items-center justify-center text-gray-400">
                No prediction data yet.
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <BarChart data={riskData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis dataKey="category" />

                  <YAxis
                    allowDecimals={false}
                  />

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
            )}
          </div>

        </div>

        {/* =====================================================
            Recent Applications
        ====================================================== */}

        <div className="bg-white rounded-2xl shadow-sm mt-8 p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Recent Loan Applications
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Your latest applications and AI
                decisions.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/loan-form")
              }
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
            >
              <FaPlus />
              Apply New Loan
            </button>

          </div>

          {applications.length === 0 ? (
            <div className="text-center py-16">

              <FaFileInvoiceDollar
                className="text-gray-300 mx-auto"
                size={50}
              />

              <h3 className="text-xl font-semibold mt-5">
                No Loan Applications
              </h3>

              <p className="text-gray-500 mt-2">
                Start your first loan application.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/loan-form")
                }
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
              >
                Apply Loan
              </button>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="border-b text-gray-500 text-sm">

                    <th className="text-left py-4 px-2">
                      Loan ID
                    </th>

                    <th className="text-left py-4 px-2">
                      Amount
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
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {[...applications]
                    .sort(
                      (a, b) =>
                        new Date(
                          b.createdAt || 0
                        ) -
                        new Date(
                          a.createdAt || 0
                        )
                    )
                    .slice(0, 10)
                    .map((loan) => {

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

                      const hasPrediction =
                        riskScore !==
                          undefined &&
                        riskScore !== null;

                      return (
                        <tr
                          key={loan.id}
                          className="border-b hover:bg-slate-50 transition"
                        >

                          <td className="py-4 px-2">
                            <span className="font-mono text-sm">
                              {loan.id
                                ? loan.id.slice(
                                    0,
                                    8
                                  )
                                : "N/A"}
                            </span>
                          </td>

                          <td className="py-4 px-2 font-semibold">
                            {formatCurrency(
                              loan.loanAmount
                            )}
                          </td>

                          <td className="py-4 px-2">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                                loan.status
                              )}`}
                            >
                              {getStatusIcon(
                                loan.status
                              )}

                              {loan.status ||
                                "Pending"}
                            </span>
                          </td>

                          <td className="py-4 px-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskClass(
                                riskCategory
                              )}`}
                            >
                              {riskCategory ||
                                "N/A"}
                            </span>
                          </td>

                          <td className="py-4 px-2 font-semibold">
                            {hasPrediction
                              ? `${riskScore}/100`
                              : "N/A"}
                          </td>

                          <td className="py-4 px-2">
                            {formatCurrency(
                              emi
                            )}
                          </td>

                          <td className="py-4 px-2">
                            {hasPrediction ? (
                              <button
                                type="button"
                                onClick={() =>
                                  openPrediction(
                                    loan
                                  )
                                }
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                              >
                                <FaEye />
                                View
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                Pending Review
                              </span>
                            )}
                          </td>

                        </tr>
                      );
                    })}
                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* =====================================================
            Quick Actions
        ====================================================== */}

        <div className="mt-8">

          <h2 className="text-2xl font-semibold text-gray-800 mb-5">
            Quick Actions
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

            <button
              type="button"
              onClick={() =>
                navigate("/loan-form")
              }
              className="bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-xl flex items-center justify-center gap-3 font-semibold transition"
            >
              <FaPlus />
              Apply Loan
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/emi-calculator")
              }
              className="bg-green-600 hover:bg-green-700 text-white p-5 rounded-xl flex items-center justify-center gap-3 font-semibold transition"
            >
              <FaCalculator />
              EMI Calculator
            </button>

            <button
              type="button"
              onClick={() => {
                if (latestApplication) {
                  openPrediction(
                    latestApplication
                  );
                } else {
                  navigate("/loan-form");
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white p-5 rounded-xl flex items-center justify-center gap-3 font-semibold transition"
            >
              <FaRobot />
              AI Prediction
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;