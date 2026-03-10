import React, { useMemo } from "react";
import ChartJsDoughnutChart from "../Charts/ChartJsDoughnutChart";
import { addThousandsSeparator, prepareTitleAndCategoryData } from "../../utils/helper";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4ADE80", "#3B82F6"];

const RecentIncomeWithChart = ({ data, totalIncome }) => {
  const chartData = useMemo(
    () => prepareTitleAndCategoryData(data),
    [data],
  );

  return (
    <div className="card h-auto min-h-[450px] transition-all duration-300 ease-in-out flex flex-col pb-6">
      <div className="flex items-center justify-between px-2 pt-2">
        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
          Last 30 Days Income
        </h5>
      </div>

      <div className="w-full h-[320px] mt-4 relative flex items-center justify-center shrink-0">
        <ChartJsDoughnutChart data={chartData} colors={COLORS} showLegend={false} />
        {chartData.length > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Income</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              ₹{addThousandsSeparator(totalIncome)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 px-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="shrink-0 w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentIncomeWithChart;
