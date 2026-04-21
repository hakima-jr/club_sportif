// src/pages/Rapports.jsx
import React, { useState, useEffect } from 'react';
import { getRapports } from '../services/api';

function Rapports() {
  const [stats, setStats] = useState({
    total_membres: 0,
    abonnements_actifs: 0,
    revenus_totaux: 0,
    paiements_en_attente: 0,
    total_seances: 0,
    taux_presence_moyen: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getRapports();
        setStats(res.data);
        setLoading(false);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
        setLoading(false);
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center mt-5">Chargement des statistiques...</div>;

  if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Rapports et Statistiques</h2>

      <div className="row g-4">
        {/* Carte 1 */}
        <div className="col-md-4">
          <div className="card text-center shadow border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Membres totaux</h5>
            </div>
            <div className="card-body">
              <h3 className="display-4 fw-bold">{parseFloat(stats.revenus_totaux || 0).toFixed(2)} DH</h3>
            </div>
          </div>
        </div>

        {/* Carte 2 */}
        <div className="col-md-4">
          <div className="card text-center shadow border-success">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Abonnements actifs</h5>
            </div>
            <div className="card-body">
              <h3 className="display-5">{stats.abonnements_actifs}</h3>
            </div>
          </div>
        </div>

        {/* Carte 3 */}
        <div className="col-md-4">
          <div className="card text-center shadow border-info">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Séances programmées</h5>
            </div>
            <div className="card-body">
              <h3 className="display-4 fw-bold">{parseFloat(stats.total_seances || 0).toFixed(2)} séances</h3>
            </div>
          </div>
        </div>

        {/* Carte 4 */}
        <div className="col-md-6">
          <div className="card text-center shadow border-success">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Revenus totaux</h5>
            </div>
            <div className="card-body">
              <h3 className="display-4 fw-bold">{parseFloat(stats.revenus_totaux || 0).toFixed(2)} DH</h3>
            </div>
          </div>
        </div>

        {/* Carte 5 */}
        <div className="col-md-6">
          <div className="card text-center shadow border-warning">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">Paiements en attente</h5>
            </div>
            <div className="card-body">
              <h3 className="display-4 fw-bold">{parseFloat(stats.paiements_en_attente || 0).toFixed(2)} DH</h3>
            </div>
          </div>
        </div>

        {/* Carte 6 */}
        <div className="col-12">
          <div className="card text-center shadow border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Taux de présence moyen</h5>
            </div>
            <div className="card-body">
              <h3 className="display-4 fw-bold">{parseFloat(stats.taux_presence_moyen || 0)}%</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rapports;