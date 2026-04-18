import React, { useState, useEffect } from 'react';
import { getSeances, addSeance } from '../services/api'; // À ajouter dans api.js

function Seances() {
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    date: '',
    heure: '',
    capacite: '',
    id_sport: '',
    id_coach: '',
  });

  const fetchSeances = async () => {
    try {
      const res = await getSeances();
      setSeances(res.data);
      setLoading(false);
    } catch (err) {
      setError('Erreur chargement des séances');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeances();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSeance(formData);
      alert('Séance ajoutée !');
      setFormData({ date: '', heure: '', capacite: '', id_sport: '', id_coach: '' });
      fetchSeances();
    } catch (err) {
      alert('Erreur lors de l’ajout');
    }
  };

  if (loading) return <div className="text-center mt-5">Chargement...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Gestion des Séances Sportives</h2>

      {/* Formulaire ajout */}
      <div className="card mb-4 shadow">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Ajouter une séance</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <label>Date</label>
                <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <label>Heure</label>
                <input type="time" name="heure" className="form-control" value={formData.heure} onChange={handleChange} required />
              </div>
              <div className="col-md-2">
                <label>Capacité</label>
                <input type="number" name="capacite" className="form-control" value={formData.capacite} onChange={handleChange} required />
              </div>
              <div className="col-md-2">
                <label>ID Sport</label>
                <input type="number" name="id_sport" className="form-control" value={formData.id_sport} onChange={handleChange} required />
              </div>
              <div className="col-md-2">
                <label>ID Coach</label>
                <input type="number" name="id_coach" className="form-control" value={formData.id_coach} onChange={handleChange} required />
              </div>
            </div>
            <div className="mt-3 text-end">
              <button type="submit" className="btn btn-info">Ajouter la séance</button>
            </div>
          </form>
        </div>
      </div>

      {/* Liste */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Heure</th>
              <th>Capacité</th>
              <th>Sport</th>
              <th>Coach</th>
            </tr>
          </thead>
          <tbody>
            {seances.map(s => (
              <tr key={s.id_seance}>
                <td>{s.id_seance}</td>
                <td>{s.date}</td>
                <td>{s.heure}</td>
                <td>{s.capacite}</td>
                <td>{s.nom_sport}</td>
                <td>{s.nom_coach}</td>  
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Seances;