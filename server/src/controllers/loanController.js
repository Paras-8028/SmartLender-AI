import { v4 as uuidv4 } from "uuid";
import {
  readJSON,
  writeJSON,
} from "../utils/fileHandler.js";

const APPLICATION_FILE =
  "./src/data/applications.json";

export const applyLoan = async (req, res) => {
  try {
    const loanData = req.body;

    const requiredFields = [
      "age",
      "monthlyIncome",
      "monthlyExpenses",
      "employmentYears",
      "creditScore",
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
          "Required loan fields are missing.",
        missingFields,
      });
    }

    const monthlyIncome =
      Number(loanData.monthlyIncome);

    const monthlyExpenses =
      Number(loanData.monthlyExpenses);

    const loanAmount =
      Number(loanData.loanAmount);

    const monthlyEMI =
      Number(loanData.existingEMI || 0);

    const age = Number(loanData.age);
    const employmentYears =
      Number(loanData.employmentYears);
    const creditScore =
      Number(loanData.creditScore);
    const loanTenure =
      Number(loanData.loanTenure);
    const interestRate =
      Number(loanData.interestRate);

    if (
      !Number.isFinite(monthlyIncome) ||
      monthlyIncome <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Monthly income must be greater than zero.",
      });
    }

    if (
      !Number.isFinite(monthlyExpenses) ||
      monthlyExpenses < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Monthly expenses cannot be negative.",
      });
    }

    if (
      !Number.isFinite(loanAmount) ||
      loanAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Loan amount must be greater than zero.",
      });
    }

    if (
      !Number.isFinite(age) ||
      age < 18
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Applicant must be at least 18 years old.",
      });
    }

    if (
      !Number.isFinite(creditScore) ||
      creditScore < 300 ||
      creditScore > 900
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Credit score must be between 300 and 900.",
      });
    }

    if (
      !Number.isFinite(employmentYears) ||
      employmentYears < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Employment years cannot be negative.",
      });
    }

    if (
      !Number.isFinite(loanTenure) ||
      loanTenure <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Loan tenure must be greater than zero.",
      });
    }

    if (
      !Number.isFinite(interestRate) ||
      interestRate < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Interest rate cannot be negative.",
      });
    }

    const applications =
      await readJSON(APPLICATION_FILE);

    const disposableIncome =
      monthlyIncome - monthlyExpenses;

    const annualIncome =
      monthlyIncome * 12;

    const loanToIncome =
      annualIncome > 0
        ? (loanAmount / annualIncome) * 100
        : 0;

    const debtToIncome =
      monthlyIncome > 0
        ? ((monthlyExpenses + monthlyEMI) /
            monthlyIncome) *
          100
        : 0;

    const newApplication = {
      id: uuidv4(),
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      ...loanData,
      age,
      monthlyIncome,
      monthlyExpenses,
      employmentYears,
      creditScore,
      existingEMI: monthlyEMI,
      loanAmount,
      loanTenure,
      interestRate,
      annualIncome,
      disposableIncome,
      loanToIncome: Number(
        loanToIncome.toFixed(2)
      ),
      debtToIncomeRatio: Number(
        debtToIncome.toFixed(2)
      ),
      status: "Pending",
      approvalProbability: null,
      rejectionProbability: null,
      defaultProbability: null,
      riskScore: null,
      riskCategory: null,
      emi: null,
      explanation: [],
      predictionUpdatedAt: null,
    };

    applications.push(newApplication);

    await writeJSON(
      APPLICATION_FILE,
      applications
    );

    return res.status(201).json({
      success: true,
      message:
        "Loan application submitted successfully",
      application: newApplication,
    });
  } catch (error) {
    console.error(
      "Apply Loan Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit loan application",
      error: error.message,
    });
  }
};

export const loanHistory = async (req, res) => {
  try {
    const applications =
      await readJSON(APPLICATION_FILE);

    const userLoans =
      applications.filter(
        (loan) =>
          loan.userId === req.user.id
      );

    return res.json({
      success: true,
      count: userLoans.length,
      applications: userLoans,
    });
  } catch (error) {
    console.error(
      "Loan History Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch loan history",
      error: error.message,
    });
  }
};

export const getLoanById = async (req, res) => {
  try {
    const applications =
      await readJSON(APPLICATION_FILE);

    const loan =
      applications.find(
        (item) =>
          item.id === req.params.id
      );

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found",
      });
    }

    if (
      loan.userId !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view this loan",
      });
    }

    return res.json({
      success: true,
      application: loan,
    });
  } catch (error) {
    console.error(
      "Get Loan Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch loan application",
      error: error.message,
    });
  }
};