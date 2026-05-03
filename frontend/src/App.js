// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 

import Header from './components/Header';
import Home from './pages/Home';
import Members from './pages/Members';
import Seances from './pages/Seances';
import Presence from './pages/Presence';
import Paiements from './pages/Paiements';
import Abonnements from './pages/Abonnements';
import Rapports from './pages/Rapports';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Header />
              <Home />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/members" 
          element={
            <PrivateRoute>
              <Header />
              <Members />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/abonnements" 
          element={
            <PrivateRoute>
              <Header />
              <Abonnements />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/seances" 
          element={
            <PrivateRoute allowedRoles={['admin', 'reception', 'coach']}>
              <Header />
              <Seances />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/presence" 
          element={
            <PrivateRoute allowedRoles={['admin', 'reception', 'coach']}>
              <Header />
              <Presence />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/paiements" 
          element={
            <PrivateRoute allowedRoles={['admin', 'reception']}>
              <Header />
              <Paiements />
            </PrivateRoute>
          } 
        />

        <Route 
  path="/rapports" 
  element={
    <PrivateRoute allowedRoles={['admin']}>
      <Header />
      <Rapports />
    </PrivateRoute>
  } 
/>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;