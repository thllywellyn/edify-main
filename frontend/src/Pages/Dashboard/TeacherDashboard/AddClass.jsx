import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../Components/Modal';
import Select from '../Components/Select';
import Input from '../Components/Input';
import Button from '../Components/Button';
import Alert from '../Components/Alert';
import DateTime from './DateTime';

const DAY = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
};

function AddClass({ onClose }) {
  const { ID } = useParams();
  const [courses, setCourses] = useState([]);
  const [CourseId, setCourseId] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allowedDays, setAllowedDays] = useState([]);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetch(`/api/course/Teacher/${ID}/enrolled`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data.data);
      } catch (error) {
        setError(error.message);
      }
    };
    getCourses();
  }, [ID]);

  useEffect(() => {
    if (CourseId) {
      const selectedCourse = courses.find(course => course._id === CourseId);
      if (selectedCourse) {
        setAllowedDays(selectedCourse.schedule.map(day => day.day));
      }
    }
  }, [CourseId, courses]);

  const addCourses = async () => {
    if (!CourseId || !date) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/course/classes/${CourseId}/create/${ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create class');
      }

      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Schedule New Class" onClose={onClose}>
      <div className="space-y-6">
        {error && <Alert type="error" message={error} />}

        <Select
          label="Select Course"
          value={CourseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">Choose a course</option>
          {courses
            .filter((course) => course.isapproved)
            .map((course) => (
              <option key={course._id} value={course._id}>
                {course.coursename.toUpperCase()} [{course.schedule.map(day => DAY[day.day]).join(', ')}]
              </option>
            ))}
        </Select>

        <div className="space-y-2">
          <label className="block text-gray-700 dark:text-gray-300">Date & Time</label>
          <DateTime setDate={setDate} allowedDays={allowedDays} />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={addCourses}
            isLoading={isLoading}
            disabled={!CourseId || !date}
          >
            Schedule Class
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AddClass;
