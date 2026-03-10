// Import necessary packages and models
const Income = require("../models/Income");
const ExcelJS = require("exceljs");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { validateObjectId } = require("../utils/queryValidator");

/**
 * @desc    Add a new income
 * @route   POST /api/v1/income
 * @access  Private
 */
exports.addIncome = asyncHandler(async (req, res, next) => {
  const { title, icon, amount, source, category, date, note } = req.body;

  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) {
    return next(new AppError("Amount must be a valid number", 400));
  }

  const income = await Income.create({
    user: req.user.id,
    title,
    icon,
    amount: numericAmount,
    source,
    category,
    date,
    note,
  });

  res.status(201).json({
    status: "success",
    data: {
      income,
    },
  });
});

/**
 * @desc    Get all incomes for the logged-in user
 * @route   GET /api/v1/income
 * @access  Private
 */
exports.getAllIncome = asyncHandler(async (req, res, next) => {
  const { page, limit, startDate, endDate, search } = req.query;

  const query = { user: req.user.id };

  // Date filtering — supports startDate only, endDate only, or both
  if (startDate || endDate) {
    query.date = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      query.date.$gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.date.$lte = end;
    }
  }

  // Search filtering
  if (search) {
    const searchRegex = new RegExp(search, "i");
    query.$or = [
      { title: searchRegex },
      { category: searchRegex },
      { source: searchRegex },
    ];
  }

  // If no pagination is requested, return all (backward compatibility)
  if (!page && !limit) {
    const incomes = await Income.find(query).sort({ date: -1 }).lean();
    return res.status(200).json({
      status: "success",
      results: incomes.length,
      data: { incomes },
    });
  }

  // Pagination logic
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const incomes = await Income.find(query)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  const total = await Income.countDocuments(query);

  res.status(200).json({
    status: "success",
    results: incomes.length,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
    data: { incomes },
  });
});

/**
 * @desc    Delete an income
 * @route   DELETE /api/v1/income/:id
 * @access  Private
 */
exports.deleteIncome = asyncHandler(async (req, res, next) => {
  // Validate income ID and user ID
  const incomeId = validateObjectId(req.params.id, 'Income ID');
  const userId = validateObjectId(req.user.id, 'User ID');

  const income = await Income.findOneAndDelete({
    _id: incomeId,
    user: userId,
  });

  if (!income) {
    return next(new AppError("No income found with that ID for this user", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

/**
 * @desc    Update an income
 * @route   PUT /api/v1/income/:id
 * @access  Private
 */
exports.updateIncome = asyncHandler(async (req, res, next) => {
  const { title, icon, amount, source, category, date, note } = req.body;

  // Sanitize amount
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) {
    return next(new AppError("Amount must be a valid number", 400));
  }

  // Validate income ID and user ID
  const incomeId = validateObjectId(req.params.id, 'Income ID');
  const userId = validateObjectId(req.user.id, 'User ID');

  const income = await Income.findOneAndUpdate(
    { _id: incomeId, user: userId },
    { title, icon, amount: numericAmount, source, category, date, note },
    { new: true, runValidators: true },
  );

  if (!income) {
    return next(new AppError("No income found with that ID for this user", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      income,
    },
  });
});

/**
 * @desc    Download all incomes as an Excel file
 * @route   GET /api/v1/income/download-excel
 * @access  Private
 */
exports.downloadIncomeExcel = asyncHandler(async (req, res, next) => {
  const incomes = await Income.find({ user: req.user.id }).lean();
  if (!incomes.length) {
    return next(new AppError("No incomes found to export", 404));
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Incomes");

  const data = incomes.map(
    ({ _id, user, __v, createdAt, updatedAt, ...rest }) => rest
  );

  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);
    data.forEach((income) => {
      worksheet.addRow(Object.values(income));
    });
  }

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=incomes.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
});