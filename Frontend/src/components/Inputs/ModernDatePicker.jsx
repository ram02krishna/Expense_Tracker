"use client";

import React, { useState, useRef, useEffect } from "react";
import { LuCalendar, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

const ModernDatePicker = ({ value, onChange, error, label, colorTheme = "purple", className = "", inputClassName = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Initialize currentMonth from the selected value so the picker
  // always opens on the correct month, not always today.
  const getInitialMonth = () => {
    if (value) {
      const [y, m] = value.split("-");
      return new Date(Number(y), Number(m) - 1, 1);
    }
    return new Date();
  };
  const [currentMonth, setCurrentMonth] = useState(getInitialMonth);
  const datePickerRef = useRef(null);

  // ⛔ FIX: Prevent all timezone shifting
  const selectedDate = value
    ? (() => {
      const [y, m, d] = value.split("-");
      return new Date(Number(y), Number(m) - 1, Number(d));
    })()
    : null;

  // Sync calendar view to the selected value whenever it changes
  useEffect(() => {
    if (value) {
      const [y, m] = value.split("-");
      setCurrentMonth(new Date(Number(y), Number(m) - 1, 1));
    }
  }, [value]);

  // Close popup on outside click
  useEffect(() => {
    const handler = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 🎨 THEME SYSTEM + FALLBACK
  const theme =
    {
      purple: {
        glow: "shadow-[0_0_15px_rgba(139,92,246,0.3)]",
        accent: "text-purple-600",
        bgAccent: "bg-purple-600 hover:bg-purple-700",
        ring: "focus:ring-purple-400/50",
        hover: "hover:bg-purple-50 dark:hover:bg-purple-900/40",
        today: "border-purple-600 text-purple-600 dark:text-purple-300",
      },
      green: {
        glow: "shadow-[0_0_15px_rgba(34,197,94,0.3)]",
        accent: "text-green-600",
        bgAccent: "bg-green-600 hover:bg-green-700",
        ring: "focus:ring-green-400/50",
        hover: "hover:bg-green-50 dark:hover:bg-green-900/40",
        today: "border-green-600 text-green-600 dark:text-green-300",
      },
      red: {
        glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]",
        accent: "text-red-600",
        bgAccent: "bg-red-600 hover:bg-red-700",
        ring: "focus:ring-red-400/50",
        hover: "hover:bg-red-50 dark:hover:bg-red-900/40",
        today: "border-red-600 text-red-600 dark:text-red-300",
      },
    }[colorTheme] || {
      glow: "shadow-[0_0_15px_rgba(139,92,246,0.3)]",
      accent: "text-purple-600",
      bgAccent: "bg-purple-600 hover:bg-purple-700",
      ring: "focus:ring-purple-400/50",
      hover: "hover:bg-purple-50 dark:hover:bg-purple-900/40",
      today: "border-purple-600 text-purple-600 dark:text-purple-300",
    };

  // ⛔ FIX timezone issue when displaying date
  const formatDisplayDate = (date) => {
    if (!date) return "Select date";

    const [y, m, d] = date.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++)
      days.push(new Date(year, month, d));

    return days;
  };

  // ⛔ FIX date −1 issue by NOT using .toISOString()
  const handleSelect = (date) => {
    if (!date) return;

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    const formatted = `${y}-${m}-${d}`;

    onChange({ target: { value: formatted } });
    setIsOpen(false);
  };

  const changeMonth = (dir) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + dir);
      return newDate;
    });
  };

  const isToday = (date) => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);

    return (
      date &&
      date.getDate() === t.getDate() &&
      date.getMonth() === t.getMonth() &&
      date.getFullYear() === t.getFullYear()
    );
  };

  const isSelected = (date) =>
    date &&
    selectedDate &&
    date.getDate() === selectedDate.getDate() &&
    date.getMonth() === selectedDate.getMonth() &&
    date.getFullYear() === selectedDate.getFullYear();

  const days = getDaysInMonth(currentMonth);
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className={`space-y-2 ${className}`} ref={datePickerRef}>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {React.isValidElement(label) ? label : (label || "Date")} <span className={theme.accent}>*</span>
      </label>

      {/* Input */}
      <div className="relative">
        <LuCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />

        <input
          readOnly
          value={formatDisplayDate(value)}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full pl-10 pr-4 py-2.5 rounded-xl
            bg-gray-100 dark:bg-gray-800
            border border-gray-300 dark:border-gray-700
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            cursor-pointer transition-all
            focus:outline-none focus:ring-2
            ${theme.ring}
            ${isOpen ? theme.glow : ""}
            ${error ? "border-red-400 ring-red-300/40" : ""}
            ${inputClassName}
          `}
        />

        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

        {/* Calendar Popup */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
              className="
                absolute mt-2 w-full min-w-[320px]
                bg-white/70 dark:bg-gray-800/70
                backdrop-blur-xl rounded-xl shadow-2xl
                p-4 border border-gray-200/40 dark:border-gray-700/40 z-50
              "
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => changeMonth(-1)}
                  className="p-2 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-700/60"
                >
                  <LuChevronLeft size={20} />
                </button>

                <h2 className="font-semibold text-gray-800 dark:text-white">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>

                <button
                  onClick={() => changeMonth(1)}
                  className="p-2 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-700/60"
                >
                  <LuChevronRight size={20} />
                </button>
              </div>

              {/* Week Days */}
              <div className="grid grid-cols-7 mb-2">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => (
                  <button
                    key={index}
                    disabled={!date}
                    onClick={() => handleSelect(date)}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center
                      text-sm transition-all duration-150
                      ${!date
                        ? "invisible"
                        : isSelected(date)
                          ? `${theme.bgAccent} text-white shadow-md`
                          : isToday(date)
                            ? `border ${theme.today} bg-white dark:bg-gray-800 font-semibold`
                            : `text-gray-700 dark:text-gray-300 ${theme.hover}`
                      }
                    `}
                  >
                    {date?.getDate()}
                  </button>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-300/30 dark:border-gray-600/30">
                <button
                  onClick={() => handleSelect(new Date())}
                  className="w-1/2 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 
                    text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Today
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-1/2 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 
                    text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernDatePicker;
