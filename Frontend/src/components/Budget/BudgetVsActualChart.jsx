import React, { useMemo } from "react";
import { LuTrendingUp, LuTrendingDown, LuMinus } from "react-icons/lu";

const fmt = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const pct = (spent, budget) => (budget > 0 ? Math.min((spent / budget) * 100, 100) : 0);

const statusColor = (spent, budget) => {
    if (budget === 0) return { bar: "bg-blue-400", text: "text-blue-500", badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300" };
    const ratio = spent / budget;
    if (ratio >= 1) return { bar: "bg-red-500", text: "text-red-500", badge: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400" };
    if (ratio >= 0.8) return { bar: "bg-orange-400", text: "text-orange-500", badge: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400" };
    return { bar: "bg-emerald-500", text: "text-emerald-500", badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" };
};

const StatusIcon = ({ spent, budget }) => {
    if (budget === 0) return <LuMinus className="w-3.5 h-3.5" />;
    if (spent >= budget) return <LuTrendingUp className="w-3.5 h-3.5" />;
    if (spent / budget >= 0.8) return <LuTrendingUp className="w-3.5 h-3.5 opacity-70" />;
    // Good: within budget
    return <span className="text-[10px] font-bold">✓</span>;
};

const BudgetVsActualChart = ({ budgetReport, expenseDistribution, budgets, totalExpenses }) => {
    // Build a merged list: all expense categories + all budget categories
    const rows = useMemo(() => {
        // Start from expense distribution (real spend by category)
        const expenseMap = {};
        (expenseDistribution || []).forEach((e) => {
            const cat = (e.category || "Uncategorized").trim();
            expenseMap[cat] = (expenseMap[cat] || 0) + e.amount;
        });

        // Budget map: category → budgetAmount
        const budgetMap = {};
        (budgetReport || []).forEach((b) => {
            const cat = (b.category || "").trim();
            budgetMap[cat] = (budgetMap[cat] || 0) + (b.budgetAmount || b.amount || 0);
        });

        // Merge: union of all categories
        const allCats = new Set([...Object.keys(expenseMap), ...Object.keys(budgetMap)]);
        const merged = Array.from(allCats).map((cat) => ({
            category: cat,
            spent: expenseMap[cat] || 0,
            budget: budgetMap[cat] || 0,
        }));

        // Sort by spent descending
        merged.sort((a, b) => b.spent - a.spent);
        return merged;
    }, [budgetReport, expenseDistribution]);

    const totalBudgeted = (budgets || []).reduce((s, b) => s + (b.amount || 0), 0);
    const overallPct = pct(totalExpenses, totalBudgeted);
    const overallColors = statusColor(totalExpenses, totalBudgeted);

    if (rows.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
                No data available. Add expenses or budgets to see the breakdown.
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* ── Overall Summary Bar ─────────────────────────── */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                        Total Budget
                    </span>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {fmt(totalExpenses)} <span className="text-gray-400">of</span> {fmt(totalBudgeted)}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${overallColors.badge}`}>
                            <StatusIcon spent={totalExpenses} budget={totalBudgeted} />
                            {totalBudgeted > 0 ? `${overallPct.toFixed(0)}%` : "No Budget"}
                        </span>
                    </div>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ${overallColors.bar}`}
                        style={{ width: `${overallPct}%` }}
                    />
                </div>
                {totalExpenses > totalBudgeted && totalBudgeted > 0 && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">
                        ⚠ Over by {fmt(totalExpenses - totalBudgeted)}
                    </p>
                )}
            </div>

            {/* ── Per-Category Rows ───────────────────────────── */}
            <div className="space-y-3">
                {rows.map((row) => {
                    const colors = statusColor(row.spent, row.budget);
                    const barPct = pct(row.spent, row.budget);
                    const label =
                        row.budget === 0
                            ? "No budget set"
                            : row.spent >= row.budget
                                ? `Over by ${fmt(row.spent - row.budget)}`
                                : `${fmt(row.budget - row.spent)} left`;

                    return (
                        <div key={row.category}>
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                        {row.category}
                                    </span>
                                    {row.budget === 0 && (
                                        <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full shrink-0 hidden sm:inline">
                                            Unbudgeted
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{label}</span>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${colors.badge}`}>
                                        <StatusIcon spent={row.spent} budget={row.budget} />
                                        {row.spent > 0 ? fmt(row.spent) : '—'}
                                    </span>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="relative h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                {row.spent > 0 && (
                                    <div
                                        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${colors.bar}`}
                                        style={{
                                            width: `${row.budget > 0 ? barPct : 40}%`,
                                            opacity: row.budget > 0 ? 1 : 0.5
                                        }}
                                    />
                                )}
                                {/* Overspent marker — shown at 100% right edge when over budget */}
                                {row.budget > 0 && row.spent > row.budget && (
                                    <div className="absolute top-0 right-0 h-full w-1 bg-white/80 dark:bg-white/40 rounded-full" />
                                )}
                            </div>

                            {/* Budget amount label */}
                            {row.budget > 0 && (
                                <div className="flex justify-between mt-0.5">
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                        {row.spent === 0 ? 'No spending tracked' : ''}
                                    </span>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500">Budget: {fmt(row.budget)}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── Legend ─────────────────────────────────────── */}
            <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                {[
                    { color: "bg-emerald-500", label: "Within budget (< 80%)" },
                    { color: "bg-orange-400", label: "Approaching limit (80–99%)" },
                    { color: "bg-red-500", label: "Overspent (≥ 100%)" },
                    { color: "bg-blue-400", label: "No budget set" },
                ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <span className={`w-3 h-3 rounded-full ${color}`} />
                        {label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BudgetVsActualChart;
