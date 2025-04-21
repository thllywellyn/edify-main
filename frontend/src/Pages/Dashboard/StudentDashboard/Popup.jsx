import React, { useState, useEffect } from 'react';
import Modal from '../Components/Modal';

function Popup({ onClose, subject, allSubject }) {
  const [details, setDetails] = useState({});
  const [teacherDetails, setTeacherDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const actualDetails = await allSubject?.filter(res => res._id === subject._id);
      setDetails(actualDetails[0]?.enrolledteacher);
    };
    fetchData();
  }, [details, subject, allSubject]);

  useEffect(() => {
    const getData = async () => {
      if (!details?.Teacherdetails) return;

      const data = await fetch('/api/teacher/teacherdocuments', {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teacherID: details.Teacherdetails }),
      });
      const res = await data.json();
      setTeacherDetails(res.data);
    };
    getData();
  }, [details]);

  return (
    <Modal title={subject.coursename.toUpperCase()} onClose={onClose}>
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 dark:bg-[#042439] rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Course Description</h4>
          <p className="mt-1 text-gray-900 dark:text-white">{subject.description}</p>
        </div>

        {details && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-[#042439] rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Teacher</h4>
              <p className="mt-1 text-gray-900 dark:text-white">
                {details.Firstname} {details.Lastname}
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-[#042439] rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</h4>
              <p className="mt-1 text-gray-900 dark:text-white">{details.Email}</p>
            </div>

            {teacherDetails && (
              <div className="p-4 bg-gray-50 dark:bg-[#042439] rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience</h4>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {teacherDetails.Experience} years
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default Popup;