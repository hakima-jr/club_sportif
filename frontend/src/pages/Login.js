// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      });

      if (res.data.success && res.data.token) {
        // حفظ التوكن
        localStorage.setItem('token', res.data.token);

        // حفظ معلومات المستخدم (مهم للـ Header)
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }

        console.log("✅ Login successful - Redirecting to Home");

        // توجيه قوي
        window.location.href = '/';
      } 
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg">
            <div className="card-body p-5">
<<<<<<< Updated upstream
              <h2 className="text-center mb-4 text-primary">Club Sportif </h2>
=======
              <h2 className="text-center mb-4 text-primary">Club sportif</h2>
>>>>>>> Stashed changes
              <h4 className="text-center mb-4">Connexion</h4>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@club.com"
                    required 
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Mot de passe</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="admin123"
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2 mb-3" 
                  disabled={loading}
                >
                  {loading ? "Connexion en cours..." : "Se connecter"}
                </button>
              </form>

              {/* زر Créer un compte */}
              <div className="text-center">
                <p className="mb-2 text-muted">Vous n'avez pas de compte ?</p>
                <Link to="/register" className="btn btn-outline-success px-4">
                  Créer un compte
                </Link>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;