import React, { useState, useEffect } from 'react';
import { getPaiements, addPaiement, markPaiementPaye, getMembers, getAbonnementsParMembre } from '../services/api';

function Paiements() {
  const [paiements, setPaiements] = useState([]);
  const [membres, setMembres] = useState([]);
  const [abonnements, setAbonnements] = useState([]);
  const [selectedMembre, setSelectedMembre] = useState('');
  const [filterMembre, setFilterMembre] = useState('');
  const [filterStatut, setFilterStatut] = useState('');

  const [formData, setFormData] = useState({
    montant: '',
    date_paiement: new Date().toISOString().split('T')[0],
    mode_paiement: 'Espèces',
    statut: 'Payé',
    id_abonnement: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const isAdmin = user?.role === 'admin';

  // Definition dyal Style li kan naqas
  const lightInputStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#ced4da'
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [membresRes, paiementsRes] = await Promise.all([
          getMembers(),
          getPaiements()
        ]);
        setMembres(membresRes.data || []);
        setPaiements(paiementsRes.data || []);
      } catch (err) {
        setError('Erreur de chargement des données.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedMembre) {
      getAbonnementsParMembre(selectedMembre).then(res => {
        setAbonnements(res.data || []);
      });
    } else {
      setAbonnements([]);
    }
  }, [selectedMembre]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAbonnementChange = (e) => {
    const idAbo = e.target.value;
    setFormData({ ...formData, id_abonnement: idAbo });
    const selectedAbo = abonnements.find(a => a.id_abonnement === parseInt(idAbo));
    if (selectedAbo) {
      setFormData(prev => ({ ...prev, montant: selectedAbo.prix }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPaiement(formData);
      alert('Paiement enregistré !');
      setFormData({
        montant: '',
        date_paiement: new Date().toISOString().split('T')[0],
        mode_paiement: 'Espèces',
        statut: 'Payé',
        id_abonnement: '',
      });
      const res = await getPaiements();
      setPaiements(res.data || []);
    } catch (err) {
      alert('Erreur lors de l’enregistrement');
    }
  };

  const handleMarkPaye = async (id) => {
    try {
      await markPaiementPaye(id);
      const res = await getPaiements();
      setPaiements(res.data || []);
    } catch (err) {
      alert('Erreur de mise à jour');
    }
  };

  const totalPaye = paiements.filter(p => p.statut === 'Payé').reduce((sum, p) => sum + Number(p.montant), 0);
  const totalEnAttente = paiements.filter(p => p.statut === 'En attente').reduce((sum, p) => sum + Number(p.montant), 0);

  const filteredPaiements = paiements.filter(p => {
    const matchMembre = filterMembre ? p.nom_membre?.toLowerCase().includes(filterMembre.toLowerCase()) : true;
    const matchStatut = filterStatut ? p.statut === filterStatut : true;
    return matchMembre && matchStatut;
  });

  if (loading) return <div className="text-center mt-5 text-white">Chargement en cours...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-white">Gestion des Paiements</h2>

      {/* Totaux - Affiché une seule fois pour tout le monde ou admin selon ton choix */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card text-white bg-success shadow border-0">
            <div className="card-body">
              <h5>Total Récupéré</h5>
              <h3>{totalPaye.toFixed(2)} DH</h3>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card text-white bg-warning shadow border-0">
            <div className="card-body text-dark">
              <h5>Total En Attente</h5>
              <h3>{totalEnAttente.toFixed(2)} DH</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="row mb-4 g-2">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            style={lightInputStyle}
            placeholder="Chercher par nom..."
            value={filterMembre}
            onChange={(e) => setFilterMembre(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select className="form-select" style={lightInputStyle} value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="Payé">Payé</option>
            <option value="En attente">En attente</option>
          </select>
        </div>
      </div>

      {/* Formulaire (Admin only or anyone) */}
      {isAdmin && (
        <div className="card mb-5 shadow border-0">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">Nouvelle Transaction</h5>
          </div>
          <div className="card-body bg-light">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Membre</label>
                  <select className="form-select" value={selectedMembre} onChange={(e) => setSelectedMembre(e.target.value)} required>
                    <option value="">-- Choisir --</option>
                    {membres.map(m => <option key={m.id_personne} value={m.id_personne}>{m.nom} {m.prenom}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Abonnement</label>
                  <select className="form-select" name="id_abonnement" value={formData.id_abonnement} onChange={handleAbonnementChange} required disabled={!selectedMembre}>
                    <option value="">-- Choisir --</option>
                    {abonnements.map(a => <option key={a.id_abonnement} value={a.id_abonnement}>{a.type} ({a.prix} DH)</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Montant (DH)</label>
                  <input type="number" name="montant" className="form-control" value={formData.montant} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Mode</label>
                  <select name="mode_paiement" className="form-select" value={formData.mode_paiement} onChange={handleChange}>
                    <option>Espèces</option>
                    <option>Carte</option>
                    <option>Virement</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Statut</label>
                  <select name="statut" className="form-select" value={formData.statut} onChange={handleChange}>
                    <option value="Payé">Payé</option>
                    <option value="En attente">En attente</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-4 w-100">Enregistrer</button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover bg-white">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Membre</th>
              <th>Abonnement</th>
              <th>Montant</th>
              <th>Mode</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPaiements.map(p => (
              <tr key={p.id_paiement}>
                <td>{p.date_paiement}</td>
                <td>{p.nom_membre}</td>
                <td>{p.type_abonnement}</td>
                <td><strong>{p.montant} DH</strong></td>
                <td>{p.mode_paiement}</td>
                <td>
                  <span className={`badge ${p.statut === 'Payé' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {p.statut}
                  </span>
                </td>
                <td>
                  {p.statut === 'En attente' && isAdmin && (
                    <button className="btn btn-outline-primary btn-sm" onClick={() => handleMarkPaye(p.id_paiement)}>
                      Valider
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Paiements;