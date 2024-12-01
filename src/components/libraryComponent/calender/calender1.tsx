import React, { useState } from "react";

interface PropType {
  date: Date;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper functions
  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const offset = firstDayOfMonth(currentDate);

    // Padding for the first week
    for (let i = 0; i < offset; i++) {
      days.push(<div key={`empty-${i}`} className="text-gray-400"></div>);
    }

    // Actual days
    for (let day = 1; day <= totalDays; day++) {
      days.push(
        <div
          key={day}
          className="p-2 text-center border rounded-md cursor-pointer hover:bg-blue-100"
        >
          {day}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Prev
        </button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* Days of the Week */}
      <div className="grid grid-cols-7 text-center font-medium mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
    </div>
  );
};

export default Calendar;
