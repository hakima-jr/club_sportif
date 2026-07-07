// src/pages/Register.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// ─── Constants ────────────────────────────────────────────────────────────────

const API = 'http://localhost:5000/api';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1600&q=80',
];

const HERO_STATS = [
  { n: '2K+', l: 'Membres' },
  { n: '25+', l: 'Coaches' },
  { n: '50+', l: 'Cours/sem' },
];

const ROLE_OPTIONS = [
  { value: 'membre',    label: 'Membre' },
  { value: 'reception', label: 'Réception' },
  { value: 'coach',     label: 'Coach' },
  { value: 'admin',     label: 'Admin' },
];

const INITIAL_FORM = {
  nom: '', prenom: '', email: '',
  password: '', role: 'membre',
  telephone: '', id_membre: '',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function DumbbellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/>
      <path d="M3 9.5h3v5H3z"/><path d="M18 9.5h3v5h-3z"/>
      <path d="M6 12h12"/>
    </svg>
  );
}

function Navbar() {
  return (
    <nav style={css.nav}>
      <div style={css.navInner}>
        <Link to="/" style={css.brand}>
          <div style={css.brandIcon}><DumbbellIcon /></div>
          <span style={css.brandText}>
            FIT<span style={{ color: '#f97316' }}>CLUB</span>
          </span>
        </Link>
        <div style={css.navRight}>
          <Link to="/" style={css.accueilBtn}>Accueil</Link>
          <Link to="/login" style={css.navCta}>Se connecter</Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSlider({ slide, onDotClick }) {
  return (
    <div style={css.left}>
      {HERO_IMAGES.map((src, i) => (
        <div
          key={i}
          style={{
            ...css.slide,
            backgroundImage: `linear-gradient(135deg, rgba(15,23,42,.78), rgba(15,23,42,.58)), url(${src})`,
            opacity: slide === i ? 1 : 0,
          }}
        />
      ))}

      <div style={{ ...css.blob, top: '15%', left: '10%',  background: '#f97316', animation: 'll-pulse 4s ease-in-out infinite' }} />
      <div style={{ ...css.blob, bottom: '20%', right: '15%', background: '#3b82f6', animation: 'll-float 6s ease-in-out infinite' }} />

      <div style={css.heroContent}>
        <span style={css.tag}>★  CLUB SPORTIF</span>
        <h1 style={css.heroTitle}>
          Rejoignez<br />
          la <span style={{ color: '#f97316' }}>communauté</span>
        </h1>
        <p style={css.heroSub}>
          Créez votre compte et accédez à un univers d'entraînement,
          de coaching pro et de suivi personnalisé.
        </p>

        <div style={css.statsRow}>
          {HERO_STATS.map(({ n, l }) => (
            <div key={l} style={css.statItem}>
              <div style={css.statNum}>{n}</div>
              <div style={css.statLabel}>{l}</div>
            </div>
          ))}
        </div>

        <div style={css.dots}>
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => onDotClick(i)}
              style={{ ...css.dot, width: slide === i ? 28 : 8, background: slide === i ? '#f97316' : 'rgba(255,255,255,.4)' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div style={css.fieldWrap}>
      {label && <label style={css.label}>{label}</label>}
      {children}
    </div>
  );
}

function Alert({ type, message }) {
  const styles = type === 'error' ? css.errBox : css.okBox;
  const icon   = type === 'error' ? '⚠' : '✓';
  return <div style={styles}>{icon} {message}</div>;
}

function PasswordInput({ value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        name="password"
        placeholder="mot de passe"
        value={value}
        onChange={onChange}
        required
        className="ll-input"
        style={{ paddingRight: 44 }}
      />
      <button type="button" onClick={() => setShow(v => !v)} style={css.eyeBtn}>
        {show ? '🙈' : '👁'}
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function Register() {
  const navigate = useNavigate();
  const [membres,  setMembres]  = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [slide,    setSlide]    = useState(0);

  useEffect(() => {
    axios.get(`${API}/membres`)
      .then(res => setMembres(res.data))
      .catch(err => console.error('Erreur chargement membres:', err));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRoleChange = (e) =>
    setFormData({ ...INITIAL_FORM, role: e.target.value });

  const handleMembreSelect = (e) => {
    const id       = e.target.value;
    const selected = membres.find(m => m.id_personne === parseInt(id));
    setFormData(prev => ({
      ...prev,
      id_membre:  id,
      nom:        selected?.nom       || prev.nom,
      prenom:     selected?.prenom    || prev.prenom,
      email:      selected?.email     || prev.email,
      telephone:  selected?.telephone || prev.telephone,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const payload = { ...formData };
      if (!payload.id_membre) delete payload.id_membre;
      else payload.id_membre = parseInt(payload.id_membre);
      if (!payload.telephone?.trim()) delete payload.telephone;

      await axios.post(`${API}/register`, payload);
      setSuccess('Compte créé avec succès ! Redirection...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyles />
      <div style={css.page}>
        <Navbar />

        <div style={css.split}>
          <HeroSlider slide={slide} onDotClick={setSlide} />

          {/* ── FORM PANEL ──────────────────────────────────────── */}
          <div style={css.right}>
            <div style={css.formCard}>
              <h2 style={css.formTitle}>Créer un compte</h2>
              <p style={css.formSub}>Remplissez vos informations pour commencer</p>

              {error   && <Alert type="error"   message={error} />}
              {success && <Alert type="success" message={success} />}

              <form onSubmit={handleSubmit} style={css.form}>

                {/* Row: role + membre existant */}
                <div style={css.row}>
                  <FormField label="Rôle">
                    <select name="role" value={formData.role} onChange={handleRoleChange} className="ll-input">
                      {ROLE_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </FormField>

                  {formData.role === 'membre' && (
                    <FormField label="Membre existant">
                      <select value={formData.id_membre} onChange={handleMembreSelect} className="ll-input">
                        <option value="">-- Nouveau --</option>
                        {membres.map(m => (
                          <option key={m.id_personne} value={m.id_personne}>
                            {m.nom} {m.prenom}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  )}
                </div>

                {/* Row: nom + prénom */}
                <div style={css.row}>
                  <FormField label="Nom *">
                    <input name="nom" placeholder="nom" className="ll-input" value={formData.nom} onChange={handleChange} required />
                  </FormField>
                  <FormField label="Prénom *">
                    <input name="prenom" placeholder="prénom" className="ll-input" value={formData.prenom} onChange={handleChange} required />
                  </FormField>
                </div>

                {/* Row: email + téléphone */}
                <div style={css.row}>
                  <FormField label="Email *">
                    <input type="email" name="email" placeholder="adresse email" className="ll-input" value={formData.email} onChange={handleChange} required />
                  </FormField>
                  <FormField label="Téléphone">
                    <input name="telephone" placeholder="téléphone" className="ll-input" value={formData.telephone} onChange={handleChange} />
                  </FormField>
                </div>

                {/* Password */}
                <FormField label="Mot de passe *">
                  <PasswordInput value={formData.password} onChange={handleChange} />
                </FormField>

                <button type="submit" disabled={loading} className="ll-btn" style={css.submitBtn}>
                  {loading
                    ? <><span className="ll-spin" /> Création en cours...</>
                    : 'Créer mon compte →'
                  }
                </button>
              </form>

              <div style={css.switchRow}>
                Déjà un compte ?{' '}
                <Link to="/login" style={css.switchLink}>Se connecter</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Global Styles ────────────────────────────────────────────────────────────

function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; margin: 0; padding: 0; }

      @keyframes ll-float { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-20px) rotate(5deg)} }
      @keyframes ll-pulse { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.7;transform:scale(1.1)} }
      @keyframes ll-spin  { to { transform: rotate(360deg) } }
      @keyframes ll-fade  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

      .ll-input {
        width: 100%;
        background: rgba(255,255,255,0.06);
        border: 1.5px solid rgba(255,255,255,0.12);
        border-radius: 12px;
        padding: 11px 14px;
        font-size: 14px;
        color: #fff;
        outline: none;
        transition: all .25s;
        box-sizing: border-box;
        font-family: inherit;
      }
      .ll-input::placeholder { color: #64748b; }
      .ll-input:focus {
        border-color: #f97316;
        background: rgba(249,115,22,0.08);
        box-shadow: 0 0 0 4px rgba(249,115,22,0.15);
      }
      .ll-input option { background: #0f172a; color: #fff; }

      .ll-btn {
        width: 100%;
        padding: 13px;
        background: linear-gradient(135deg, #f97316, #ea580c);
        color: #fff;
        border: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: all .25s;
        box-shadow: 0 10px 30px -10px rgba(249,115,22,.6);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-family: inherit;
      }
      .ll-btn:hover  { transform: translateY(-2px); box-shadow: 0 16px 40px -10px rgba(249,115,22,.8); }
      .ll-btn:active { transform: translateY(0); }
      .ll-btn:disabled { opacity: .7; cursor: not-allowed; transform: none; }

      .ll-spin {
        width: 18px; height: 18px;
        border: 2px solid rgba(255,255,255,.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: ll-spin .7s linear infinite;
        display: inline-block;
      }
    `}</style>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const ORANGE = '#f97316';
const DARK   = '#0f172a';

const css = {
  page: { position: 'fixed', inset: 0, background: DARK, color: '#fff', overflowY: 'auto', fontFamily: 'system-ui, -apple-system, sans-serif' },

  // Navbar
  nav: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '18px 40px', background: 'rgba(15,23,42,.6)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,.06)' },
  navInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  brand: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' },
  brandIcon: { fontSize: 24, width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${ORANGE}, #ea580c)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px -6px rgba(249,115,22,.6)' },
  brandText: { fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '.5px' },
  accueilBtn: { padding: '9px 18px', border: '1.5px solid rgba(255,255,255,.25)', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all .2s', background: 'transparent' },
  navCta: { padding: '9px 18px', background: `linear-gradient(135deg, ${ORANGE}, #ea580c)`, color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 20px -6px rgba(249,115,22,.5)' },

  // Layout
  split: { display: 'grid', gridTemplateColumns: '45% 55%', minHeight: '100vh', paddingTop: 78 },

  // Left hero
  left: { position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 },
  slide: { position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'opacity 1.2s ease' },
  blob: { position: 'absolute', width: 200, height: 200, borderRadius: '50%', filter: 'blur(80px)', opacity: .5 },
  heroContent: { position: 'relative', zIndex: 2, maxWidth: 420 },
  tag: { display: 'inline-block', padding: '6px 14px', background: 'rgba(249,115,22,.15)', border: '1px solid rgba(249,115,22,.4)', color: '#fdba74', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', marginBottom: 20 },
  heroTitle: { fontSize: 48, fontWeight: 900, lineHeight: 1.05, margin: '0 0 18px', letterSpacing: '-1px' },
  heroSub: { fontSize: 15, lineHeight: 1.65, color: '#cbd5e1', margin: '0 0 32px' },
  statsRow: { display: 'flex', gap: 24, marginBottom: 32 },
  statItem: { borderLeft: `2px solid ${ORANGE}`, paddingLeft: 14 },
  statNum: { fontSize: 24, fontWeight: 800, color: '#fff' },
  statLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' },
  dots: { display: 'flex', gap: 8 },
  dot: { height: 8, borderRadius: 4, border: 'none', cursor: 'pointer', transition: 'all .3s', padding: 0 },

  // Right form
  right: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 40px', background: `linear-gradient(135deg, ${DARK} 0%, #1e293b 100%)`, overflowY: 'auto' },
  formCard: { width: '100%', maxWidth: 500, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: '32px 36px', backdropFilter: 'blur(10px)', animation: 'll-fade .6s ease-out' },
  formTitle: { fontSize: 28, fontWeight: 800, margin: '0 0 6px', color: '#fff', letterSpacing: '-.5px' },
  formSub: { fontSize: 14, color: '#94a3b8', margin: '0 0 22px' },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  row: { display: 'flex', gap: 12 },
  fieldWrap: { flex: 1, display: 'flex', flexDirection: 'column' },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 6 },
  eyeBtn: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 16 },
  submitBtn: { marginTop: 8 },
  switchRow: { textAlign: 'center', marginTop: 18, fontSize: 13, color: '#94a3b8' },
  switchLink: { color: ORANGE, fontWeight: 700, textDecoration: 'none' },
  errBox: { background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.35)', color: '#fca5a5', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 14 },
  okBox:  { background: 'rgba(34,197,94,.12)',  border: '1px solid rgba(34,197,94,.35)',  color: '#86efac', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 14 },
};

export default Register;