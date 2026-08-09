import express from "express";
import {
  applyLoan,
  loanHistory,
  getLoanById,
} from "../controllers/loanController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", verifyToken, applyLoan);
router.get("/history", verifyToken, loanHistory);
router.get("/:id", verifyToken, getLoanById);

export default router;