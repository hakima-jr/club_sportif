// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const isReception = user.role === 'reception';
  const isCoach = user.role === 'coach';
  const isMembre = user.role === 'membre';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">Club Sportif </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Accueil</Link></li>
            
            {/* روابط مرئية للجميع */}
            <li className="nav-item"><Link className="nav-link" to="/members">Membres</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/seances">Séances</Link></li>

            {/* روابط خاصة بـ   Admin */}
            {(isAdmin || isReception) && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/abonnements">Abonnements</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/paiements">Paiements</Link></li>
              </>
            )}

            {/* روابط خاصة بـ Coach + Réception + Admin */}
            {(isAdmin || isReception || isCoach) && (
              <li className="nav-item"><Link className="nav-link" to="/presence">Présence</Link></li>
            )}

            {/* Rapports فقط لـ Admin + Réception */}
            {(isAdmin) && (
              <li className="nav-item"><Link className="nav-link" to="/rapports">Rapports</Link></li>
            )}
          </ul>

          {/* معلومات المستخدم + Déconnexion */}
          <div className="d-flex align-items-center text-white">
            <div className="me-3 text-end">
              <small className="text-capitalize opacity-75">
                {user.role === 'admin' ? 'Administrateur' : 
                 user.role === 'reception' ? 'Réception' : 
                 user.role === 'coach' ? 'Coach' : 'Membre'}
              </small><br />
              <strong>{user.prenom} {user.nom}</strong>
            </div>
            
            <button 
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm px-3"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;