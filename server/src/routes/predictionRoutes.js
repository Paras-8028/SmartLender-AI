import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { predictLoan } from "../controllers/predictionController.js";

const router = express.Router();

router.post("/", verifyToken, predictLoan);

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Prediction Route Working",
  });
});

export default router;