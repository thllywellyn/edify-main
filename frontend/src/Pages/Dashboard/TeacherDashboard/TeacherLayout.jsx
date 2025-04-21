import React from 'react';
import CommonDashboard from '../Common/CommonDashboard';
import DashboardErrorBoundary from '../Common/DashboardErrorBoundary';

function TeacherLayout() {
  return (
    <DashboardErrorBoundary>
      <CommonDashboard userType="Teacher" />
    </DashboardErrorBoundary>
  );
}

export default TeacherLayout;