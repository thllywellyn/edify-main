import React, { useState, useEffect } from 'react';
import Input from '../Components/Input';
import Alert from '../Components/Alert';

function DateTime({ setDate, allowedDays = [] }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState('');

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (selectedDate && selectedTime) {
      const dateObj = new Date(selectedDate);
      const day = dateObj.getDay();

      if (!allowedDays.includes(day)) {
        setError('This day is not in the course schedule');
        setDate('');
        return;
      }

      setError('');
      const datetime = `${selectedDate}T${selectedTime}:00`;
      setDate(datetime);
    } else {
      setDate('');
    }
  }, [selectedDate, selectedTime, allowedDays, setDate]);

  return (
    <div className="space-y-4">
      {error && <Alert type="error" message={error} />}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Date"
          value={selectedDate}
          min={today}
          onChange={(e) => setSelectedDate(e.target.value)}
          error={error && 'Please select a valid date'}
        />

        <Input
          type="time"
          label="Time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          error={error && 'Please select a valid time'}
          disabled={!selectedDate}
        />
      </div>

      {selectedDate && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Selected: {new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
          {selectedTime && ` at ${selectedTime}`}
        </p>
      )}
    </div>
  );
}

export default DateTime;
