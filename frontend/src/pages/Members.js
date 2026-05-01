// src/pages/Members.jsx
import React, { useState, useEffect } from 'react';
import { getMembers } from '../services/api';
import AddMember from '../components/AddMember';

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = async () => {
    try {
      const res = await getMembers();
      setMembers(res.data || []);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des membres');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR'); 
  };

  if (loading) return <div className="text-center mt-5">Chargement...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Gestion des Membres</h2>

      <AddMember onMemberAdded={fetchMembers} />

      {members.length === 0 ? (
        <div className="alert alert-info text-center">Aucun membre enregistré</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Date de naissance</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Adresse</th>
                <th>Date d'inscription</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id_personne}>
                  <td>{m.nom}</td>
                  <td>{m.prenom}</td>
                  <td>{formatDate(m.date_naissance)}</td>           
                  <td>{m.email}</td>
                  <td>{m.telephone}</td>
                  <td>{m.adresse || '-'}</td>
                  <td>{formatDate(m.date_inscription)}</td>        
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Members;