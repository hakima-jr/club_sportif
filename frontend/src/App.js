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
import Register from './pages/Register';   // ← أضفنا هذا

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
        
        <Route path="/register" element={token ? <Navigate to="/" replace /> : <Register />} />

        <Route path="/" element={token ? <><Header /><Home /></> : <Navigate to="/login" replace />} />

        <Route path="/members" element={token ? <><Header /><Members /></> : <Navigate to="/login" replace />} />
        <Route path="/abonnements" element={token ? <><Header /><Abonnements /></> : <Navigate to="/login" replace />} />
        <Route path="/seances" element={token ? <><Header /><Seances /></> : <Navigate to="/login" replace />} />
        <Route path="/presence" element={token ? <><Header /><Presence /></> : <Navigate to="/login" replace />} />
        <Route path="/paiements" element={token ? <><Header /><Paiements /></> : <Navigate to="/login" replace />} />
        <Route path="/rapports" element={token ? <><Header /><Rapports /></> : <Navigate to="/login" replace />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;