import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileCard from '../Components/ProfileCard';

function TeacherDashboard() {
  const { ID } = useParams();
  const [data, setdata] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/Teacher/TeacherDocument/${ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const user = await response.json();
        setdata(user.data);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, [ID]);

  return (
    <div className="space-y-6">
      <ProfileCard user={data} userType="Teacher" />
    </div>
  );
}

export default TeacherDashboard;