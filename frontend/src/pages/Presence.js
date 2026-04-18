// src/pages/Presence.jsx
import React, { useState, useEffect } from 'react';
import { 
  getSeances, 
  getMembersSimple,          // ou getMembers selon ton choix
  getPresenceForSeance, 
  markPresence 
} from '../services/api';

function Presence() {
  const [seances, setSeances] = useState([]);
  const [selectedSeance, setSelectedSeance] = useState('');
  const [membres, setMembres] = useState([]);
  const [presences, setPresences] = useState({}); // { id_membre: 'Présent' | 'Absent' | 'Inscrit' }

  // Charger les séances au démarrage
  useEffect(() => {
    const fetchSeances = async () => {
      try {
        const res = await getSeances();
        setSeances(res.data || []);
      } catch (err) {
        console.error('Erreur chargement séances:', err);
      }
    };
    fetchSeances();
  }, []);

  // Quand on change de séance sélectionnée
  const handleSeanceChange = async (e) => {
    const id = e.target.value;
    setSelectedSeance(id);

    if (id) {
      try {
        // Charger la liste des membres
        const membresRes = await getMembersSimple();
        setMembres(membresRes.data || []);

        // Charger les présences existantes pour cette séance
        const presenceRes = await getPresenceForSeance(id);
        const presenceMap = {};
        presenceRes.data.forEach(p => {
          presenceMap[p.id_membre] = p.statut;
        });
        setPresences(presenceMap);
      } catch (err) {
        console.error('Erreur chargement présence:', err);
      }
    } else {
      setMembres([]);
      setPresences({});
    }
  };

  // Marquer ou modifier la présence
  const handleMark = async (id_membre, statut) => {
    try {
      await markPresence({
        id_seance: selectedSeance,
        id_membre,
        statut,
      });

      // Mise à jour immédiate de l'affichage
      setPresences(prev => ({
        ...prev,
        [id_membre]: statut,
      }));

      alert(`Statut mis à jour : ${statut}`);
    } catch (err) {
      alert('Erreur lors de l’enregistrement');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Suivi de Présence</h2>

      {/* Sélection de la séance */}
      <div className="card shadow mb-5">
        <div className="card-body">
          <label className="form-label fw-bold">Choisir une séance</label>
          <select
            className="form-select"
            value={selectedSeance}
            onChange={handleSeanceChange}
          >
            <option value="">-- Sélectionner une séance --</option>
            {seances.map((s) => (
              <option key={s.id_seance} value={s.id_seance}>
                {s.date} à {s.heure} - {s.nom_sport || 'Sport inconnu'} 
                {s.nom_coach ? ` - Coach: ${s.nom_coach}` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Affichage seulement si séance sélectionnée */}
      {selectedSeance && (
        <>
          <h4 className="mb-3">Liste des membres</h4>

          {membres.length === 0 ? (
            <div className="alert alert-info text-center">
              Aucun membre disponible pour cette séance
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Statut actuel</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {membres.map((m) => (
                    <tr key={m.id_personne}>
                      <td>{m.nom}</td>
                      <td>{m.prenom}</td>
                      <td className={
                        presences[m.id_personne] === 'Présent' ? 'text-success fw-bold' :
                        presences[m.id_personne] === 'Absent' ? 'text-danger fw-bold' :
                        'text-muted'
                      }>
                        {presences[m.id_personne] || 'Non inscrit'}
                      </td>
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleMark(m.id_personne, 'Présent')}
                        >
                          Présent
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleMark(m.id_personne, 'Absent')}
                        >
                          Absent
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Presence;