import express from "express";
import {
  verifyToken,
  verifyAdmin,
} from "../middleware/authMiddleware.js";
import {
  getAdminDashboard,
  getAllUsers,
  getAllLoans,
  approveLoan,
  rejectLoan,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(verifyToken);
router.use(verifyAdmin);

router.get("/dashboard", getAdminDashboard);
router.get("/users", getAllUsers);
router.get("/loans", getAllLoans);
router.patch("/loans/:id/approve", approveLoan);
router.patch("/loans/:id/reject", rejectLoan);

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Admin API is working",
    admin: req.user,
  });
});

export default router;