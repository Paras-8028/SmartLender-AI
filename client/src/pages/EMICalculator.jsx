import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ============================================================
  // Currency Formatter
  // ============================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value));
  };

  // ============================================================
  // Calculate EMI
  // ============================================================

  const calculateEMI = () => {
    setError("");

    const P = Number(loanAmount);
    const annualRate = Number(interestRate);
    const years = Number(tenure);

    // ----------------------------------------------------------
    // Validation
    // ----------------------------------------------------------

    if (
      !loanAmount ||
      !interestRate ||
      !tenure
    ) {
      setError(
        "Please enter all loan details."
      );
      return;
    }

    if (P <= 0) {
      setError(
        "Loan amount must be greater than ₹0."
      );
      return;
    }

    if (annualRate <= 0) {
      setError(
        "Interest rate must be greater than 0%."
      );
      return;
    }

    if (years <= 0) {
      setError(
        "Loan tenure must be greater than 0 years."
      );
      return;
    }

    if (years > 50) {
      setError(
        "Loan tenure cannot exceed 50 years."
      );
      return;
    }

    // ----------------------------------------------------------
    // EMI Calculation
    // ----------------------------------------------------------

    const monthlyRate =
      annualRate / 12 / 100;

    const numberOfPayments =
      years * 12;

    const EMI =
      (P *
        monthlyRate *
        Math.pow(
          1 + monthlyRate,
          numberOfPayments
        )) /
      (Math.pow(
        1 + monthlyRate,
        numberOfPayments
      ) - 1);

    const totalPayment =
      EMI * numberOfPayments;

    const totalInterest =
      totalPayment - P;

    // ----------------------------------------------------------
    // Amortization Schedule
    // ----------------------------------------------------------

    const schedule = [];

    let balance = P;

    for (
      let month = 1;
      month <= numberOfPayments;
      month++
    ) {
      const interest =
        balance * monthlyRate;

      const principal =
        EMI - interest;

      balance -= principal;

      if (balance < 0) {
        balance = 0;
      }

      schedule.push({
        month,
        emi: EMI.toFixed(2),
        principal:
          principal.toFixed(2),
        interest:
          interest.toFixed(2),
        balance:
          balance.toFixed(2),
      });
    }

    // ----------------------------------------------------------
    // Store Result
    // ----------------------------------------------------------

    setResult({
      emi: EMI.toFixed(2),
      totalInterest:
        totalInterest.toFixed(2),
      totalPayment:
        totalPayment.toFixed(2),
      schedule,
    });
  };

  // ============================================================
  // Reset
  // ============================================================

  const resetForm = () => {
    setLoanAmount("");
    setInterestRate("");
    setTenure("");
    setResult(null);
    setError("");
  };

  // ============================================================
  // Chart Data
  // ============================================================

  const chartData = result
    ? [
        {
          name: "Principal",
          value: Number(loanAmount),
        },
        {
          name: "Interest",
          value: Number(
            result.totalInterest
          ),
        },
      ]
    : [];

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6">

        {/* =====================================================
            Header
        ====================================================== */}

        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            EMI Calculator
          </h1>

          <p className="text-gray-500 mt-2">
            Calculate your monthly EMI, total
            interest and repayment schedule.
          </p>
        </div>

        {/* =====================================================
            Calculator + Summary
        ====================================================== */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">

          {/* ===================================================
              Loan Details
          ==================================================== */}

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Loan Details
            </h2>

            <div className="space-y-5">

              {/* Loan Amount */}

              <div>
                <label className="block font-medium text-gray-700">
                  Loan Amount (₹)
                </label>

                <input
                  type="number"
                  min="1"
                  value={loanAmount}
                  onChange={(e) =>
                    setLoanAmount(
                      e.target.value
                    )
                  }
                  placeholder="Example: 500000"
                  className="w-full border border-gray-300 rounded-lg p-3 mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Interest Rate */}

              <div>
                <label className="block font-medium text-gray-700">
                  Interest Rate (%)
                </label>

                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) =>
                    setInterestRate(
                      e.target.value
                    )
                  }
                  placeholder="Example: 10"
                  className="w-full border border-gray-300 rounded-lg p-3 mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tenure */}

              <div>
                <label className="block font-medium text-gray-700">
                  Loan Tenure (Years)
                </label>

                <input
                  type="number"
                  min="1"
                  max="50"
                  value={tenure}
                  onChange={(e) =>
                    setTenure(
                      e.target.value
                    )
                  }
                  placeholder="Example: 5"
                  className="w-full border border-gray-300 rounded-lg p-3 mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Error */}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}

              {/* Buttons */}

              <div className="flex flex-col sm:flex-row gap-4">

                <button
                  type="button"
                  onClick={calculateEMI}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                >
                  Calculate EMI
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition"
                >
                  Reset
                </button>

              </div>
            </div>
          </div>

          {/* ===================================================
              Loan Summary
          ==================================================== */}

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Loan Summary
            </h2>

            {result ? (
              <>
                {/* Summary Cards */}

                <div className="grid gap-4">

                  <div className="bg-blue-100 p-5 rounded-xl">
                    <p className="text-gray-600">
                      Monthly EMI
                    </p>

                    <h2 className="text-3xl font-bold text-blue-700 mt-1">
                      {formatCurrency(
                        result.emi
                      )}
                    </h2>
                  </div>

                  <div className="bg-green-100 p-5 rounded-xl">
                    <p className="text-gray-600">
                      Total Interest
                    </p>

                    <h2 className="text-3xl font-bold text-green-700 mt-1">
                      {formatCurrency(
                        result.totalInterest
                      )}
                    </h2>
                  </div>

                  <div className="bg-purple-100 p-5 rounded-xl">
                    <p className="text-gray-600">
                      Total Payment
                    </p>

                    <h2 className="text-3xl font-bold text-purple-700 mt-1">
                      {formatCurrency(
                        result.totalPayment
                      )}
                    </h2>
                  </div>

                </div>

                {/* Pie Chart */}

                <div className="mt-8 h-80">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={110}
                        label
                      >
                        <Cell fill="#2563eb" />
                        <Cell fill="#22c55e" />
                      </Pie>

                      <Tooltip
                        formatter={(value) =>
                          formatCurrency(value)
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}

                <div className="flex justify-center gap-6 text-sm text-gray-600">

                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600" />
                    Principal
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    Interest
                  </div>

                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-20">
                <p className="text-lg">
                  Enter loan details to
                  calculate EMI.
                </p>

                <p className="text-sm mt-2">
                  Your EMI and repayment
                  summary will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            Amortization Schedule
        ====================================================== */}

        {result && (
          <div className="bg-white rounded-2xl shadow-lg mt-8 p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Amortization Schedule
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Monthly breakdown of
                  principal, interest and
                  remaining balance.
                </p>
              </div>

              <div className="text-sm text-gray-500">
                {result.schedule.length} monthly
                payments
              </div>

            </div>

            <div className="overflow-auto max-h-[500px] border rounded-xl">

              <table className="w-full min-w-[700px]">

                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr className="text-gray-700">

                    <th className="py-3 px-4 text-left">
                      Month
                    </th>

                    <th className="py-3 px-4 text-right">
                      EMI
                    </th>

                    <th className="py-3 px-4 text-right">
                      Principal
                    </th>

                    <th className="py-3 px-4 text-right">
                      Interest
                    </th>

                    <th className="py-3 px-4 text-right">
                      Balance
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {result.schedule.map(
                    (row) => (
                      <tr
                        key={row.month}
                        className="border-b hover:bg-gray-50 text-sm"
                      >
                        <td className="py-3 px-4">
                          {row.month}
                        </td>

                        <td className="py-3 px-4 text-right">
                          {formatCurrency(
                            row.emi
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          {formatCurrency(
                            row.principal
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          {formatCurrency(
                            row.interest
                          )}
                        </td>

                        <td className="py-3 px-4 text-right font-medium">
                          {formatCurrency(
                            row.balance
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default EMICalculator;