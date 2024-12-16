import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './authContext';

const PrivateRoute = ({ children, isAdminRoute }) => {
  const { user, token, loading } = useContext(AuthContext);

  // While loading from localStorage, show a loading spinner or placeholder
  if (loading) {
    return <div>Loading...</div>;  // You can replace this with a proper loader/spinner
  }

  // If no token or user is found, redirect to the login page
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // If it's an admin route and the user is not an admin, redirect to the member dashboard
  if (isAdminRoute && !user.isAdmin) {
    return <Navigate to="/Mdashboard" />;
  }

  // If it's a regular user route and the user is an admin, redirect to the admin dashboard
  if (!isAdminRoute && user.isAdmin) {
    return <Navigate to="/ADashboard" />;
  }

  // If the user has access, render the children components (dashboard)
  return children;
};

export default PrivateRoute;
