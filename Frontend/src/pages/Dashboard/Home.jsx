// Import necessary packages and components
import React, { useState, useEffect, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/UserContextDefinition";
import InfoCard from "../../components/Cards/InfoCard";
import { MdAccountBalanceWallet } from "react-icons/md";
import { addThousandsSeparator } from "../../utils/helper";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpenses from "./Last30DaysExpenses.jsx";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";

// Home component for the dashboard
const Home = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const { updateUser } = useContext(UserContext);

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`);
        setDashboardData(res.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [updateUser]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="w-full max-w-[1400px] mx-auto">
        {/* Top section with summary info cards */}
        <div className="stagger-children grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <InfoCard
            icon={<MdAccountBalanceWallet />}
            label="Total Balance"
            value={"₹" + addThousandsSeparator(dashboardData?.balance ?? 0)}
            color="bg-purple-500"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={
              "₹" +
              addThousandsSeparator(
                dashboardData?.totalIncome ?? 0,
              )
            }
            color="bg-orange-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={
              "₹" +
              addThousandsSeparator(
                dashboardData?.totalExpense ?? 0,
              )
            }
            color="bg-red-500"
          />
        </div>

        {/* Middle section with recent transactions and expenses */}
        <div className="stagger-children delay-150 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RecentTransactions
            transactions={dashboardData?.last5Transactions || []}
            onSeeMore={() => navigate("/recent-transactions")}
          />
          <ExpenseTransactions
            transactions={dashboardData?.expenseLast30Days || []}
            onSeeMore={() => navigate("/expense")}
          />
        </div>

        {/* Financial overview and last 30 days expenses */}
        <div className="stagger-children delay-300 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FinanceOverview
            totalBalance={dashboardData?.balance ?? 0}
            totalIncome={
              dashboardData?.totalIncome ?? 0
            }
            totalExpense={
              dashboardData?.totalExpense ?? 0
            }
          />
          <Last30DaysExpenses
            data={dashboardData?.expenseLast30Days || []}
          />
        </div>

        {/* Recent income with chart and recent income list */}
        <div className="stagger-children delay-450 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RecentIncomeWithChart
            data={dashboardData?.incomeLast30Days?.slice(0, 4) || []}
            totalIncome={dashboardData?.totalIncomeLast30Days || 0}
          />
          <RecentIncome
            transactions={dashboardData?.incomeLast30Days || []}
            onSeeMore={() => navigate("/income")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;