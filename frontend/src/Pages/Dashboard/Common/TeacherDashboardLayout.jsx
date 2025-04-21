import React from 'react';
import CommonDashboard from './CommonDashboard';
import DashboardErrorBoundary from './DashboardErrorBoundary';

function TeacherDashboardLayout() {
  return (
    <DashboardErrorBoundary>
      <CommonDashboard userType="Teacher" />
    </DashboardErrorBoundary>
  );
}

export default TeacherDashboardLayout;