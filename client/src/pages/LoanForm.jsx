import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function LoanForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    education: "",
    maritalStatus: "",
    dependents: "",
    monthlyIncome: "",
    monthlyExpenses: "",
    employmentType: "",
    employmentYears: "",
    creditScore: "",
    existingLoans: "",
    existingEMI: "",
    loanAmount: "",
    loanTenure: "",
    interestRate: "",
    loanPurpose: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login before applying for a loan.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const loanData = {
        age: Number(formData.age),
        gender: formData.gender,
        education: formData.education,
        maritalStatus: formData.maritalStatus,
        dependents: Number(formData.dependents || 0),
        monthlyIncome: Number(formData.monthlyIncome),
        monthlyExpenses: Number(formData.monthlyExpenses),
        employmentType: formData.employmentType,
        employmentYears: Number(formData.employmentYears),
        creditScore: Number(formData.creditScore),
        existingLoans: Number(formData.existingLoans || 0),
        existingEMI: Number(formData.existingEMI || 0),
        loanAmount: Number(formData.loanAmount),
        loanTenure: Number(formData.loanTenure),
        interestRate: Number(formData.interestRate),
        loanPurpose: formData.loanPurpose,
      };

      const applicationResponse = await api.post(
        "/loan/apply",
        loanData
      );

      if (!applicationResponse.data?.success) {
        throw new Error(
          applicationResponse.data?.message ||
            "Loan application failed."
        );
      }

      const application =
        applicationResponse.data.application;

      if (!application?.id) {
        throw new Error(
          "Loan application ID was not returned by the server."
        );
      }

      const predictionResponse = await api.post(
        "/predict",
        {
          ...loanData,
          applicationId: application.id,
        }
      );

      if (!predictionResponse.data?.success) {
        throw new Error(
          predictionResponse.data?.message ||
            "AI prediction failed."
        );
      }

      const prediction =
        predictionResponse.data.prediction;

      const updatedApplication = {
        ...application,
        ...predictionResponse.data.application,
        ...prediction,
      };

      sessionStorage.setItem(
        "latestPrediction",
        JSON.stringify(prediction)
      );

      sessionStorage.setItem(
        "latestLoanApplication",
        JSON.stringify(updatedApplication)
      );

      navigate("/prediction");
    } catch (error) {
      console.error(
        "Loan submission error:",
        error
      );

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Loan application failed.";

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg p-3 mt-2 " +
    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " +
    "outline-none transition";

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-5xl mx-auto py-10 px-5">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-800">
              Loan Application
            </h1>

            <p className="text-gray-500 mt-2">
              Fill in your details to receive an AI-powered
              loan approval prediction.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-10"
          >
            <section>
              <h2 className="text-2xl font-semibold text-blue-600 mb-6">
                Personal Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  id="age"
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  min="18"
                  max="80"
                  required
                  placeholder="Enter your age"
                  inputClass={inputClass}
                />

                <FormSelect
                  id="gender"
                  label="Gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  inputClass={inputClass}
                  options={[
                    ["", "Select Gender"],
                    ["Male", "Male"],
                    ["Female", "Female"],
                    ["Other", "Other"],
                  ]}
                />

                <FormSelect
                  id="education"
                  label="Education"
                  value={formData.education}
                  onChange={handleChange}
                  required
                  inputClass={inputClass}
                  options={[
                    ["", "Select Education"],
                    ["Graduate", "Graduate"],
                    ["Post Graduate", "Post Graduate"],
                    ["Diploma", "Diploma"],
                    ["High School", "High School"],
                  ]}
                />

                <FormSelect
                  id="maritalStatus"
                  label="Marital Status"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  required
                  inputClass={inputClass}
                  options={[
                    ["", "Select Status"],
                    ["Single", "Single"],
                    ["Married", "Married"],
                  ]}
                />

                <FormInput
                  id="dependents"
                  label="Dependents"
                  type="number"
                  value={formData.dependents}
                  onChange={handleChange}
                  min="0"
                  placeholder="Number of dependents"
                  inputClass={inputClass}
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-600 mb-6">
                Financial Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  id="monthlyIncome"
                  label="Monthly Income (₹)"
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  min="1"
                  required
                  placeholder="Enter monthly income"
                  inputClass={inputClass}
                />

                <FormInput
                  id="monthlyExpenses"
                  label="Monthly Expenses (₹)"
                  type="number"
                  value={formData.monthlyExpenses}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="Enter monthly expenses"
                  inputClass={inputClass}
                />

                <FormSelect
                  id="employmentType"
                  label="Employment Type"
                  value={formData.employmentType}
                  onChange={handleChange}
                  required
                  inputClass={inputClass}
                  options={[
                    ["", "Select Employment Type"],
                    ["Salaried", "Salaried"],
                    ["Self Employed", "Self Employed"],
                    ["Business", "Business"],
                    ["Freelancer", "Freelancer"],
                  ]}
                />

                <FormInput
                  id="employmentYears"
                  label="Employment Years"
                  type="number"
                  value={formData.employmentYears}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="Years of employment"
                  inputClass={inputClass}
                />

                <FormInput
                  id="creditScore"
                  label="Credit Score"
                  type="number"
                  value={formData.creditScore}
                  onChange={handleChange}
                  min="300"
                  max="900"
                  required
                  placeholder="300 - 900"
                  inputClass={inputClass}
                />

                <FormInput
                  id="existingLoans"
                  label="Existing Loans"
                  type="number"
                  value={formData.existingLoans}
                  onChange={handleChange}
                  min="0"
                  placeholder="Number of existing loans"
                  inputClass={inputClass}
                />

                <FormInput
                  id="existingEMI"
                  label="Existing EMI (₹)"
                  type="number"
                  value={formData.existingEMI}
                  onChange={handleChange}
                  min="0"
                  placeholder="Existing monthly EMI"
                  inputClass={inputClass}
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-600 mb-6">
                Loan Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  id="loanAmount"
                  label="Loan Amount (₹)"
                  type="number"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  min="1"
                  required
                  placeholder="Requested loan amount"
                  inputClass={inputClass}
                />

                <FormInput
                  id="loanTenure"
                  label="Loan Tenure (Years)"
                  type="number"
                  value={formData.loanTenure}
                  onChange={handleChange}
                  min="1"
                  required
                  placeholder="Loan duration"
                  inputClass={inputClass}
                />

                <FormInput
                  id="interestRate"
                  label="Interest Rate (%)"
                  type="number"
                  value={formData.interestRate}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                  placeholder="Interest rate"
                  inputClass={inputClass}
                />

                <FormSelect
                  id="loanPurpose"
                  label="Loan Purpose"
                  value={formData.loanPurpose}
                  onChange={handleChange}
                  required
                  inputClass={inputClass}
                  options={[
                    ["", "Select Loan Purpose"],
                    ["Home Loan", "Home Loan"],
                    ["Car Loan", "Car Loan"],
                    ["Education Loan", "Education Loan"],
                    ["Business Loan", "Business Loan"],
                    ["Personal Loan", "Personal Loan"],
                  ]}
                />
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl text-lg font-semibold text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading
                ? "Analyzing Your Application..."
                : "Predict Loan Approval"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormInput({
  id,
  label,
  type,
  value,
  onChange,
  inputClass,
  ...props
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-medium text-gray-700"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        name={id}
        value={value}
        onChange={onChange}
        className={inputClass}
        {...props}
      />
    </div>
  );
}

function FormSelect({
  id,
  label,
  value,
  onChange,
  inputClass,
  options,
  ...props
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-medium text-gray-700"
      >
        {label}
      </label>

      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={inputClass}
        {...props}
      >
        {options.map(
          ([optionValue, optionLabel]) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
            </option>
          )
        )}
      </select>
    </div>
  );
}

export default LoanForm;