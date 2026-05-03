// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [membres, setMembres] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'membre',
    telephone: '',
    id_membre: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Charger les membres
  useEffect(() => {
    axios.get('http://localhost:4000/api/membres')
      .then(res => setMembres(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // عند تغيير الـ Rôle
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setFormData(prev => ({
      ...prev,
      role: newRole,
      id_membre: '',           // إعادة تعيين الربط
      // إذا مش membre → نفرغ الحقول
      nom: newRole === 'membre' ? prev.nom : '',
      prenom: newRole === 'membre' ? prev.prenom : '',
      email: newRole === 'membre' ? prev.email : '',
      telephone: newRole === 'membre' ? prev.telephone : ''
    }));
  };

  // عند اختيار عضو موجود
  const handleMembreSelect = (e) => {
    const idMembre = e.target.value;
    setFormData(prev => ({ ...prev, id_membre: idMembre }));

    if (idMembre) {
      const selected = membres.find(m => m.id_personne === parseInt(idMembre));
      if (selected) {
        setFormData(prev => ({
          ...prev,
          nom: selected.nom || '',
          prenom: selected.prenom || '',
          email: selected.email || '',
          telephone: selected.telephone || ''
        }));
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
<<<<<<< Updated upstream
      const res = await axios.post('http://localhost:4000/api/register', formData);
      setSuccess('Compte créé avec succès ! Redirection...');
      setTimeout(() => navigate('/login'), 2000);
=======
      const res = await axios.post('http://localhost:5000/api/register', formData);
      
      setSuccess('Compte créé avec succès ! Vous pouvez vous connecter maintenant.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
>>>>>>> Stashed changes
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Créer un nouveau compte</h2>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label>Rôle</label>
                  <select name="role" className="form-select" value={formData.role} onChange={handleRoleChange}>
                    <option value="membre">Membre</option>
                    <option value="reception">Réception</option>
                    <option value="coach">Coach</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>

                {/* Combobox Lier à un membre - فقط للأعضاء */}
                {formData.role === 'membre' && (
                  <div className="mb-4">
                    <label>Sélectionner un membre existant</label>
                    <select 
                      name="id_membre" 
                      className="form-select" 
                      value={formData.id_membre} 
                      onChange={handleMembreSelect}
                    >
                      <option value="">-- Nouveau membre --</option>
                      {membres.map(m => (
                        <option key={m.id_personne} value={m.id_personne}>
                          {m.nom} {m.prenom}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-md-6">
                    <label>Nom</label>
                    <input type="text" name="nom" className="form-control" value={formData.nom} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label>Prénom</label>
                    <input type="text" name="prenom" className="form-control" value={formData.prenom} onChange={handleChange} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label>Email</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                  <label>Téléphone</label>
                  <input type="text" name="telephone" className="form-control" value={formData.telephone} onChange={handleChange} />
                </div>

                <div className="mb-4">
                  <label>Mot de passe</label>
                  <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                </div>

                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                  {loading ? "Création en cours..." : "Créer le compte"}
                </button>
              </form>

              <div className="text-center mt-3">
                <Link to="/login">Déjà un compte ? Se connecter</Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;