import React from 'react';
import { Outlet } from 'react-router-dom';
import CommonDashboard from './CommonDashboard';

function StudentDashboardLayout() {
  return (
    <>
      <CommonDashboard userType="Student" />
      <Outlet />
    </>
  );
}

export default StudentDashboardLayout;