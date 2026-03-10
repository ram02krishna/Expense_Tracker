import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Modal from "../../components/layouts/Modal";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import BudgetOverview from "../../components/Budget/BudgetOverview";
import SimpleBudgetList from "../../components/Budget/SimpleBudgetList";
import AddBudgetForm from "../../components/Budget/AddBudgetForm";
import BudgetVsActualChart from "../../components/Budget/BudgetVsActualChart";
import ChartJsPieChart from "../../components/Charts/ChartJsPieChart";
import LoadingSpinner from "../../components/LoadingSpinner";

// Timezone-safe date formatter — always uses LOCAL year/month/day (avoids UTC shifting)
const toLocalDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [budgetReport, setBudgetReport] = useState([]);
  const [expenseDistribution, setExpenseDistribution] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [reportStartDate, setReportStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1); // First day of the current month
    return toLocalDateStr(d);
  });
  const [reportEndDate, setReportEndDate] = useState(
    () => toLocalDateStr(new Date()),
  );

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    startDate: "",
    endDate: "",
    isRecurring: false,
    recurrenceType: "",
  });

  const [activeChartTab, setActiveChartTab] = useState('budgetVsActual');

  const fetchBudgetsAndReport = useCallback(async () => {
    setLoading(true);
    try {
      const budgetsResponse = await axiosInstance.get(
        API_PATHS.BUDGET.GET_ALL_BUDGETS,
      );
      setBudgets(budgetsResponse.data.data.budgets || []);

      const reportResponse = await axiosInstance.get(
        `${API_PATHS.BUDGET.GET_REPORT}?startDate=${reportStartDate}&endDate=${reportEndDate}`,
      );
      const reportData = reportResponse.data.data;
      setBudgetReport(reportData.report || []);
      setTotalExpenses(reportData.totalExpenses || 0);
      setExpenseDistribution(reportData.expenseDistribution || []);

    } catch (err) {
      setError("Failed to fetch data.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [reportStartDate, reportEndDate]);

  useEffect(() => {
    fetchBudgetsAndReport();
  }, [fetchBudgetsAndReport]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      handleChange(name, checked);
    } else if (name === "amount") {
      handleChange(name, value ? parseFloat(value) : "");
    } else {
      handleChange(name, value);
    }
  };

  const openAddModal = () => {
    setEditingBudget(null);

    // Default to current month: 1st to Last Day (local timezone, no UTC shift)
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setFormData({
      category: "",
      amount: "",
      startDate: toLocalDateStr(firstDay),
      endDate: toLocalDateStr(lastDay),
      isRecurring: false,
      recurrenceType: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount,
      startDate: budget.startDate
        ? toLocalDateStr(new Date(budget.startDate))
        : "",
      endDate: budget.endDate
        ? toLocalDateStr(new Date(budget.endDate))
        : "",
      isRecurring: budget.isRecurring,
      recurrenceType: budget.recurrenceType || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        category: formData.category,
        amount: formData.amount,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isRecurring: formData.isRecurring,
      };

      if (formData.isRecurring) {
        dataToSend.recurrenceType = formData.recurrenceType;
      }

      if (new Date(dataToSend.startDate) > new Date(dataToSend.endDate)) {
        alert("End Date must be greater than or equal to Start Date");
        return;
      }

      if (editingBudget) {
        await axiosInstance.put(
          API_PATHS.BUDGET.UPDATE_BUDGET(editingBudget._id),
          dataToSend,
        );
      } else {
        await axiosInstance.post(API_PATHS.BUDGET.ADD_BUDGET, dataToSend);
      }
      fetchBudgetsAndReport();
      closeModal();
    } catch (err) {
      console.error("Error saving budget:", err);
      const errorMessage = err.response?.data?.message ||
        (err.response?.data?.errors && err.response.data.errors[0]?.msg) ||
        "Failed to save budget.";
      alert(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await axiosInstance.delete(API_PATHS.BUDGET.DELETE_BUDGET(id));
        fetchBudgetsAndReport();
      } catch (err) {
        setError("Failed to delete budget.");
        console.error("Error deleting budget:", err);
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text="Loading budget data..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="card">
          <div className="text-center text-red-500 py-8">
            <p>{error}</p>
            <button
              onClick={fetchBudgetsAndReport}
              className="mt-4 btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Helper to get Chart Colors
  const getChartColors = (count) => {
    const colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#f97316", "#06b6d4"];
    return Array(count).fill().map((_, i) => colors[i % colors.length]);
  };

  return (
    <DashboardLayout activeMenu="Budget">
      <div className="w-full max-w-[1400px] mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Budget Management
        </h1>

        <div className="space-y-6">
          <BudgetOverview
            onAddBudget={openAddModal}
            reportStartDate={reportStartDate}
            setReportStartDate={setReportStartDate}
            reportEndDate={reportEndDate}
            setReportEndDate={setReportEndDate}
            budgetReport={budgetReport}
            budgets={budgets}
            totalExpenses={totalExpenses}
          />

          {/* ── Budget vs Actual Progress Breakdown ─────────────────────── */}
          {(budgets.length > 0 || expenseDistribution.length > 0) && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Budget vs. Actual Spending
              </h2>
              <BudgetVsActualChart
                budgetReport={budgetReport}
                expenseDistribution={expenseDistribution}
                budgets={budgets}
                totalExpenses={totalExpenses}
              />
            </div>
          )}

          {/* ── Pie Charts Row ────────────────────────────────────────────── */}
          {(budgetReport.length > 0 || expenseDistribution.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {budgetReport.length > 0 && (
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Budget Allocation</h2>
                  <div className="h-auto flex flex-col">
                    <div className="h-[250px] relative flex items-center justify-center shrink-0">
                      <ChartJsPieChart
                        data={budgetReport.map((item) => ({ category: item.category, amount: item.budgetAmount }))}
                        colors={getChartColors(budgetReport.length)}
                        showLegend={false}
                        donut={true}
                      />
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto max-h-[150px] custom-scrollbar pr-2">
                      {budgetReport.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getChartColors(budgetReport.length)[index] }} />
                          <span className="text-xs text-gray-600 dark:text-gray-300 truncate" title={item.category}>
                            {item.category}: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.budgetAmount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {expenseDistribution.length > 0 && (
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Category Breakdown</h2>
                  <div className="h-auto flex flex-col">
                    <div className="h-[250px] relative flex items-center justify-center shrink-0">
                      <ChartJsPieChart
                        data={expenseDistribution.map((item) => ({ label: item.label, category: item.category, amount: item.amount }))}
                        colors={getChartColors(expenseDistribution.length)}
                        showLegend={false}
                        donut={true}
                        labelKey="label"
                      />
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto max-h-[150px] custom-scrollbar pr-2">
                      {expenseDistribution.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getChartColors(expenseDistribution.length)[index] }} />
                          <span className="text-xs text-gray-600 dark:text-gray-300 truncate" title={item.label}>
                            {item.label}: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {budgets.length === 0 ? (
            <div className="card">
              <p className="text-gray-700 dark:text-gray-300">
                No budgets set yet. Add your first budget!
              </p>
            </div>
          ) : (
            <SimpleBudgetList
              budgets={budgets}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingBudget ? "Edit Budget" : "Add New Budget"}
        >
          <AddBudgetForm
            formData={formData}
            handleChange={handleChange}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            editingBudget={editingBudget}
            closeModal={closeModal}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Budget;
