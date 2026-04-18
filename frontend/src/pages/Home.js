// src/pages/Home.jsx

import React from 'react';

function Home() {
  return (
    <div className="text-center mt-5">
      <h1 className="display-4 fw-bold text-primary mb-4">
        Bienvenue au Club Sportif
      </h1>
      <p className="lead text-muted">
        Gérez facilement vos membres, abonnements, paiements et séances.
      </p>
      <p className="mt-4">
        Ceci est la page d'accueil de votre application de gestion.
      </p>
    </div>
  );
}

export default Home;

/*import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4 fw-bold text-primary mb-3">
        Bienvenue dans votre Club Sportif
      </h1>
      
      <p className="lead text-secondary mb-4">
        Gérez vos membres, abonnements, paiements et planning de séances en toute simplicité.
      </p>

      <div className="row justify-content-center mb-5">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Commencez dès maintenant</h5>
              <p className="card-text">
                Accédez rapidement à toutes les fonctionnalités de votre espace de gestion.
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                <Link to="/members" className="btn btn-primary btn-lg">
                  Voir la liste des membres
                </Link>
                <Link to="/add-member" className="btn btn-outline-primary btn-lg">
                  Ajouter un nouveau membre
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-muted small">
        Application de gestion de club sportif – Version 1.0 – Décembre 2025
      </p>
    </div>
  );
}

export default Home;*/