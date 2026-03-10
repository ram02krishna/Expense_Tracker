import React from "react";
import { LuPencil, LuTrash2 } from "react-icons/lu";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

// Parse a YYYY-MM-DD string as local date (avoids UTC timezone shift)
const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("T")[0].split("-");
  return new Date(Number(y), Number(m) - 1, Number(d));
};

const formatDate = (dateStr) => {
  const date = parseLocalDate(dateStr);
  if (!date) return "";
  return date.toLocaleDateString();
};

const SimpleBudgetList = ({ budgets, onEdit, onDelete }) => {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Budgets</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Budget Amount</th>
              <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Period</th>
              <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Recurring</th>
              <th scope="col" className="relative px-3 md:px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {budgets.map((budget) => (
              <tr key={budget._id}>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{budget.category}</td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatCurrency(budget.amount)}</td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {budget.isRecurring ? budget.recurrenceType : 'No'}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => onEdit(budget)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors"
                      title="Edit"
                    >
                      <LuPencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(budget._id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                      title="Delete"
                    >
                      <LuTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SimpleBudgetList;
