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
      const response = await getMembers();
      setMembers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des membres');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  if (loading) return <div className="text-center mt-5">Chargement en cours...</div>;

  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Gestion des Membres</h2>

      {/* Formulaire d'ajout d'un membre */}
      <AddMember onMemberAdded={fetchMembers} />

      {/* Liste des membres */}
      {members.length === 0 ? (
        <div className="alert alert-info text-center mt-4">
          Aucun membre enregistré pour le moment
        </div>
      ) : (
        <div className="table-responsive mt-4">
          <table className="table table-striped table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Âge</th>
                <th>Email</th>
                <th>Téléphone</th>          {/* ← Nouvelle colonne */}
                <th>Adresse</th>            {/* ← Nouvelle colonne */}
                <th>Date d'inscription</th>
                <th>Type de membre</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id_personne}>
                  <td>{member.nom}</td>
                  <td>{member.prenom}</td>
                  <td>{member.age}</td>
                  <td>{member.email}</td>
                  <td>{member.telephone || '-'}</td>       {/* ← Ajouté */}
                  <td>{member.adresse || '-'}</td>         {/* ← Ajouté */}
                  <td>{member.date_inscription}</td>
                  <td>{member.type_membre}</td>
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