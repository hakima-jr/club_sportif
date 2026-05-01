// src/components/AddMember.jsx
import React, { useState } from 'react';
import { addMember } from '../services/api';

function AddMember({ onMemberAdded }) {
  const today = new Date().toISOString().split('T')[0];   

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    adresse: '',
    telephone: '',
    email: '',
    date_inscription: today,        
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await addMember(formData);
      setSuccess(true);

      setFormData({
        nom: '',
        prenom: '',
        date_naissance: '',
        adresse: '',
        telephone: '',
        email: '',
        date_inscription: today,
      });

      if (onMemberAdded) onMemberAdded();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l’ajout du membre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4 shadow">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Ajouter un nouveau membre</h5>
      </div>
      <div className="card-body">
        {success && <div className="alert alert-success">Membre ajouté avec succès !</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Nom</label>
              <input type="text" name="nom" className="form-control" value={formData.nom} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Prénom</label>
              <input type="text" name="prenom" className="form-control" value={formData.prenom} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Date de naissance</label>
              <input type="date" name="date_naissance" className="form-control" value={formData.date_naissance} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Téléphone</label>
              <input type="tel" name="telephone" className="form-control" value={formData.telephone} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Adresse</label>
              <input type="text" name="adresse" className="form-control" value={formData.adresse} onChange={handleChange} />
            </div>

            <div className="col-md-12">
              <label className="form-label">Date d'inscription</label>
              <input 
                type="date" 
                name="date_inscription" 
                className="form-control" 
                value={formData.date_inscription} 
                onChange={handleChange} 
                min={today}         
                required 
              />
            </div>
          </div>

          <div className="mt-4 text-end">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Ajout en cours...' : 'Ajouter le membre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMember;


