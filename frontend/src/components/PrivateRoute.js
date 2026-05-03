// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  // إذا ما حددنا أدوار → يسمح للكل
  if (allowedRoles.length === 0) {
    return children;
  }

  // التحقق من الدور
  if (allowedRoles.includes(user.role)) {
    return children;
  }

  // إذا الدور غير مصرح → يرجع للصفحة الرئيسية
  return <Navigate to="/" replace />;
};

export default PrivateRoute;