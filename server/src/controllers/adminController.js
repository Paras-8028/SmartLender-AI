import {
  readJSON,
  writeJSON,
} from "../utils/fileHandler.js";

const USERS_FILE = "./src/data/users.json";
const APPLICATION_FILE =
  "./src/data/applications.json";

export const getAdminDashboard = async (req, res) => {
  try {
    const users = await readJSON(USERS_FILE);
    const applications =
      await readJSON(APPLICATION_FILE);

    const totalApplications =
      applications.length;

    const approved = applications.filter(
      (loan) =>
        loan.status?.toLowerCase() ===
        "approved"
    ).length;

    const rejected = applications.filter(
      (loan) =>
        loan.status?.toLowerCase() ===
        "rejected"
    ).length;

    const pending = applications.filter(
      (loan) =>
        loan.status?.toLowerCase() ===
        "pending"
    ).length;

    const totalLoanAmount =
      applications.reduce(
        (total, loan) =>
          total + Number(loan.loanAmount || 0),
        0
      );

    const lowRisk = applications.filter(
      (loan) =>
        loan.riskCategory === "Low Risk"
    ).length;

    const mediumRisk = applications.filter(
      (loan) =>
        loan.riskCategory === "Medium Risk"
    ).length;

    const highRisk = applications.filter(
      (loan) =>
        loan.riskCategory === "High Risk"
    ).length;

    const applicationsWithRisk =
      applications.filter(
        (loan) =>
          loan.riskScore !== undefined &&
          loan.riskScore !== null
      );

    const averageRiskScore =
      applicationsWithRisk.length > 0
        ? applicationsWithRisk.reduce(
            (total, loan) =>
              total + Number(loan.riskScore),
            0
          ) / applicationsWithRisk.length
        : 0;

    return res.json({
      success: true,
      statistics: {
        totalUsers: users.length,
        totalApplications,
        approved,
        rejected,
        pending,
        totalLoanAmount,
        lowRisk,
        mediumRisk,
        highRisk,
        averageRiskScore: Number(
          averageRiskScore.toFixed(2)
        ),
      },
    });
  } catch (error) {
    console.error(
      "Admin Dashboard Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load admin dashboard",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await readJSON(USERS_FILE);

    const safeUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || "user",
    }));

    return res.json({
      success: true,
      count: safeUsers.length,
      users: safeUsers,
    });
  } catch (error) {
    console.error(
      "Get Users Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load users",
      error: error.message,
    });
  }
};

export const getAllLoans = async (req, res) => {
  try {
    const users = await readJSON(USERS_FILE);
    const applications =
      await readJSON(APPLICATION_FILE);

    const loans = applications.map((loan) => {
      const user = users.find(
        (user) => user.id === loan.userId
      );

      return {
        ...loan,
        applicant: {
          id: user?.id || null,
          name: user?.name || "Unknown User",
          email: user?.email || "N/A",
        },
      };
    });

    loans.reverse();

    return res.json({
      success: true,
      count: loans.length,
      applications: loans,
    });
  } catch (error) {
    console.error(
      "Get Loans Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load loan applications",
      error: error.message,
    });
  }
};

export const approveLoan = async (req, res) => {
  try {
    const applications =
      await readJSON(APPLICATION_FILE);

    const loanIndex =
      applications.findIndex(
        (loan) =>
          loan.id === req.params.id
      );

    if (loanIndex === -1) {
      return res.status(404).json({
        success: false,
        message:
          "Loan application not found",
      });
    }

    const loan = applications[loanIndex];

    if (
      loan.status?.toLowerCase() ===
      "approved"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Loan is already approved",
      });
    }

    if (
      loan.status?.toLowerCase() ===
      "rejected"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rejected loan cannot be approved.",
      });
    }

    applications[loanIndex] = {
      ...loan,
      status: "Approved",
      reviewedAt: new Date().toISOString(),
      reviewedBy: req.user.id,
    };

    await writeJSON(
      APPLICATION_FILE,
      applications
    );

    return res.json({
      success: true,
      message:
        "Loan approved successfully",
      application:
        applications[loanIndex],
    });
  } catch (error) {
    console.error(
      "Approve Loan Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to approve loan",
      error: error.message,
    });
  }
};

export const rejectLoan = async (req, res) => {
  try {
    const applications =
      await readJSON(APPLICATION_FILE);

    const loanIndex =
      applications.findIndex(
        (loan) =>
          loan.id === req.params.id
      );

    if (loanIndex === -1) {
      return res.status(404).json({
        success: false,
        message:
          "Loan application not found",
      });
    }

    const loan = applications[loanIndex];

    if (
      loan.status?.toLowerCase() ===
      "rejected"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Loan is already rejected",
      });
    }

    if (
      loan.status?.toLowerCase() ===
      "approved"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Approved loan cannot be rejected.",
      });
    }

    applications[loanIndex] = {
      ...loan,
      status: "Rejected",
      reviewedAt: new Date().toISOString(),
      reviewedBy: req.user.id,
    };

    await writeJSON(
      APPLICATION_FILE,
      applications
    );

    return res.json({
      success: true,
      message:
        "Loan rejected successfully",
      application:
        applications[loanIndex],
    });
  } catch (error) {
    console.error(
      "Reject Loan Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to reject loan",
      error: error.message,
    });
  }
};