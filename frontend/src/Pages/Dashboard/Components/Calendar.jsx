import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaCircle } from 'react-icons/fa';

const Calendar = ({
  events = [],
  onDateSelect,
  highlightedDates = [],
  className = ''
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year, month, day) => {
    return new Date(year, month, day).toISOString().split('T')[0];
  };

  const isToday = (year, month, day) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const isHighlighted = (year, month, day) => {
    const dateStr = formatDate(year, month, day);
    return highlightedDates.includes(dateStr);
  };

  const getEventsForDate = (year, month, day) => {
    const dateStr = formatDate(year, month, day);
    return events.filter(event => event.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className={`bg-white dark:bg-[#0a3553] rounded-lg shadow ${className}`}>
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {month} {year}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#042439] rounded-full"
          >
            <FaChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#042439] rounded-full"
          >
            <FaChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="px-4 py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#042439]"
          >
            {day}
          </div>
        ))}

        {[...Array(firstDayOfMonth)].map((_, index) => (
          <div
            key={`empty-${index}`}
            className="bg-gray-50 dark:bg-[#042439] px-4 py-3"
          />
        ))}

        {[...Array(daysInMonth)].map((_, index) => {
          const day = index + 1;
          const dateEvents = getEventsForDate(year, currentDate.getMonth(), day);
          const isHighlightedDate = isHighlighted(year, currentDate.getMonth(), day);
          const isTodayDate = isToday(year, currentDate.getMonth(), day);

          return (
            <button
              key={day}
              onClick={() => onDateSelect(formatDate(year, currentDate.getMonth(), day))}
              className={`relative px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#042439] focus:z-10 focus:outline-none
                ${isTodayDate ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-[#0a3553]'}
              `}
            >
              <time
                dateTime={formatDate(year, currentDate.getMonth(), day)}
                className={`flex h-6 w-6 items-center justify-center rounded-full text-sm
                  ${isTodayDate ? 'bg-[#4E84C1] text-white' : 'text-gray-900 dark:text-white'}
                  ${isHighlightedDate ? 'font-bold' : ''}
                `}
              >
                {day}
              </time>
              {dateEvents.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {dateEvents.map((event, eventIndex) => (
                    <FaCircle
                      key={eventIndex}
                      className="h-1.5 w-1.5 text-[#4E84C1]"
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

// Example usage:
// const events = [
//   { date: '2025-04-21', title: 'Class A' },
//   { date: '2025-04-22', title: 'Class B' }
// ];
// const highlightedDates = ['2025-04-25', '2025-04-26'];