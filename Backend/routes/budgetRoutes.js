const express = require('express');
const rateLimit = require('express-rate-limit');
const { Protect } = require('../middleware/authMiddleware');
const {
    createBudget,
    getBudgets,
    getBudget,
    updateBudget,
    deleteBudget,
    getBudgetVsActual
} = require('../controllers/budgetController');
const {
    handleValidationErrors,
    validateBudget,
    validateMongoId,
} = require('../middleware/validationMiddleware');

const router = express.Router();

// Rate limiter for budget endpoints
const budgetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200,
  message: "Too many requests to budget endpoints, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(budgetLimiter);

router.route('/')
    .post(Protect, validateBudget, handleValidationErrors, createBudget)
    .get(Protect, getBudgets);

// IMPORTANT: This specific route MUST be declared before /:id to avoid
// Express treating "report" as a Mongo ID parameter.
router.get('/report/actual-vs-budget', Protect, getBudgetVsActual);

router.route('/:id')
    .get(Protect, validateMongoId, handleValidationErrors, getBudget)
    .put(Protect, validateMongoId, validateBudget, handleValidationErrors, updateBudget)
    .delete(Protect, validateMongoId, handleValidationErrors, deleteBudget);

module.exports = router;
