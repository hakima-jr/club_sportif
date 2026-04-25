import React, { useState, useEffect } from 'react';
import { getPaiements, addPaiement, markPaiementPaye } from '../services/api';

function Paiements() {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterMembre, setFilterMembre] = useState('');
  const [filterStatut, setFilterStatut] = useState('');

  const [formData, setFormData] = useState({
    montant: '',
    date_paiement: new Date().toISOString().split('T')[0],
    mode_paiement: 'Espèces',
    statut: 'Payé',
    id_abonnement: '',
  });

  // --- STYLES FIXES ---
  const lightInputStyle = { 
    backgroundColor: "#ffffff", 
    color: "#000000", 
    border: "1px solid #ced4da" 
  };

  const tableCellStyle = { 
    color: "#000000", 
    backgroundColor: "#ffffff",
    verticalAlign: "middle" 
  };

  const fetchPaiements = async () => {
    try {
      const res = await getPaiements();
      setPaiements(res.data || []);
      setLoading(false);
    } catch (err) {
      setError('Erreur chargement des paiements');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaiements();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      fetchPaiements();
    } catch (err) {
      alert('Erreur ajout paiement');
    }
  };

  const handleMarkPaye = async (id) => {
    try {
      await markPaiementPaye(id);
      alert('Paiement marqué comme Payé !');
      fetchPaiements();
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    }
  };

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

      {/* Résumé rapide */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-white bg-success shadow">
            <div className="card-body">
              <h5>Total Payé</h5>
              <h3>{totalPaye.toFixed(2)} DH</h3>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-white bg-warning shadow">
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

      {/* Formulaire ajout */}
      <div className="card mb-5 shadow" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Enregistrer un paiement</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label style={{ color: "#fff" }}>Montant (DH)</label>
                <input type="number" step="0.01" name="montant" className="form-control" style={lightInputStyle} value={formData.montant} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label style={{ color: "#fff" }}>Date</label>
                <input type="date" name="date_paiement" className="form-control" style={lightInputStyle} value={formData.date_paiement} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label style={{ color: "#fff" }}>Mode</label>
                <select name="mode_paiement" className="form-select" style={lightInputStyle} value={formData.mode_paiement} onChange={handleChange}>
                  <option>Espèces</option>
                  <option>Carte</option>
                  <option>Virement</option>
                  <option>Mobile Money</option>
                </select>
              </div>
              <div className="col-md-6">
                <label style={{ color: "#fff" }}>Statut</label>
                <select name="statut" className="form-select" style={lightInputStyle} value={formData.statut} onChange={handleChange}>
                  <option>Payé</option>
                  <option>En attente</option>
                  <option>Annulé</option>
                </select>
              </div>
              <div className="col-md-6">
                <label style={{ color: "#fff" }}>ID Abonnement</label>
                <input type="number" name="id_abonnement" className="form-control" style={lightInputStyle} value={formData.id_abonnement} onChange={handleChange} required />
              </div>
            </div>
            <div className="mt-4 text-end">
              <button type="submit" className="btn btn-success px-4">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>

      {/* Liste filtrée */}
      <h4 className="mb-3" style={{ color: "#fff" }}>Liste des paiements</h4>
      <div className="table-responsive shadow-sm" style={{ borderRadius: "10px", overflow: "hidden" }}>
        <table className="table table-hover mb-0">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Montant</th>
              <th>Date</th>
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
                <td style={tableCellStyle}>{p.id_paiement}</td>
                <td style={tableCellStyle}>{p.montant} DH</td>
                <td style={tableCellStyle}>{p.date_paiement}</td>
                <td style={tableCellStyle}>{p.mode_paiement}</td>
                <td style={tableCellStyle}>{p.statut}</td>
                <td style={tableCellStyle}>{p.type_abonnement || '-'}</td>
                <td style={tableCellStyle}>{p.nom_membre || '-'}</td>
                <td style={tableCellStyle}>
                  {p.statut === 'En attente' && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleMarkPaye(p.id_paiement)}>
                      Marquer Payé
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