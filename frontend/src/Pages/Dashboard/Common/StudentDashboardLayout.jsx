import React from 'react';
import CommonDashboard from './CommonDashboard';
import DashboardErrorBoundary from './DashboardErrorBoundary';

function StudentDashboardLayout() {
  return (
    <DashboardErrorBoundary>
      <CommonDashboard userType="Student" />
    </DashboardErrorBoundary>
  );
}

export default StudentDashboardLayout;