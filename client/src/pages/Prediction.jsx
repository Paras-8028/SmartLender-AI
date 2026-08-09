import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaRedo,
  FaHome,
  FaExclamationTriangle,
  FaLightbulb,
  FaCalendarAlt,
  FaFileInvoiceDollar,
} from "react-icons/fa";

function Prediction() {
  const navigate = useNavigate();

  const [prediction, setPrediction] = useState(null);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    try {
      const storedPrediction =
        sessionStorage.getItem("latestPrediction");

      const storedApplication =
        sessionStorage.getItem(
          "latestLoanApplication"
        );

      if (storedPrediction) {
        setPrediction(JSON.parse(storedPrediction));
      }

      if (storedApplication) {
        setApplication(
          JSON.parse(storedApplication)
        );
      }
    } catch (error) {
      console.error(
        "Unable to load prediction data:",
        error
      );
    }
  }, []);

  if (!prediction) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-5">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-lg">
          <FaExclamationTriangle
            className="text-yellow-500 mx-auto"
            size={50}
          />

          <h1 className="text-2xl font-bold mt-5">
            No Prediction Available
          </h1>

          <p className="text-gray-500 mt-3">
            Please submit a loan application first
            to generate an AI prediction.
          </p>

          <button
            type="button"
            onClick={() => navigate("/loan-form")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Apply for Loan
          </button>
        </div>
      </div>
    );
  }

  const status = prediction.status || "Rejected";

  const approvalProbability = Number(
    prediction.approval_probability ?? 0
  );

  const rejectionProbability = Number(
    prediction.rejection_probability ??
      100 - approvalProbability
  );

  const defaultProbability = Number(
    prediction.default_probability ?? 0
  );

  const riskScore = Number(
    prediction.risk_score ?? 0
  );

  const riskCategory =
    prediction.risk_category || "Unknown";

  const monthlyEMI = Number(
    prediction.monthly_emi ?? 0
  );

  const debtToIncomeRatio = Number(
    prediction.debt_to_income_ratio ?? 0
  );

  const isApproved =
    status.toLowerCase() === "approved";

  const monthlyIncome = Number(
    application?.monthlyIncome ?? 0
  );

  const monthlyExpenses = Number(
    application?.monthlyExpenses ?? 0
  );

  const loanAmount = Number(
    application?.loanAmount ?? 0
  );

  const interestRate = Number(
    application?.interestRate ?? 0
  );

  const loanTenure = Number(
    application?.loanTenure ?? 0
  );

  const creditScore = Number(
    application?.creditScore ?? 0
  );

  const applicationId =
    application?.id || "N/A";

  const applicationDate = application?.createdAt
    ? new Date(
        application.createdAt
      ).toLocaleString("en-IN")
    : new Date().toLocaleString("en-IN");

  const explanations = Array.isArray(
    prediction.explanation
  )
    ? prediction.explanation
    : [];

  const probabilityData = [
    {
      name: "Approval",
      value: approvalProbability,
    },
    {
      name: "Rejection",
      value: rejectionProbability,
    },
  ];

  const recommendations = [];

  if (isApproved) {
    recommendations.push(
      "The applicant satisfies the AI model's approval criteria."
    );

    if (creditScore >= 700) {
      recommendations.push(
        "Maintain the current credit repayment history."
      );
    }

    if (debtToIncomeRatio < 40) {
      recommendations.push(
        "Current debt-to-income ratio is within a healthy range."
      );
    }

    recommendations.push(
      "Continue maintaining stable income and responsible debt levels."
    );
  } else {
    recommendations.push(
      "Review the factors negatively affecting the AI prediction."
    );

    if (creditScore < 650) {
      recommendations.push(
        "Improve credit score and maintain timely repayments."
      );
    }

    if (debtToIncomeRatio > 40) {
      recommendations.push(
        "Consider reducing existing debt before applying again."
      );
    }

    recommendations.push(
      "Consider reducing the requested loan amount if financially possible."
    );
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  let riskColor = "#16a34a";

  let riskBadgeClass =
    "bg-green-100 text-green-700";

  if (riskScore >= 70) {
    riskColor = "#dc2626";
    riskBadgeClass =
      "bg-red-100 text-red-700";
  } else if (riskScore >= 40) {
    riskColor = "#f59e0b";
    riskBadgeClass =
      "bg-yellow-100 text-yellow-700";
  }

  const handleApplyAgain = () => {
    sessionStorage.removeItem(
      "latestPrediction"
    );

    sessionStorage.removeItem(
      "latestLoanApplication"
    );

    navigate("/loan-form");
  };

  const renderPieLabel = ({
    name,
    percent,
  }) => {
    if (!percent) {
      return null;
    }

    return `${name}: ${(
      percent * 100
    ).toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                AI Loan Prediction
              </h1>

              <p className="text-gray-500 mt-2">
                AI-powered decision using Random
                Forest and Explainable AI
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FaFileInvoiceDollar />

                <span>
                  Application ID:
                </span>

                <strong className="text-gray-700">
                  {applicationId}
                </strong>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <FaCalendarAlt />

                <span>
                  Prediction Date:
                </span>

                <strong className="text-gray-700">
                  {applicationDate}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Status */}

        <div
          className={`mt-8 rounded-2xl p-6 flex items-start gap-4 border-l-8 shadow-sm ${
            isApproved
              ? "bg-green-100 border-green-600"
              : "bg-red-100 border-red-600"
          }`}
        >
          {isApproved ? (
            <FaCheckCircle
              className="text-green-700 mt-1 flex-shrink-0"
              size={40}
            />
          ) : (
            <FaTimesCircle
              className="text-red-700 mt-1 flex-shrink-0"
              size={40}
            />
          )}

          <div>
            <h2
              className={`text-2xl md:text-3xl font-bold ${
                isApproved
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              Loan {status}
            </h2>

            <p className="text-gray-700 mt-2">
              {isApproved
                ? "Congratulations! Your application satisfies the AI evaluation criteria."
                : "The AI model identified factors that increase the risk associated with this loan application."}
            </p>
          </div>
        </div>

        {/* Prediction Summary */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-gray-500">
              Approval Probability
            </p>

            <h2 className="text-4xl font-bold text-blue-600 mt-3">
              {approvalProbability.toFixed(1)}%
            </h2>

            <div className="mt-4 h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-600 rounded-full"
                style={{
                  width: `${Math.min(
                    Math.max(
                      approvalProbability,
                      0
                    ),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-gray-500">
              Default Probability
            </p>

            <h2 className="text-4xl font-bold text-red-600 mt-3">
              {defaultProbability.toFixed(1)}%
            </h2>

            <div className="mt-4 h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-red-600 rounded-full"
                style={{
                  width: `${Math.min(
                    Math.max(
                      defaultProbability,
                      0
                    ),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-gray-500">
              Risk Score
            </p>

            <h2
              className="text-4xl font-bold mt-3"
              style={{
                color: riskColor,
              }}
            >
              {riskScore}/100
            </h2>

            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-3 ${riskBadgeClass}`}
            >
              {riskCategory}
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-gray-500">
              Estimated EMI
            </p>

            <h2 className="text-3xl font-bold text-purple-600 mt-3">
              {formatCurrency(monthlyEMI)}
            </h2>

            <p className="text-sm text-gray-500 mt-3">
              Monthly repayment
            </p>
          </div>
        </div>

        {/* Charts */}

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Approval Probability
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              AI model prediction distribution
            </p>

            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <PieChart>
                <Pie
                  data={probabilityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={55}
                  paddingAngle={3}
                  label={renderPieLabel}
                  labelLine
                >
                  <Cell fill="#2563eb" />
                  <Cell fill="#ef4444" />
                </Pie>

                <Tooltip
                  formatter={(value) =>
                    `${Number(value).toFixed(1)}%`
                  }
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex justify-center gap-8 mt-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600" />

                <span className="text-sm text-gray-600">
                  Approval{" "}
                  {approvalProbability.toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />

                <span className="text-sm text-gray-600">
                  Rejection{" "}
                  {rejectionProbability.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Risk Assessment
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              AI-generated customer risk score
            </p>

            <div className="w-64 max-w-full mx-auto mt-8">
              <CircularProgressbar
                value={Math.min(
                  Math.max(riskScore, 0),
                  100
                )}
                text={`${riskScore}`}
                styles={buildStyles({
                  pathColor: riskColor,
                  textColor: "#111827",
                  trailColor: "#e5e7eb",
                  textSize: "20px",
                  pathTransitionDuration: 1,
                })}
              />
            </div>

            <div className="text-center mt-6">
              <span
                className={`inline-block px-5 py-2 rounded-full font-semibold ${riskBadgeClass}`}
              >
                {riskCategory}
              </span>
            </div>
          </div>
        </div>

        {/* Financial Summary */}

        <div className="bg-white rounded-2xl shadow-sm mt-8 p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Financial Summary
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              [
                "Monthly Income",
                formatCurrency(
                  monthlyIncome
                ),
              ],
              [
                "Monthly Expenses",
                formatCurrency(
                  monthlyExpenses
                ),
              ],
              [
                "Debt To Income",
                `${debtToIncomeRatio.toFixed(
                  2
                )}%`,
              ],
              [
                "Monthly EMI",
                formatCurrency(
                  monthlyEMI
                ),
              ],
              [
                "Loan Amount",
                formatCurrency(
                  loanAmount
                ),
              ],
              [
                "Interest Rate",
                `${interestRate.toFixed(
                  2
                )}%`,
              ],
              [
                "Loan Tenure",
                `${loanTenure} years`,
              ],
              [
                "Credit Score",
                creditScore,
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="bg-slate-50 rounded-xl p-5"
              >
                <p className="text-gray-500 text-sm">
                  {label}
                </p>

                <p className="text-xl font-bold mt-2">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Explainable AI */}

        <div className="bg-white rounded-2xl shadow-sm mt-8 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-2">
            <FaLightbulb
              className="text-yellow-500"
              size={25}
            />

            <h2 className="text-2xl font-semibold text-gray-800">
              Explainable AI
            </h2>
          </div>

          <p className="text-gray-500 mb-7">
            The following factors had the strongest
            influence on the AI prediction.
          </p>

          {explanations.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-5 text-gray-500">
              No explanation data was returned by
              the AI model.
            </div>
          ) : (
            <div className="space-y-5">
              {explanations.map(
                (item, index) => {
                  const shapValue = Number(
                    item.shap_value ?? 0
                  );

                  const isPositive =
                    item.impact === "positive";

                  const magnitude = Math.min(
                    Math.abs(shapValue) * 500,
                    100
                  );

                  return (
                    <div
                      key={`${item.feature}-${index}`}
                      className={`rounded-xl border p-5 ${
                        isPositive
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {isPositive ? (
                            <FaCheckCircle
                              className="text-green-600"
                              size={22}
                            />
                          ) : (
                            <FaTimesCircle
                              className="text-red-600"
                              size={22}
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3 className="font-semibold text-gray-800">
                              {item.label ||
                                item.feature ||
                                "Feature"}
                            </h3>

                            <span
                              className={`text-sm font-semibold ${
                                isPositive
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              {isPositive
                                ? "Positive Impact"
                                : "Negative Impact"}
                            </span>
                          </div>

                          <p className="text-gray-700 mt-2">
                            {item.message}
                          </p>

                          <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>
                                SHAP Impact
                              </span>

                              <span>
                                {shapValue >= 0
                                  ? "+"
                                  : ""}
                                {shapValue.toFixed(
                                  4
                                )}
                              </span>
                            </div>

                            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                              <div
                                className={`h-2 rounded-full ${
                                  isPositive
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                                style={{
                                  width: `${magnitude}%`,
                                }}
                              />
                            </div>
                          </div>

                          {item.value !==
                            undefined &&
                            item.value !== null &&
                            item.value !== "" && (
                              <p className="text-sm text-gray-500 mt-3">
                                Observed value:{" "}
                                <strong className="text-gray-700">
                                  {item.value}
                                </strong>
                              </p>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* AI Recommendation */}

        <div className="bg-white rounded-2xl shadow-sm mt-8 p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            AI Recommendation
          </h2>

          <div className="space-y-4">
            {recommendations.map(
              (item, index) => (
                <div
                  key={index}
                  className={`flex gap-3 items-start p-4 rounded-xl ${
                    isApproved
                      ? "bg-blue-50"
                      : "bg-orange-50"
                  }`}
                >
                  {isApproved ? (
                    <FaCheckCircle className="text-blue-600 mt-1 flex-shrink-0" />
                  ) : (
                    <FaExclamationTriangle className="text-orange-500 mt-1 flex-shrink-0" />
                  )}

                  <span>{item}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Action Buttons */}

        <div className="flex flex-wrap gap-4 mt-8 pb-10">
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl flex items-center gap-2 font-semibold transition"
          >
            <FaDownload />
            Download / Print Report
          </button>

          <button
            type="button"
            onClick={handleApplyAgain}
            className="bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-xl flex items-center gap-2 font-semibold transition"
          >
            <FaRedo />
            Apply Again
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="bg-gray-700 hover:bg-gray-800 text-white px-7 py-3 rounded-xl flex items-center gap-2 font-semibold transition"
          >
            <FaHome />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Prediction;