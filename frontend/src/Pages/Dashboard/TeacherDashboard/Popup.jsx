import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../Components/Modal';

function Popup({ onClose, subject }) {
  const [desc, setDesc] = useState('');
  const { ID } = useParams();
  const dateGap = 3; // 3 hours

  const [day, setDay] = useState({
    sun: false,
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
  });

  const [dayValue, setDayValue] = useState({
    sun: '',
    mon: '',
    tue: '',
    wed: '',
    thu: '',
    fri: '',
    sat: '',
  });

  const dayIndex = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
  };

  const handleCheckboxChange = (dayName) => {
    setDay(prevDay => ({ ...prevDay, [dayName]: !prevDay[dayName] }));
  };

  const addCourse = async () => {
    const selectedDays = Object.keys(day)
      .filter(d => day[d])
      .map(d => ({
        day: dayIndex[d],
        starttime: dayValue[d] ? convertTimeToMinutes(dayValue[d]) : null,
        endtime: dayValue[d] ? convertTimeToMinutes(dayValue[d]) + dateGap * 60 : null,
      }));

    const hasMissingTime = selectedDays.some(d => d.starttime === null);

    if (hasMissingTime) {
      alert('Please fill in the time for all selected days.');
      return;
    }

    if (desc === '') {
      alert('Fill The Description');
      return;
    }

    const data = {
      coursename: subject.toLowerCase(),
      description: desc,
      time: selectedDays,
    };

    try {
      const response = await fetch(`/api/course/${subject}/create/${ID}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create course');
      }

      alert(responseData.message);
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const convertMinutesToTime = (minutes) => {
    const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
    const mins = String(minutes % 60).padStart(2, '0');
    return `${hours}:${mins}`;
  };

  return (
    <Modal title={`Create ${subject} Course`} onClose={onClose}>
      <div className="space-y-6">
        <div className="space-y-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Class Schedule</label>
          {Object.keys(day).map((d) => (
            <div
              key={d}
              className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-[#042439] rounded-lg"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={day[d]}
                  onChange={() => handleCheckboxChange(d)}
                  className="w-4 h-4 text-[#4E84C1] border-gray-300 rounded focus:ring-[#4E84C1]"
                />
                <label className="ml-2 text-gray-700 dark:text-gray-300">
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </label>
              </div>
              
              <div className="flex gap-4 flex-1">
                <input
                  type="time"
                  placeholder="Start Time"
                  value={dayValue[d]}
                  onChange={(e) => setDayValue({ ...dayValue, [d]: e.target.value })}
                  disabled={!day[d]}
                  className="flex-1 px-3 py-2 rounded-md bg-white dark:bg-[#0a3553] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4E84C1] disabled:opacity-50"
                />
                <input
                  type="time"
                  readOnly
                  placeholder="End Time"
                  value={dayValue[d] ? convertMinutesToTime(convertTimeToMinutes(dayValue[d]) + dateGap * 60) : ''}
                  disabled={!day[d]}
                  className="flex-1 px-3 py-2 rounded-md bg-white dark:bg-[#0a3553] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4E84C1] disabled:opacity-50"
                />
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Course Description
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Enter course description"
            rows={4}
            className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-[#042439] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4E84C1]"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={addCourse}
            className="px-6 py-2 bg-[#4E84C1] hover:bg-[#3a6da3] text-white rounded-lg transition-colors"
          >
            Create Course
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default Popup;

