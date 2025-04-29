import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const AdminIndex = () => {
  const { data } = useParams();
  return <Navigate to={`/admin/${data}`} replace />;
};

export default AdminIndex;