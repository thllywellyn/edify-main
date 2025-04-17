import React from 'react';
import { Outlet } from 'react-router-dom';
import CommonDashboard from './CommonDashboard';

function TeacherDashboardLayout() {
  return (
    <>
      <CommonDashboard userType="Teacher" />
      <Outlet />
    </>
  );
}

export default TeacherDashboardLayout;