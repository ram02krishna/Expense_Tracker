export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fractionalPart !== undefined
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};


export const prepareExpenseLineChartData = (data = []) => {
  // Ensure data is an array and handle null/undefined cases
  if (!Array.isArray(data)) {
    return [];
  }

  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const chartData = sortedData.map((item) => {
    if (!item) return null;
    return {
      month: new Date(item.date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      amount: item.amount,
      category: item.category,
    };
  }).filter(Boolean);

  return chartData;
};

export const prepareIncomeBarChartData = (data = []) => {
  // Ensure data is an array and handle null/undefined cases
  if (!Array.isArray(data)) {
    return [];
  }

  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const chartData = sortedData.map((item) => ({
    month: new Date(item?.date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    amount: item?.amount,
    source: item?.source,
  }));

  return chartData;
};

export const prepareCategoryData = (data = [], key = "category") => {
  if (!Array.isArray(data)) return [];

  const grouped = data.reduce((acc, item) => {
    const label = item[key] || "Other";
    acc[label] = (acc[label] || 0) + (item.amount || 0);
    return acc;
  }, {});

  return Object.entries(grouped).map(([label, amount]) => ({
    name: label,
    amount,
  }));
};

export const prepareTitleAndCategoryData = (data = []) => {
  if (!Array.isArray(data)) return [];

  const grouped = data.reduce((acc, item) => {
    if (!item) return acc;
    const label = `${item.title || 'Unknown'} (${item.category || item.source || "N/A"})`;
    acc[label] = (acc[label] || 0) + (item.amount || 0);
    return acc;
  }, {});

  return Object.entries(grouped).map(([label, amount]) => ({
    name: label,
    amount,
  }));
};
