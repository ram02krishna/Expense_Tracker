const Budget = require('../models/Budget');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const mongoose = require('mongoose');
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { validateObjectId } = require("../utils/queryValidator");

exports.createBudget = asyncHandler(async (req, res, next) => {
    const { category, amount, startDate, endDate, isRecurring, recurrenceType } = req.body;

    // Calculate total income
    const incomeAggregation = await Income.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalIncome = incomeAggregation.length > 0 ? incomeAggregation[0].total : 0;

    // Calculate total existing budgets
    const budgetAggregation = await Budget.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalBudgets = budgetAggregation.length > 0 ? budgetAggregation[0].total : 0;

    if (totalBudgets + amount > totalIncome) {
        return next(new AppError(`Total budget (${totalBudgets + amount}) cannot exceed total income (${totalIncome})`, 400));
    }

    const newBudget = await Budget.create({
        user: req.user.id,
        category,
        amount,
        startDate,
        endDate,
        isRecurring: isRecurring || false,
        recurrenceType: isRecurring ? recurrenceType : null
    });

    res.status(201).json({
        status: "success",
        data: {
            budget: newBudget
        }
    });
});

exports.getBudgets = asyncHandler(async (req, res, next) => {
    const budgets = await Budget.find({ user: req.user.id }).sort({ startDate: -1 });
    res.status(200).json({
        status: "success",
        results: budgets.length,
        data: {
            budgets
        }
    });
});

exports.getBudget = asyncHandler(async (req, res, next) => {
    const budgetId = validateObjectId(req.params.id, 'Budget ID');
    const userId = validateObjectId(req.user.id, 'User ID');

    const budget = await Budget.findOne({ _id: budgetId, user: userId });

    if (!budget) {
        return next(new AppError("No budget found with that ID for this user", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            budget
        }
    });
});

exports.updateBudget = asyncHandler(async (req, res, next) => {
    const budgetId = validateObjectId(req.params.id, 'Budget ID');
    const userId = validateObjectId(req.user.id, 'User ID');

    const { amount } = req.body;

    // If not recurring, ensure recurrenceType is null to pass Mongoose enum validation
    if (!req.body.isRecurring) {
        req.body.recurrenceType = null;
    }

    if (amount !== undefined) {
        // Calculate total income
        const incomeAggregation = await Income.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalIncome = incomeAggregation.length > 0 ? incomeAggregation[0].total : 0;

        // Calculate total other budgets (excluding this one)
        const budgetAggregation = await Budget.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id), _id: { $ne: new mongoose.Types.ObjectId(budgetId) } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalOtherBudgets = budgetAggregation.length > 0 ? budgetAggregation[0].total : 0;

        if (totalOtherBudgets + amount > totalIncome) {
            return next(new AppError(`Total budget (${totalOtherBudgets + amount}) cannot exceed total income (${totalIncome})`, 400));
        }
    }

    const budget = await Budget.findOneAndUpdate(
        { _id: budgetId, user: userId },
        req.body,
        { new: true, runValidators: true }
    );

    if (!budget) {
        return next(new AppError("No budget found with that ID for this user", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            budget
        }
    });
});

exports.deleteBudget = asyncHandler(async (req, res, next) => {
    const budgetId = validateObjectId(req.params.id, 'Budget ID');
    const userId = validateObjectId(req.user.id, 'User ID');

    const budget = await Budget.findOneAndDelete({ _id: budgetId, user: userId });

    if (!budget) {
        return next(new AppError("No budget found with that ID for this user", 404));
    }

    res.status(204).json({
        status: "success",
        data: null
    });
});

exports.getBudgetVsActual = asyncHandler(async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { startDate, endDate } = req.query;

    // Fetch ALL budgets for the user (do NOT filter budgets by query date range;
    // the date range only constrains which expenses are counted per budget)
    const budgets = await Budget.find({ user: userId }).sort({ startDate: -1 }).lean();

    if (!budgets || budgets.length === 0) {
        return res.status(200).json({
            status: "success",
            results: 0,
            data: { report: [], totalExpenses: 0, expenseDistribution: [] }
        });
    }

    // Build expense date filter from query params (or fall back to widest budget range)
    const minDate = startDate
        ? (() => { const d = new Date(startDate); d.setHours(0, 0, 0, 0); return d; })()
        : budgets.reduce((min, b) => new Date(b.startDate) < min ? new Date(b.startDate) : min, new Date(8640000000000000));
    const maxDate = endDate
        ? new Date(endDate)
        : budgets.reduce((max, b) => new Date(b.endDate) > max ? new Date(b.endDate) : max, new Date(-8640000000000000));
    // Include the full last day
    maxDate.setHours(23, 59, 59, 999);

    // Fetch Expenses within the resolved date range
    const expenses = await Expense.find({
        user: userId,
        date: { $gte: minDate, $lte: maxDate }
    }).select('amount category title date').lean();

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Expense distribution — grouped by title with category label
    const expenseDistributionMap = expenses.reduce((acc, curr) => {
        const title = (curr.title || curr.category || "Uncategorized").trim();
        const cat = (curr.category || "Uncategorized").trim();
        const key = `${title}|||${cat}`;
        acc[key] = (acc[key] || 0) + curr.amount;
        return acc;
    }, {});

    const expenseDistribution = Object.keys(expenseDistributionMap).map(key => {
        const [title, category] = key.split("|||");
        // Only append category in parentheses when it differs from the title
        const label = title.toLowerCase() === category.toLowerCase()
            ? title
            : `${title} (${category})`;
        return {
            label,
            category,
            amount: expenseDistributionMap[key]
        };
    });

    // Map expenses to each budget by EXACT category name (case-insensitive) and date range
    const report = budgets.map(budget => {
        const budgetCategory = (budget.category || "").trim().toLowerCase();

        const budgetStart = new Date(budget.startDate);
        const budgetEnd = new Date(budget.endDate);
        budgetEnd.setHours(23, 59, 59, 999);

        const actualSpent = expenses.reduce((sum, expense) => {
            const expenseCategory = (expense.category || "").trim().toLowerCase();
            const isCategoryMatch = expenseCategory === budgetCategory;
            const expenseDate = new Date(expense.date);
            const isDateMatch = expenseDate >= budgetStart && expenseDate <= budgetEnd;
            return (isCategoryMatch && isDateMatch) ? sum + expense.amount : sum;
        }, 0);

        const status = actualSpent > budget.amount ? 'overspent' : 'within_budget';

        return {
            ...budget,
            budgetAmount: budget.amount,
            actualSpent,
            remaining: budget.amount - actualSpent,
            status
        };
    });

    res.status(200).json({
        status: "success",
        results: report.length,
        data: {
            report,
            totalExpenses,
            expenseDistribution
        }
    });
});

