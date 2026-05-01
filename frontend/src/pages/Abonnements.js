// src/pages/Abonnements.jsx
import React, { useState, useEffect } from 'react';
import { getAbonnements, addAbonnement, getMembers } from '../services/api';

function Abonnements() {
  const today = new Date().toISOString().split('T')[0];

  const [abonnements, setAbonnements] = useState([]);
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    type: '',
    date_debut: today,
    date_fin: '',
    prix: '',
    id_membre: '',
  });

  const fetchAbonnements = async () => {
    try {
      const response = await getAbonnements();
      setAbonnements(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des abonnements');
    }
  };

  const fetchMembres = async () => {
    try {
      const response = await getMembers();
      setMembres(response.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchAbonnements(), fetchMembres()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addAbonnement(formData);
      alert('Abonnement ajouté avec succès !');
      
      setFormData({
        type: '',
        date_debut: today,
        date_fin: '',
        prix: '',
        id_membre: '',
      });
      
      fetchAbonnements();
    } catch (err) {
      alert('Erreur lors de l’ajout de l’abonnement');
    }
  };

  // تنسيق التاريخ (YYYY-MM-DD فقط)
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return dateString.split('T')[0];
  };

  if (loading) return <div className="text-center mt-5">Chargement...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Gestion des Abonnements</h2>

      {/* Formulaire d'ajout */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Ajouter un nouvel abonnement</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Type d’abonnement</label>
                <input type="text" name="type" className="form-control" placeholder="Mensuel, Trimestriel, Annuel..." value={formData.type} onChange={handleChange} required />
              </div>

              <div className="col-md-3">
                <label className="form-label">Date début</label>
                <input type="date" name="date_debut" className="form-control" value={formData.date_debut} min={today} onChange={handleChange} required />
              </div>

              <div className="col-md-3">
                <label className="form-label">Date fin</label>
                <input type="date" name="date_fin" className="form-control" value={formData.date_fin} onChange={handleChange} required />
              </div>

              <div className="col-md-4">
                <label className="form-label">Prix (DH)</label>
                <input type="number" name="prix" className="form-control" step="0.01" value={formData.prix} onChange={handleChange} required />
              </div>

              <div className="col-md-8">
                <label className="form-label">Membre</label>
                <select name="id_membre" className="form-select" value={formData.id_membre} onChange={handleChange} required>
                  <option value="">-- Choisir un membre --</option>
                  {membres.map(m => (
                    <option key={m.id_personne} value={m.id_personne}>
                      {m.nom} {m.prenom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 text-end">
              <button type="submit" className="btn btn-success">Enregistrer l’abonnement</button>
            </div>
          </form>
        </div>
      </div>

      {/* Liste des abonnements - مع الاسم + اللقب */}
      {abonnements.length === 0 ? (
        <div className="alert alert-info text-center">Aucun abonnement enregistré</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Date début</th>
                <th>Date fin</th>
                <th>Prix (DH)</th>
                <th>Membre</th>
              </tr>
            </thead>
            <tbody>
              {abonnements.map((abo) => (
                <tr key={abo.id_abonnement}>
                  <td>{abo.id_abonnement}</td>
                  <td>{abo.type}</td>
                  <td>{formatDate(abo.date_debut)}</td>
                  <td>{formatDate(abo.date_fin)}</td>
                  <td>{abo.prix} DH</td>
                  <td>
                    {abo.nom_membre || `Membre ID ${abo.id_membre}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Abonnements;