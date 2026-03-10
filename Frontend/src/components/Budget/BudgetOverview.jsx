import React, { useState } from "react";
import { LuPlus, LuTriangleAlert } from "react-icons/lu";
import ModernDatePicker from "../Inputs/ModernDatePicker";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const BudgetOverview = ({ onAddBudget, reportStartDate, setReportStartDate, reportEndDate, setReportEndDate, budgetReport, budgets, totalExpenses }) => {
  const [showAtRiskDetails, setShowAtRiskDetails] = useState(false);

  const hasReportData = budgetReport && budgetReport.length > 0;

  // Total Budgeted: Sum of all budgets (If 'Total' exists, this might be double counting if not handled, but sticking to simple sum for now as per conventional logic)
  // Actually, let's refine: If there is a budget named "Total", maybe we should use THAT as the total? 
  // For now, let's keep the sum logic but maybe in the future we can add a toggle.
  const totalBudgeted = budgets?.reduce((sum, b) => sum + (b.amount || 0), 0) || 0;

  // Total Spent: Use the grand total provided by backend if available, otherwise fallback to sum (which might be inaccurate)
  const totalSpent = totalExpenses !== undefined ? totalExpenses : (
    hasReportData
      ? budgetReport.reduce((sum, b) => sum + (b.actualSpent || 0), 0)
      : 0
  );

  const totalRemaining = totalBudgeted - totalSpent;

  let overspentCount = 0;
  let atRiskCategories = [];

  if (hasReportData) {
    // Per-category overspent budgets
    atRiskCategories = budgetReport?.filter(b => b.status === 'overspent') || [];
    overspentCount = atRiskCategories.length;

    // Also flag as overall "at risk" when total exceeds budget
    // but no individual categories were matched (e.g. generic budget name)
    if (overspentCount === 0 && totalSpent > totalBudgeted && totalBudgeted > 0) {
      overspentCount = 1; // At least 1 "overall" risk
    }
  }

  return (
    <div className="card w-full">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
        <div>
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Overview</h5>
          <p className="text-sm text-gray-500 mt-1">Monitor your financial goals and spending limits.</p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 w-full lg:w-auto">
          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
            <div className="w-full">
              <ModernDatePicker
                label="Start Date"
                value={reportStartDate}
                onChange={(e) => setReportStartDate(e.target.value)}
                colorTheme="purple"
              />
            </div>
            <div className="w-full">
              <ModernDatePicker
                label="End Date"
                value={reportEndDate}
                onChange={(e) => setReportEndDate(e.target.value)}
                colorTheme="purple"
              />
            </div>
          </div>
          <button className="add-btn flex-shrink-0 justify-center w-full lg:w-auto mt-2 lg:mt-0" onClick={onAddBudget}>
            <LuPlus className="text-lg" />
            Add New Budget
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Total Budgeted</p>
          <p className="text-xl font-bold text-blue-900 dark:text-blue-100 mt-2">{formatCurrency(totalBudgeted)}</p>
        </div>

        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
          <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">Total Spent</p>
          <p className="text-xl font-bold text-purple-900 dark:text-purple-100 mt-2">{formatCurrency(totalSpent)}</p>
        </div>

        <div className={`p-4 rounded-xl border ${totalRemaining >= 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'}`}>
          <p className={`text-xs font-medium uppercase tracking-wide ${totalRemaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {totalRemaining >= 0 ? 'Remaining' : 'Overspent'}
          </p>
          <p className={`text-xl font-bold mt-2 ${totalRemaining >= 0 ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
            {formatCurrency(Math.abs(totalRemaining))}
          </p>
        </div>

        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-all duration-200 transform hover:scale-105"
          onClick={() => overspentCount > 0 && setShowAtRiskDetails(!showAtRiskDetails)}>
          <p className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">At Risk</p>
          <p className="text-xl font-bold text-orange-900 dark:text-orange-100 mt-2">
            {overspentCount} {overspentCount === 1 ? 'Category' : 'Categories'}
          </p>
          {overspentCount > 0 && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 font-medium">👆 Click to see details</p>
          )}
        </div>
      </div>

      {/* At Risk Categories Details */}
      {showAtRiskDetails && overspentCount > 0 && (
        <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <LuTriangleAlert className="text-orange-600 dark:text-orange-400" />
            <h6 className="font-semibold text-orange-900 dark:text-orange-100">Budget Alert</h6>
          </div>
          <div className="space-y-2">
            {atRiskCategories.length > 0 ? (
              atRiskCategories.map((category, idx) => {
                const overspentAmount = (category.actualSpent || 0) - (category.budgetAmount || category.amount || 0);
                return (
                  <div key={idx} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{category.category}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Budget: {formatCurrency(category.budgetAmount)} | Spent: {formatCurrency(category.actualSpent)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                        +{formatCurrency(overspentAmount)}
                      </p>
                      <p className="text-xs text-red-500 dark:text-red-400">Over by</p>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Overall budget exceeded but no category-level match */
              <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Overall Budget</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total Budget: {formatCurrency(totalBudgeted)} | Total Spent: {formatCurrency(totalSpent)}
                  </p>
                  <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">
                    Tip: Make sure your budget category names match your expense categories for detailed tracking.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                    +{formatCurrency(totalSpent - totalBudgeted)}
                  </p>
                  <p className="text-xs text-red-500 dark:text-red-400">Over by</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetOverview;
