// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'reception'   // default = reception
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('http://localhost:4000/api/register', formData);
      
      setSuccess('Compte créé avec succès ! Vous pouvez vous connecter maintenant.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du compte');
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
              <h2 className="text-center mb-4">Créer un compte</h2>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleRegister}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>Nom</label>
                    <input type="text" name="nom" className="form-control" value={formData.nom} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Prénom</label>
                    <input type="text" name="prenom" className="form-control" value={formData.prenom} onChange={handleChange} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label>Email</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                  <label>Mot de passe</label>
                  <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                  <label>Rôle</label>
                  <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                    <option value="admin">Administrateur</option>
                    <option value="reception">Réceptionniste</option>
                    <option value="coach">Coach</option>
                    
                  </select>
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