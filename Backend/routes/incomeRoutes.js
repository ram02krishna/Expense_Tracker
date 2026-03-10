const express = require("express");
const rateLimit = require("express-rate-limit");
const { Protect } = require("../middleware/authMiddleware");
const {
  addIncome,
  getAllIncome,
  deleteIncome,
  updateIncome,
  downloadIncomeExcel,
} = require("../controllers/incomeController");
const {
  handleValidationErrors,
  validateIncome,
  validateMongoId,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Rate limiter for income endpoints
const incomeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Relaxed for personal use — 30 was too low, hit instantly with pagination + search
  message: "Too many requests to income endpoints, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to all routes
router.use(incomeLimiter);

// Route to add a new income
// This is a protected route
router.post("/", Protect, validateIncome, handleValidationErrors, addIncome);

// Route to get all incomes for the user
// This is a protected route
router.get("/", Protect, getAllIncome);

// Route to update an existing income
// This is a protected route
router.put("/:id", Protect, validateMongoId, validateIncome, handleValidationErrors, updateIncome);

// Route to delete an income
// This is a protected route
router.delete("/:id", Protect, validateMongoId, handleValidationErrors, deleteIncome);

// Route to download all incomes as an Excel file
// This is a protected route
router.get("/download-excel", Protect, downloadIncomeExcel);

module.exports = router;