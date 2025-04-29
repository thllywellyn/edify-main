import React, { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

function EditCourse({ course, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    coursename: course.coursename || '',
    description: course.description || '',
    price: course.price || 0,
    schedule: course.schedule || []
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60) + minutes;
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...formData.schedule];
    if (field === 'day') {
      updatedSchedule[index] = {
        ...updatedSchedule[index],
        [field]: parseInt(value)
      };
    } else {
      // Convert HH:mm to minutes for storage
      updatedSchedule[index] = {
        ...updatedSchedule[index],
        [field]: timeToMinutes(value)
      };
    }
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const addScheduleSlot = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { day: 1, starttime: 540, endtime: 600 }]
    });
  };

  const removeScheduleSlot = (index) => {
    setFormData({
      ...formData,
      schedule: formData.schedule.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.coursename.trim() || !formData.description.trim()) {
      setError('Course name and description are required');
      return;
    }

    if (formData.schedule.length === 0) {
      setError('At least one schedule slot is required');
      return;
    }

    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      await onUpdate(course._id, formData);
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to update course');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#0a3553] w-full max-w-lg mx-auto rounded-lg shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Course
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-3 space-y-3 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course Name
            </label>
            <input
              type="text"
              value={formData.coursename}
              onChange={(e) => setFormData({ ...formData, coursename: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-[#042439] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4E84C1]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-[#042439] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4E84C1]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price (₹)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
              min="1"
              className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-[#042439] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4E84C1]"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Schedule
              </label>
              <button
                type="button"
                onClick={addScheduleSlot}
                className="flex items-center px-2 py-1 text-xs bg-[#4E84C1] text-white rounded-md hover:bg-[#3a6da3]"
              >
                <FaPlus className="mr-1" /> Add Slot
              </button>
            </div>
            
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {formData.schedule.map((slot, index) => (
                <div key={index} className="grid grid-cols-[2fr,1fr,1fr,auto] gap-2 items-center">
                  <select
                    value={slot.day}
                    onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                    className="px-2 py-1.5 text-sm rounded-md bg-gray-50 dark:bg-[#042439] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  >
                    {[0,1,2,3,4,5,6].map(day => (
                      <option key={day} value={day}>
                        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][day]}
                      </option>
                    ))}
                  </select>
                  
                  <input
                    type="time"
                    value={minutesToTime(slot.starttime)}
                    onChange={(e) => handleScheduleChange(index, 'starttime', e.target.value)}
                    className="px-2 py-1.5 text-sm rounded-md bg-gray-50 dark:bg-[#042439] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                  
                  <input
                    type="time"
                    value={minutesToTime(slot.endtime)}
                    onChange={(e) => handleScheduleChange(index, 'endtime', e.target.value)}
                    className="px-2 py-1.5 text-sm rounded-md bg-gray-50 dark:bg-[#042439] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                  
                  <button
                    type="button"
                    onClick={() => removeScheduleSlot(index)}
                    className="p-1.5 text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-xs">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#042439] rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-3 py-1.5 text-sm font-medium text-white bg-[#4E84C1] hover:bg-[#3a6da3] rounded-md transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCourse;