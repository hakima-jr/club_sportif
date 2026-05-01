// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {

  const handleLogout = () => {
    localStorage.removeItem('token');
    // توجيه قوي ومباشر
    window.location.href = '/login';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Club Sportif </Link>
        
        <div className="navbar-nav me-auto">
          <Link className="nav-link" to="/">Accueil</Link>
          <Link className="nav-link" to="/members">Membres</Link>
          <Link className="nav-link" to="/abonnements">Abonnements</Link>
          <Link className="nav-link" to="/seances">Séances</Link>
          <Link className="nav-link" to="/presence">Présence</Link>
          <Link className="nav-link" to="/paiements">Paiements</Link>
          <Link className="nav-link" to="/rapports">Rapports</Link>
        </div>

        <div className="navbar-nav">
          <button 
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm px-3"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Header;