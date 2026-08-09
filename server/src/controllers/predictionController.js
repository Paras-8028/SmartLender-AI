import axios from "axios";
import {
  readJSON,
  writeJSON,
} from "../utils/fileHandler.js";

const ML_API_URL =
  process.env.ML_API_URL || "http://127.0.0.1:5001";

const APPLICATION_FILE =
  "./src/data/applications.json";

export const predictLoan = async (req, res) => {
  try {
    const {
      applicationId,
      ...loanData
    } = req.body;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message:
          "Application ID is required for prediction.",
      });
    }

    const requiredFields = [
      "age",
      "monthlyIncome",
      "loanAmount",
      "loanTenure",
      "interestRate",
    ];

    const missingFields =
      requiredFields.filter(
        (field) =>
          loanData[field] === undefined ||
          loanData[field] === null ||
          loanData[field] === ""
      );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Required prediction fields are missing.",
        missingFields,
      });
    }

    const applications =
      await readJSON(APPLICATION_FILE);

    const applicationIndex =
      applications.findIndex(
        (loan) =>
          loan.id === applicationId &&
          loan.userId === req.user.id
      );

    if (applicationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Loan application not found.",
      });
    }

    const response = await axios.post(
      `${ML_API_URL}/predict`,
      loanData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const mlResult = response.data;

    const prediction =
      mlResult.prediction || mlResult;

    const currentApplication =
      applications[applicationIndex];

    const updatedApplication = {
      ...currentApplication,
      status:
        prediction.status || "Pending",
      approvalProbability:
        prediction.approval_probability ?? null,
      rejectionProbability:
        prediction.rejection_probability ?? null,
      defaultProbability:
        prediction.default_probability ?? null,
      riskScore:
        prediction.risk_score ?? null,
      riskCategory:
        prediction.risk_category ?? null,
      emi:
        prediction.monthly_emi ?? null,
      debtToIncomeRatio:
        prediction.debt_to_income_ratio ??
        currentApplication.debtToIncomeRatio,
      explanation:
        prediction.explanation || [],
      predictionUpdatedAt:
        new Date().toISOString(),
    };

    applications[applicationIndex] =
      updatedApplication;

    await writeJSON(
      APPLICATION_FILE,
      applications
    );

    return res.status(200).json({
      success: true,
      message:
        "AI prediction generated successfully.",
      prediction,
      application: updatedApplication,
    });
  } catch (error) {
    console.error(
      "Prediction API Error:",
      error.message
    );

    if (error.response) {
      return res.status(
        error.response.status || 500
      ).json({
        success: false,
        message:
          error.response.data?.message ||
          "ML prediction failed.",
        details:
          error.response.data,
      });
    }

    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        message:
          "AI prediction service is unavailable. Please start the Flask ML server.",
      });
    }

    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,
        message:
          "AI prediction service timed out.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate loan prediction.",
      error: error.message,
    });
  }
};