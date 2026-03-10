import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import TransactionsTable from "../../components/Transactions/TransactionsTable"; // Replaced ExpenseList
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import Modal from "../../components/layouts/Modal";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import LoadingSpinner from "../../components/LoadingSpinner";
import { LuDownload, LuSearch, LuX, LuFileText } from "react-icons/lu";
import { generatePDF } from "../../utils/pdfGenerator";

// Expense page component
const Expense = () => {
  // State variables for expense data, loading state, and modal visibility
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [error, setError] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  // Pagination & Filter State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(15);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /**
   * @desc    Handles adding or updating an expense record
   * @param   {object} expenseData - The expense data from the form
   */
  const handleSaveExpense = async (data) => {
    try {
      if (data._id) {
        // Update
        await updateExpense(data._id, data);
      } else {
        // Add
        await addExpense(data);
      }
      setOpenAddExpenseModal(false);
      setEditingExpense(null);
    } catch (error) {
      console.error("Error saving expense:", error.response || error);
      // Error handling mostly in sub-functions or can be done here
    }
  };

  const addExpense = async (data) => {
    try {
      const response = await axiosInstance.post(
        `${API_PATHS.EXPENSE.ADD_EXPENSE}`,
        data
      );

      if (response.data) {
        setExpenseData((prevExpenses) => [
          response.data.data.expense,
          ...prevExpenses,
        ]);
      }
    } catch (error) {
      console.error("Error adding expense:", error.response || error);
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to add expense. Please try again.";
      alert(errorMessage);
      throw error;
    }
  };

  const updateExpense = async (id, data) => {
    try {
      const response = await axiosInstance.put(
        `${API_PATHS.EXPENSE.ADD_EXPENSE}/${id}`,
        data
      );

      if (response.data) {
        setExpenseData((prevExpenses) =>
          prevExpenses.map(item => item._id === id ? response.data.data.expense : item)
        );
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Failed to update expense. Please try again.");
      throw error;
    }
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setOpenAddExpenseModal(true);
  };

  const handleModalClose = () => {
    setOpenAddExpenseModal(false);
    setEditingExpense(null);
  };

  /**
   * @desc    Handles deleting an expense record
   * @param   {string} expenseId - The ID of the expense record to delete
   */
  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await axiosInstance.delete(
        `${API_PATHS.EXPENSE.DELETE_EXPENSE(expenseId)}`
      );

      setExpenseData((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== expenseId)
      );
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense. Please try again.");
    }
  };

  /**
   * @desc    Handles downloading expense data as an Excel file
   */
  const handleDownloadExpense = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.DOWNLOAD_EXPENSE}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_data.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Release the blob URL to avoid memory leak
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense:", error);
      alert("Failed to download expense data. Please try again.");
    }
  };

  /**
   * @desc    Fetches all expense records for the user
   */
  const fetchExpenseDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}?page=${page}&limit=${limit}`;

      if (debouncedSearchTerm) url += `&search=${encodeURIComponent(debouncedSearchTerm)}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const response = await axiosInstance.get(url);

      if (response.data && response.data.data.expenses) {
        setExpenseData(response.data.data.expenses);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
        }
      } else {
        setExpenseData([]);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError("Failed to load expense data. Please try again.");
      setExpenseData([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearchTerm, startDate, endDate]);

  // Fetch expense data on component mount
  // Debounce Search Term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to page 1 on search change
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Data on Change
  useEffect(() => {
    fetchExpenseDetails();
  }, [fetchExpenseDetails]);



  // Handler for date change to reset page
  const handleDateChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="w-full max-w-[1400px] mx-auto">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner text="Loading expense data..." />
          </div>
        ) : error ? (
          <div className="card">
            <div className="text-center text-red-500 py-8">
              <p>{error}</p>
              <button onClick={fetchExpenseDetails} className="mt-4 btn-primary">
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">

            {/* SEARCH & FILTER CONTROLS */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              {/* Search */}
              <div className="flex-1 relative">
                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-purple-500/50 outline-none text-gray-900 dark:text-white"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <LuX />
                  </button>
                )}
              </div>

              {/* Date Range */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex-1 min-w-[130px] w-full sm:w-40">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleDateChange(setStartDate, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-purple-500/50 outline-none text-gray-900 dark:text-white text-sm"
                    placeholder="Start Date"
                  />
                </div>
                <div className="flex-1 min-w-[130px] w-full sm:w-40">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => handleDateChange(setEndDate, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-purple-500/50 outline-none text-gray-900 dark:text-white text-sm"
                    placeholder="End Date"
                  />
                </div>
                {(startDate || endDate) && (
                  <button
                    onClick={() => { setStartDate(""); setEndDate(""); setPage(1); }}
                    className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Expense overview and add expense button */}
            <div className="w-full">
              <ExpenseOverview
                transactions={expenseData}
                onAddExpense={() => {
                  setEditingExpense(null);
                  setOpenAddExpenseModal(true);
                }}
              />
            </div>

            {/* List of expense records (TABLE LAYOUT) */}
            <div className="card w-full overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Records</h5>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <div className="text-xs text-gray-500 self-center dark:text-gray-400">
                    {expenseData.length} record{expenseData.length !== 1 ? 's' : ''} found
                  </div>
                  <button className="card-btn" onClick={() => generatePDF("Expense Report", expenseData, ["expense-line-chart", "expense-doughnut-chart"], "expense")}>
                    <LuFileText className="text-base" /> PDF
                  </button>
                  <button className="card-btn" onClick={handleDownloadExpense}>
                    <LuDownload className="text-base" /> Excel
                  </button>
                </div>
              </div>
              <TransactionsTable
                data={expenseData}
                onEdit={handleEditClick}
                onDelete={handleDeleteExpense}
                type="expense"
              />

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 mt-4">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal for adding/editing expense record */}
        <Modal
          isOpen={openAddExpenseModal}
          onClose={handleModalClose}
          title={editingExpense ? "Edit Expense" : "Add Expense"}
        >
          <AddExpenseForm
            onAddExpense={handleSaveExpense}
            closeModal={handleModalClose}
            editingData={editingExpense}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
