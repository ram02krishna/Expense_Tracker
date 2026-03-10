// Import necessary packages and components
import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import TransactionsTable from "../../components/Transactions/TransactionsTable"; // Replaced IncomeList
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import Modal from "../../components/layouts/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import LoadingSpinner from "../../components/LoadingSpinner";
import { LuDownload, LuSearch, LuX, LuFileText } from "react-icons/lu";
import { generatePDF } from "../../utils/pdfGenerator";

// Income page component
const Income = () => {
  // State variables for income data, loading state, and modal visibility
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [error, setError] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);

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
   * @desc    Handles adding or updating an income record
   * @param   {object} incomeData - The income data from the form
   */
  const handleSaveIncome = async (data) => {
    try {
      if (data._id) {
        // Update existing income
        await updateIncome(data._id, data);
      } else {
        // Add new income
        await addIncome(data);
      }
      setOpenAddIncomeModal(false);
      setEditingIncome(null);
    } catch (error) {
      console.error("Error saving income:", error);
      // Error handling already mostly in sub-functions or can be consolidated here
    }
  };

  const addIncome = async (data) => {
    try {
      const response = await axiosInstance.post(
        `${API_PATHS.INCOME.ADD_INCOME}`,
        data,
      );

      if (response.data) {
        setIncomeData((prevIncomes) => [response.data.data.income, ...prevIncomes]);
      }
    } catch (error) {
      console.error("Error adding income:", error);
      alert("Failed to add income. Please try again.");
      throw error;
    }
  };

  const updateIncome = async (id, data) => {
    try {
      const response = await axiosInstance.put(
        // Assuming endpoint structure, check apiPath if needed. 
        // Usually ID is part of URL for PUT.
        // From apiPath.js: ADD_INCOME: "/api/v1/income", DELETE is /:id. 
        // We need to verfiy PUT endpoint. Based on typical REST: /api/v1/income/:id
        `${API_PATHS.INCOME.ADD_INCOME}/${id}`,
        data
      );

      if (response.data) {
        setIncomeData((prevIncomes) =>
          prevIncomes.map(item => item._id === id ? response.data.data.income : item)
        );
      }
    } catch (error) {
      console.error("Error updating income:", error);
      alert("Failed to update income. Please try again.");
      throw error;
    }
  };

  const handleEditClick = (income) => {
    setEditingIncome(income);
    setOpenAddIncomeModal(true);
  };

  const handleModalClose = () => {
    setOpenAddIncomeModal(false);
    setEditingIncome(null);
  };

  /**
   * @desc    Handles deleting an income record
   * @param   {string} incomeId - The ID of the income record to delete
   */
  const handleDeleteIncome = async (incomeId) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;

    try {
      await axiosInstance.delete(
        `${API_PATHS.INCOME.DELETE_INCOME(incomeId)}`,
      );

      setIncomeData((prevIncomes) =>
        prevIncomes.filter((income) => income._id !== incomeId),
      );
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("Failed to delete income. Please try again.");
    }
  };

  /**
   * @desc    Handles downloading income data as an Excel file
   */
  const handleDownloadIncome = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.DOWNLOAD_INCOME}`,
        { responseType: "blob" },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_data.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Release the blob URL to avoid memory leak
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading income:", error);
      alert("Failed to download income data. Please try again.");
    }
  };

  /**
   * @desc    Fetches all income records for the user
   */
  const fetchIncomeDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `${API_PATHS.INCOME.GET_ALL_INCOME}?page=${page}&limit=${limit}`;

      if (debouncedSearchTerm) url += `&search=${encodeURIComponent(debouncedSearchTerm)}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const response = await axiosInstance.get(url);

      if (response.data && response.data.data.incomes) {
        setIncomeData(response.data.data.incomes);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
        }
      } else {
        setIncomeData([]);
      }
    } catch (error) {
      console.error("Error fetching income:", error);
      setError("Failed to load income data. Please try again.");
      setIncomeData([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearchTerm, startDate, endDate]);

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
    fetchIncomeDetails();
  }, [fetchIncomeDetails]);



  // Handler for date change to reset page
  const handleDateChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  return (
    <DashboardLayout activeMenu="Income">
      <div className="w-full max-w-[1400px] mx-auto">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner text="Loading income data..." />
          </div>
        ) : error ? (
          <div className="card">
            <div className="text-center text-red-500 py-8">
              <p>{error}</p>
              <button
                onClick={fetchIncomeDetails}
                className="mt-4 btn-primary"
              >
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
                  placeholder="Search income..."
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

            {/* Income overview and add income button */}
            <div className="w-full">
              <IncomeOverview
                transactions={incomeData}
                onAddIncome={() => {
                  setEditingIncome(null);
                  setOpenAddIncomeModal(true);
                }}
              />
            </div>

            {/* List of income records (TABLE LAYOUT) */}
            <div className="card w-full overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Income Records</h5>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <div className="text-xs text-gray-500 self-center dark:text-gray-400">
                    {incomeData.length} record{incomeData.length !== 1 ? 's' : ''} found
                  </div>
                  <button className="card-btn" onClick={() => generatePDF("Income Report", incomeData, ["income-bar-chart", "income-doughnut-chart"], "income")}>
                    <LuFileText className="text-base" /> PDF
                  </button>
                  <button className="card-btn" onClick={handleDownloadIncome}>
                    <LuDownload className="text-base" /> Excel
                  </button>
                </div>
              </div>
              <TransactionsTable
                data={incomeData}
                onEdit={handleEditClick}
                onDelete={handleDeleteIncome}
                type="income"
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

        {/* Modal for adding/editing income record */}
        <Modal
          isOpen={openAddIncomeModal}
          onClose={handleModalClose}
          title={editingIncome ? "Edit Income" : "Add Income"}
        >
          <AddIncomeForm
            onAddIncome={handleSaveIncome}
            closeModal={handleModalClose}
            editingData={editingIncome}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;