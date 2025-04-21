import React from 'react';
import CommonDashboard from '../Common/CommonDashboard';
import DashboardErrorBoundary from '../Common/DashboardErrorBoundary';

function StudentLayout() {
  return (
    <DashboardErrorBoundary>
      <CommonDashboard userType="Student" />
    </DashboardErrorBoundary>
  );
}

export default StudentLayout;