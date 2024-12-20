"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/app/themes/themeContext/themeContext";

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, className }) => {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showYearSelect, setShowYearSelect] = useState(false);
  const yearSelectRef = useRef<HTMLDivElement>(null);
  const currentYearRef = useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();

  // Initialize date after component mounts to avoid hydration mismatch
  useEffect(() => {
    setCurrentDate(new Date());
    setMounted(true);
  }, []);

  // Theme classes mapping
  const themeClasses: { [key: string]: { bg: string; hover: string; text: string } } = {
    red: { bg: "bg-red-500", hover: "hover:bg-red-600", text: "text-red-500" },
    yellow: { bg: "bg-yellow-500", hover: "hover:bg-yellow-600", text: "text-yellow-500" },
    blue: { bg: "bg-blue-500", hover: "hover:bg-blue-600", text: "text-blue-500" },
    green: { bg: "bg-green-500", hover: "hover:bg-green-600", text: "text-green-500" }
  };

  const currentTheme = themeClasses[theme] || themeClasses.blue;

  // Helper functions
  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate!.getFullYear(), currentDate!.getMonth() - 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate!.getFullYear(), currentDate!.getMonth() + 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate!.getMonth() &&
      today.getFullYear() === currentDate!.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return selectedDate?.getDate() === day &&
           selectedDate?.getMonth() === currentDate!.getMonth() &&
           selectedDate?.getFullYear() === currentDate!.getFullYear();
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate!.getFullYear(), currentDate!.getMonth(), day);
    setSelectedDate(newDate);
    onDateSelect?.(newDate);
  };

  const handleYearSelect = (year: number) => {
    setCurrentDate(new Date(year, currentDate!.getMonth(), 1));
    setShowYearSelect(false);
  };

  const generateYearOptions = () => {
    if (!currentDate) return [];
    const currentYear = currentDate.getFullYear();
    const years = [];
    for (let i = currentYear - 100; i <= currentYear + 100; i++) {
      years.push(i);
    }
    return years;
  };

  // Close year select when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (yearSelectRef.current && !yearSelectRef.current.contains(event.target as Node)) {
        setShowYearSelect(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll to current year when dropdown opens
  useEffect(() => {
    if (showYearSelect && currentYearRef.current) {
      currentYearRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [showYearSelect]);

  const renderDays = () => {
    if (!currentDate) return [];
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const offset = firstDayOfMonth(currentDate);

    // Padding for the first week
    for (let i = 0; i < offset; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className="h-10 text-gray-400 dark:text-gray-600 transition-colors duration-200"
        />
      );
    }

    // Actual days
    for (let day = 1; day <= totalDays; day++) {
      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            h-10 flex items-center justify-center rounded-full cursor-pointer
            transition-all duration-300 ease-in-out transform
            ${isSelected(day) 
              ? `${currentTheme.bg} text-white scale-105 shadow-md dark:shadow-lg dark:shadow-black/30` 
              : isToday(day)
                ? `border-2 ${currentTheme.text} font-bold dark:border-opacity-50`
                : 'hover:scale-105 hover:shadow-sm dark:hover:shadow-black/20 dark:text-gray-200'}
            ${!isSelected(day) && `hover:${currentTheme.hover} hover:text-white`}
          `}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  // Early return while not mounted to avoid hydration mismatch
  if (!mounted || !currentDate) {
    return <div className={`w-[350px] h-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-lg animate-pulse`} />;
  }

  return (
    <div className={`
      bg-white dark:bg-gray-800 
      rounded-xl shadow-lg dark:shadow-xl dark:shadow-black/20
      p-6 transition-all duration-300 ease-in-out 
      hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/30 w-[350px]
      ${className}
    `}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 gap-5">
        <button
          onClick={prevMonth}
          className={`
            p-2 rounded-lg transition-all duration-200 ease-in-out
            transform hover:scale-105 hover:shadow-md dark:hover:shadow-black/30
            ${currentTheme.bg} text-white
          `}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="relative" ref={yearSelectRef}>
          <button
            onClick={() => setShowYearSelect(!showYearSelect)}
            className="text-xl font-bold text-gray-800 dark:text-gray-100 hover:opacity-80 transition-opacity duration-200 flex items-center gap-2"
          >
            <span>{currentDate.toLocaleString("default", { month: "long" })}</span>
            <span className="mx-1">{currentDate.getFullYear()}</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${showYearSelect ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {showYearSelect && (
            <div className="absolute z-10 mt-2 py-2 w-44 max-h-60 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-xl dark:shadow-black/20 top-full left-1/2 transform -translate-x-1/2
              overflow-y-auto
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-gray-200
              [&::-webkit-scrollbar-thumb]:rounded-full
              dark:[&::-webkit-scrollbar-thumb]:bg-gray-700
              hover:[&::-webkit-scrollbar-thumb]:bg-gray-300
              dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600
              [&::-webkit-scrollbar-thumb]:transition-colors
              [&::-webkit-scrollbar-thumb]:duration-200"
            >
              {generateYearOptions().map((year) => (
                <button
                  key={year}
                  ref={year === currentDate.getFullYear() ? currentYearRef : null}
                  onClick={() => handleYearSelect(year)}
                  className={`
                    w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700
                    transition-colors duration-150 ease-in-out
                    ${year === currentDate.getFullYear() 
                      ? `${currentTheme.text} font-bold` 
                      : 'text-gray-700 dark:text-gray-300'}
                  `}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={nextMonth}
          className={`
            p-2 rounded-lg transition-all duration-200 ease-in-out
            transform hover:scale-105 hover:shadow-md dark:hover:shadow-black/30
            ${currentTheme.bg} text-white
          `}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Days of the Week */}
      <div className="grid grid-cols-7 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">{renderDays()}</div>
    </div>
  );
};

export default Calendar;
