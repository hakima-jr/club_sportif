// src/components/AddMember.jsx
import React, { useState } from 'react';
import { addMember } from '../services/api';

function AddMember({ onMemberAdded }) {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    nom: '', prenom: '', date_naissance: '', adresse: '',
    telephone: '', email: '', date_inscription: today,
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(false);
    try {
      await addMember(formData);
      setSuccess(true);
      setFormData({ nom: '', prenom: '', date_naissance: '', adresse: '', telephone: '', email: '', date_inscription: today });
      if (onMemberAdded) onMemberAdded();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'ajout du membre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h5 style={styles.cardHeaderText}>Ajouter un nouveau membre</h5>
      </div>
      <div style={styles.cardBody}>
        {success && <div style={styles.alertSuccess}>✅ Membre ajouté avec succès !</div>}
        {error   && <div style={styles.alertError}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>Nom</label>
              <input type="text" name="nom" style={styles.input} value={formData.nom} onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Prénom</label>
              <input type="text" name="prenom" style={styles.input} value={formData.prenom} onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Date de naissance</label>
              <input type="date" name="date_naissance" style={styles.input} value={formData.date_naissance} onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input type="email" name="email" style={styles.input} value={formData.email} onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Téléphone</label>
              <input type="tel" name="telephone" style={styles.input} value={formData.telephone} onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Adresse</label>
              <input type="text" name="adresse" style={styles.input} value={formData.adresse} onChange={handleChange} />
            </div>
            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Date d'inscription</label>
              <input type="date" name="date_inscription" style={styles.input} value={formData.date_inscription} onChange={handleChange} min={today} required />
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" onClick={() => onMemberAdded && onMemberAdded()} style={styles.btnCancel}>
              Annuler
            </button>
            <button type="submit" style={{ ...styles.btnSubmit, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Ajout en cours...' : 'Ajouter le membre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  card:          { background: '#1a1f2e', borderRadius: 12, marginBottom: 24, overflow: 'hidden' },
  cardHeader:    { padding: '14px 20px', background: '#1e3a8a', borderTop: '4px solid #3b82f6' },
  cardHeaderText:{ margin: 0, color: '#e2e8f0', fontSize: 15, fontWeight: 700, fontFamily: 'Segoe UI, sans-serif' },
  cardBody:      { padding: '22px' },
  alertSuccess:  { background: '#14532d', color: '#4ade80', padding: '10px 16px', borderRadius: 8, border: '1px solid #16a34a', marginBottom: 16, fontSize: 14 },
  alertError:    { background: '#3b1f1f', color: '#f87171', padding: '10px 16px', borderRadius: 8, border: '1px solid #ef4444', marginBottom: 16, fontSize: 14 },
  grid:          { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 16 },
  field:         { display: 'flex', flexDirection: 'column', gap: 6 },
  label:         { color: '#94a3b8', fontSize: 13, fontWeight: 500, fontFamily: 'Segoe UI, sans-serif' },
  input:         { padding: '9px 14px', background: '#232938', border: '1px solid #2d3448', borderRadius: 8, color: '#e2e8f0', fontSize: 14, outline: 'none', fontFamily: 'Segoe UI, sans-serif' },
  btnCancel:     { padding: '10px 20px', background: '#232938', border: '1px solid #2d3448', borderRadius: 8, color: '#94a3b8', fontSize: 14, cursor: 'pointer', fontFamily: 'Segoe UI, sans-serif' },
  btnSubmit:     { padding: '10px 24px', background: '#16a34a', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Segoe UI, sans-serif' },
};

export default AddMember;