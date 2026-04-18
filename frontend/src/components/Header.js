// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        {/* Logo / Titre du site */}
        <Link className="navbar-brand fw-bold" to="/">
          Gestion Club Sportif
        </Link>

        {/* Menu de navigation */}
        <div className="navbar-nav ms-auto">
          <Link className="nav-link active" to="/">Accueil</Link>
          <Link className="nav-link" to="/members">Membres</Link>
          <Link className="nav-link" to="/abonnements">Abonnements</Link>
          <Link className="nav-link" to="/seances">Séances</Link>
          <Link className="nav-link" to="/presence">Présence</Link>
          <Link className="nav-link" to="/paiements">Paiements</Link>
          <Link className="nav-link" to="/rapports">Rapports</Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;