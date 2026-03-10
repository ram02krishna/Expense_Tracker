import React from "react";

const InfoCard = ({ icon, label, value, color }) => {
  const bgIcon = {
    "bg-purple-500": "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400",
    "bg-orange-500": "bg-orange-100 dark:bg-orange-900/40 text-orange-500 dark:text-orange-400",
    "bg-red-500": "bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400",
    "bg-green-500": "bg-green-100 dark:bg-green-900/40 text-green-500 dark:text-green-400",
    "bg-blue-500": "bg-blue-100 dark:bg-blue-900/40 text-blue-500 dark:text-blue-400",
  };

  const iconClasses = bgIcon[color] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";

  return (
    <div className="card card-interactive group flex items-center gap-5 p-6 w-full">
      {/* Icon with hover scale + ring glow */}
      <div
        className={`w-12 h-12 flex items-center justify-center text-2xl rounded-xl flex-shrink-0
          transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:scale-110 ${iconClasses}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white truncate
          transition-colors duration-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
          {value}
        </h4>
      </div>
    </div>
  );
};

export default InfoCard;
