// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Layout       from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Auth
import HomePage      from './pages/HomePage';
import Login         from './pages/Login';
import Register      from './pages/Register';
import ResetPassword from './pages/ResetPassword';

// Pages communes
import Members     from './pages/Members';
import Seances     from './pages/Seance';
import Presence    from './pages/Presence';
import Paiements   from './pages/Paiements';
import Abonnements from './pages/Abonnements';
import Rapports    from './pages/Rapports';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfil from './pages/admin/adminProfil';
import ProfilsCoachs  from './pages/admin/coaches/ProfilsCoachs';
import AjouterCoach   from './pages/admin/coaches/AjouterCoach';
import ModifierCoach  from './pages/admin/coaches/ModifierCoach';
import ProfilCoach    from './pages/admin/coaches/ProfilCoach';
import Staff          from './pages/staff';

// Reception
import ReceptionDashboard from './pages/reception/ReceptionDashboard';

// Coach
import CoachDashboard from './pages/coach/CoachDashboard';
import MesSeances     from './pages/coach/MesSeances';
import MesMembres     from './pages/coach/MesMembres';
import MonProfilCoach from './pages/coach/MonProfilCoach';


// Membre
import MembreDashboard from './pages/membre/MembreDashboard';
import MonProfil       from './pages/membre/MonProfil';
import MonAbonnement   from './pages/membre/MonAbonnement';
import MesPaiements    from './pages/membre/MesPaiements';
import Paiement        from './pages/Paiement';
import Shop            from './pages/Shop';

// Profil détaillé
import ProfilMembre from './pages/ProfilMembre';

const WithLayout = ({ children }) => <Layout>{children}</Layout>;

function RoleRedirect() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.role === 'admin')     return <Navigate to="/admin/dashboard"     replace />;
  if (user.role === 'reception') return <Navigate to="/reception/dashboard" replace />;
  if (user.role === 'coach')     return <Navigate to="/coach/dashboard"     replace />;
  if (user.role === 'membre')    return <Navigate to="/membre/dashboard"    replace />;
  return <Navigate to="/login" replace />;
}

function App() {
  useEffect(() => {
    document.title = "FITCLUB 💪";
  }, []);

  return (
    <Router>
      <Routes>

        {/* ── Publiques ── */}
        <Route path="/"               element={<HomePage />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard"      element={<PrivateRoute><RoleRedirect /></PrivateRoute>} />

        {/* ══ ADMIN ══ */}
        <Route path="/admin/dashboard" element={
          <PrivateRoute allowedRoles={['admin']}>
            <WithLayout><AdminDashboard /></WithLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/profil" element={
  <PrivateRoute allowedRoles={['admin']}>
    <WithLayout><AdminProfil /></WithLayout>  // ← PascalCase!
  </PrivateRoute>
} />

        {/* ✅ Coachs — ordre important: routes fixes AVANT :id */}
        <Route path="/admin/coachs" element={
          <PrivateRoute allowedRoles={['admin']}>
            <WithLayout><ProfilsCoachs /></WithLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/coachs/ajouter" element={
          <PrivateRoute allowedRoles={['admin']}>
            <WithLayout><AjouterCoach /></WithLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/coachs/modifier/:id" element={
          <PrivateRoute allowedRoles={['admin']}>
            <WithLayout><ModifierCoach /></WithLayout>
          </PrivateRoute>
        } />
        {/* ✅ :id EN DERNIER pour éviter le conflit avec /ajouter et /modifier */}
        <Route path="/admin/coachs/:id" element={
          <PrivateRoute allowedRoles={['admin']}>
            <WithLayout><ProfilCoach /></WithLayout>
          </PrivateRoute>
        } />

        <Route path="/admin/staff" element={
          <PrivateRoute allowedRoles={['admin']}>
            <WithLayout><Staff /></WithLayout>
          </PrivateRoute>
        } />

        {/* ══ RÉCEPTION ══ */}
        <Route path="/reception/dashboard" element={
          <PrivateRoute allowedRoles={['reception']}>
            <WithLayout><ReceptionDashboard /></WithLayout>
          </PrivateRoute>
        } />

        {/* ══ COACH ══ */}
        <Route path="/coach/dashboard" element={
          <PrivateRoute allowedRoles={['coach']}>
            <WithLayout><CoachDashboard /></WithLayout>
          </PrivateRoute>
        } />
        <Route path="/coach/seances" element={
          <PrivateRoute allowedRoles={['coach']}>
            <WithLayout><MesSeances /></WithLayout>
          </PrivateRoute>
        } />
        <Route path="/coach/membres" element={
          <PrivateRoute allowedRoles={['coach']}>
            <WithLayout><MesMembres /></WithLayout>
          </PrivateRoute>
        } />
        <Route path="/coach/profil" element={
          <PrivateRoute allowedRoles={['coach']}>
            <WithLayout><MonProfilCoach /></WithLayout>
          </PrivateRoute>
        } />

        {/* ══ MEMBRE ══ */}
        <Route path="/membre/dashboard" element={
          <PrivateRoute allowedRoles={['membre']}>
            <WithLayout><MembreDashboard /></WithLayout>
          </PrivateRoute>
        } />
        <Route path="/membre/profil" element={
          <PrivateRoute allowedRoles={['membre']}>
            <WithLayout><MonProfil /></WithLayout>
          </PrivateRoute>
        } />
        <Route path="/membre/abonnement" element={
          <PrivateRoute allowedRoles={['membre']}>
            <WithLayout><MonAbonnement /></WithLayout>
          </PrivateRoute>
        } />
        <Route path="/membre/paiements" element={
          <PrivateRoute allowedRoles={['membre']}>
            <WithLayout><MesPaiements /></WithLayout>
          </PrivateRoute>
        } />
        <Route path="/membre/paiement-carte" element={
          <PrivateRoute allowedRoles={['membre']}>
            <WithLayout><Paiement /></WithLayout>
          </PrivateRoute>
        } />
        <Route path="/shop" element={
          <PrivateRoute allowedRoles={['admin', 'reception', 'membre']}>
            <WithLayout><Shop /></WithLayout>
          </PrivateRoute>
        } />

        {/* ══ ADMIN + RÉCEPTION ══ */}
        <Route path="/members" element={
          <PrivateRoute allowedRoles={['admin', 'reception']}>
            <WithLayout><Members /></WithLayout>
          </PrivateRoute>
        } />
        <Route path="/membres/:id" element={
          <PrivateRoute allowedRoles={['admin', 'reception']}>
            <WithLayout><ProfilMembre /></WithLayout>
          </PrivateRoute>
        } />
        <Route path="/abonnements" element={
          <PrivateRoute allowedRoles={['admin', 'reception']}>
            <WithLayout><Abonnements /></WithLayout>
          </PrivateRoute>
        } />
        <Route path="/paiements" element={
          <PrivateRoute allowedRoles={['admin', 'reception']}>
            <WithLayout><Paiements /></WithLayout>
          </PrivateRoute>
        } />

        {/* ══ ADMIN + RÉCEPTION + COACH ══ */}
        <Route path="/seances" element={
          <PrivateRoute allowedRoles={['admin', 'reception', 'coach']}>
            <WithLayout><Seances /></WithLayout>
          </PrivateRoute>
        } />
        <Route path="/presence" element={
          <PrivateRoute allowedRoles={['admin', 'reception', 'coach']}>
            <WithLayout><Presence /></WithLayout>
          </PrivateRoute>
        } />

        {/* ══ ADMIN ONLY ══ */}
        <Route path="/rapports" element={
          <PrivateRoute allowedRoles={['admin']}>
            <WithLayout><Rapports /></WithLayout>
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;