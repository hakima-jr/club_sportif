// src/pages/Paiements.jsx
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
    statut: 'Payé',           // ← Statut موجود وواضح
    id_abonnement: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les membres + paiements
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
        setError('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Charger abonnements عند اختيار عضو
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

  // عند اختيار اشتراك → يملأ المبلغ تلقائياً
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
      alert('Paiement enregistré avec succès !');
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
      alert('Paiement marqué comme Payé !');
      const res = await getPaiements();
      setPaiements(res.data || []);
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    }
  };

  // Calcul des totaux
  const totalPaye = paiements
    .filter(p => p.statut === 'Payé')
    .reduce((sum, p) => sum + Number(p.montant), 0);

  const totalEnAttente = paiements
    .filter(p => p.statut === 'En attente')
    .reduce((sum, p) => sum + Number(p.montant), 0);

  const filteredPaiements = paiements.filter(p => {
    const matchMembre = filterMembre ? p.nom_membre?.toLowerCase().includes(filterMembre.toLowerCase()) : true;
    const matchStatut = filterStatut ? p.statut === filterStatut : true;
    return matchMembre && matchStatut;
  });

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center" style={{ color: "#ffffff" }}>Gestion des Paiements</h2>

      {/* Totaux */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-white bg-success shadow border-0">
            <div className="card-body">
              <h5>Total Payé</h5>
              <h3>{totalPaye.toFixed(2)} DH</h3>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-white bg-warning shadow border-0">
            <div className="card-body">
              <h5>Total En Attente</h5>
              <h3>{totalEnAttente.toFixed(2)} DH</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            style={lightInputStyle}
            placeholder="Filtrer par nom du membre"
            value={filterMembre}
            onChange={(e) => setFilterMembre(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            style={lightInputStyle}
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="Payé">Payé</option>
            <option value="En attente">En attente</option>
            <option value="Annulé">Annulé</option>
          </select>
        </div>
      </div>

      {/* Formulaire */}
      <div className="card mb-5 shadow">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Enregistrer un paiement</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Membre</label>
                <select 
                  className="form-select" 
                  value={selectedMembre} 
                  onChange={(e) => setSelectedMembre(e.target.value)}
                  required
                >
                  <option value="">-- Choisir un membre --</option>
                  {membres.map(m => (
                    <option key={m.id_personne} value={m.id_personne}>
                      {m.nom} {m.prenom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Abonnement</label>
                <select 
                  name="id_abonnement"
                  className="form-select" 
                  value={formData.id_abonnement} 
                  onChange={handleAbonnementChange}
                  required
                  disabled={!selectedMembre}
                >
                  <option value="">-- Choisir un abonnement --</option>
                  {abonnements.map(a => (
                    <option key={a.id_abonnement} value={a.id_abonnement}>
                      {a.type} ({a.date_debut} → {a.date_fin})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Montant (DH)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="montant" 
                  className="form-control" 
                  value={formData.montant} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Date</label>
                <input type="date" name="date_paiement" className="form-control" value={formData.date_paiement} onChange={handleChange} required />
              </div>

              <div className="col-md-4">
                <label className="form-label">Mode de paiement</label>
                <select name="mode_paiement" className="form-select" value={formData.mode_paiement} onChange={handleChange}>
                  <option>Espèces</option>
                  <option>Carte</option>
                  <option>Virement</option>
                  <option>Mobile Money</option>
                </select>
              </div>

              {/* Statut - موجود وواضح */}
              <div className="col-md-6">
                <label className="form-label">Statut</label>
                <select name="statut" className="form-select" value={formData.statut} onChange={handleChange}>
                  <option value="Payé">Payé</option>
                  <option value="En attente">En attente</option>
                  <option value="Annulé">Annulé</option>
                </select>
              </div>
            </div>

            <div className="mt-4 text-end">
              <button type="submit" className="btn btn-success">Enregistrer le paiement</button>
            </div>
          </form>
        </div>
      </div>

      {/* Liste des paiements */}
      <h4 className="mb-3">Historique des paiements</h4>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Montant</th>
              <th>Mode</th>
              <th>Statut</th>
              <th>Abonnement</th>
              <th>Membre</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPaiements.map(p => (
              <tr key={p.id_paiement}>
                <td>{p.date_paiement}</td>
                <td>{p.montant} DH</td>
                <td>{p.mode_paiement}</td>
                <td>{p.statut}</td>
                <td>{p.type_abonnement || '-'}</td>
                <td>{p.nom_membre || '-'}</td>
                <td>
                  {p.statut === 'En attente' && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleMarkPaye(p.id_paiement)}>
                      Marquer Payé
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Paiements;
