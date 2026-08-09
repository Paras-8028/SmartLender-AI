import { Link } from "react-router-dom";

function Landing() {
  const token = localStorage.getItem("token");

  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-blue-600 font-semibold mb-4">
              SMARTLENDER AI
            </p>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-800">
              AI Powered
              <span className="text-blue-600">
                {" "}Loan{" "}
              </span>
              Approval Engine
            </h1>

            <p className="text-gray-600 mt-6 text-lg leading-relaxed">
              Predict loan approval instantly using
              Artificial Intelligence, calculate EMI,
              analyze financial risk, and receive
              explainable AI insights before making
              lending decisions.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={token ? "/loan-form" : "/login"}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Apply Now
              </Link>

              <Link
                to="/emi-calculator"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition font-semibold"
              >
                Calculate EMI
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700"
              alt="AI Loan Analysis"
              className="rounded-2xl shadow-xl w-full max-w-xl"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Smarter Loan Decisions
            </h2>

            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              SmartLender AI combines machine learning,
              financial analysis and explainable AI to
              help users understand loan decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-2xl p-7">
              <div className="text-3xl mb-4">
                🤖
              </div>

              <h3 className="text-xl font-semibold text-gray-800">
                AI Prediction
              </h3>

              <p className="text-gray-600 mt-3 leading-relaxed">
                Get an AI-powered prediction of loan
                approval, default probability and
                overall risk.
              </p>
            </div>

            <div className="bg-green-50 rounded-2xl p-7">
              <div className="text-3xl mb-4">
                📊
              </div>

              <h3 className="text-xl font-semibold text-gray-800">
                Risk Analysis
              </h3>

              <p className="text-gray-600 mt-3 leading-relaxed">
                Understand important financial factors
                such as income, expenses, EMI and
                debt-to-income ratio.
              </p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-7">
              <div className="text-3xl mb-4">
                💡
              </div>

              <h3 className="text-xl font-semibold text-gray-800">
                Explainable AI
              </h3>

              <p className="text-gray-600 mt-3 leading-relaxed">
                See why the model approved or rejected
                an application with understandable
                AI insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Check Your Loan Eligibility?
          </h2>

          <p className="mt-4 text-blue-100 max-w-2xl mx-auto">
            Submit your financial details and let
            SmartLender AI analyze your application.
          </p>

          <Link
            to={token ? "/loan-form" : "/signup"}
            className="inline-block mt-7 bg-white text-blue-600 px-7 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            {token
              ? "Apply for Loan"
              : "Create Account"}
          </Link>
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} SmartLender AI.
          All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Landing;