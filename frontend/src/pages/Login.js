// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// ─── Constants ────────────────────────────────────────────────────────────────

const API = 'http://localhost:5000/api';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1600&q=80',
];

const HERO_STATS = [
  { n: '2K+', l: 'Membres actifs' },
  { n: '25+', l: 'Coaches pros' },
  { n: '50+', l: 'Cours / semaine' },
];

const TEST_ACCOUNTS = [
  { role: 'Admin',     email: 'ayabenali@gmail.com',           password: 'Admin@123' },
  { role: 'Reception', email: 'reception@club.com',        password: 'reception123' },
  { role: 'Coach',     email: 'hamza@gmail.com',  password: 'hamza123' },
  { role: 'Membre',    email: 'zerradomar@gmail.com',             password: 'omar123' },
];

const ROLE_REDIRECT = {
  admin:     '/admin/dashboard',
  reception: '/members',
  coach:     '/coach/dashboard',
  membre:    '/membre/dashboard',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroSlider({ slide, onDotClick }) {
  return (
    <div style={css.left}>
      {/* Background slides */}
      {HERO_IMAGES.map((src, i) => (
        <div
          key={i}
          style={{
            ...css.slide,
            backgroundImage: `linear-gradient(135deg, rgba(15,23,42,.75), rgba(15,23,42,.88)), url(${src})`,
            opacity: i === slide ? 1 : 0,
            transform: i === slide ? 'scale(1)' : 'scale(1.06)',
          }}
        />
      ))}

      {/* Ambient blobs */}
      <div style={{ ...css.blob, ...css.blob1 }} />
      <div style={{ ...css.blob, ...css.blob2 }} />

      {/* Content */}
      <div style={css.heroContent}>
        <div style={css.heroBadge}>
          <span style={css.heroBadgeDot} />
          VOTRE CLUB SPORTIF
        </div>

        <h1 style={css.heroTitle}>
          Dépassez<br />
          <span style={css.heroAccent}>vos limites.</span>
        </h1>

        <p style={css.heroText}>
          Rejoignez une communauté passionnée. Coaches certifiés,
          équipements premium et programmes personnalisés.
        </p>

        <div style={css.heroStats}>
          {HERO_STATS.map(({ n, l }) => (
            <div key={l} style={css.statBox}>
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
              style={{ ...css.dot, width: i === slide ? 28 : 8, background: i === slide ? '#f97316' : 'rgba(255,255,255,.4)' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

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
          <div style={css.brandMark}><DumbbellIcon /></div>
          <span style={css.brandName}>FITCLUB</span>
        </Link>
        <div style={css.navRight}>
          <Link to="/" style={css.accueilBtn}>Accueil</Link>
          <Link to="/register" style={css.navCta}>Devenir membre</Link>
        </div>
      </div>
    </nav>
  );
}

function ErrorAlert({ message }) {
  return <div style={css.errorBox}>⚠ {message}</div>;
}

function Spinner() {
  return <span className="ll-spin" />;
}

function CheckBox({ checked, onChange, label }) {
  return (
    <label style={css.checkRow}>
      <span
        onClick={onChange}
        style={{
          ...css.checkbox,
          background: checked ? '#f97316' : '#fff',
          borderColor: checked ? '#f97316' : '#cbd5e1',
        }}
      >
        {checked && <span style={css.checkmark}>✓</span>}
      </span>
      <span onClick={onChange} style={css.checkLabel}>{label}</span>
    </label>
  );
}

function TestAccounts({ onSelect }) {
  return (
    <div style={css.testBox}>
      <div style={css.testTitle}>Comptes de test</div>
      <div style={css.testRow}>
        {TEST_ACCOUNTS.map(a => (
          <button key={a.role} type="button" onClick={() => onSelect(a)} style={css.testBtn} className="ll-test">
            {a.role}
          </button>
        ))}
      </div>
    </div>
  );
}

function ForgotPasswordForm({ onBack }) {
  const [email,  setEmail]  = useState('');
  const [status, setStatus] = useState('idle');
  const [msg,    setMsg]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await axios.post(`${API}/forgot-password`, { email });
      setStatus('success');
      setMsg('Si cet email existe, un lien de réinitialisation a été envoyé.');
    } catch {
      setStatus('error');
      setMsg('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (status === 'success') {
    return (
      <div style={css.successBox}>
        <span style={{ fontSize: 44 }}>✉️</span>
        <h3 style={{ color: '#0f172a', margin: '0 0 8px' }}>Email envoyé !</h3>
        <p style={{ fontSize: 13, color: '#475569', margin: '0 0 16px' }}>{msg}</p>
        <button style={css.submitBtn} className="ll-btn" onClick={onBack}>Retour à la connexion</button>
      </div>
    );
  }

  return (
    <>
      <button style={css.backBtn} onClick={onBack}>← Retour</button>
      <h2 style={css.formTitle}>Mot de passe oublié</h2>
      <p style={css.formSub}>Entrez votre email pour recevoir un lien de réinitialisation.</p>
      {status === 'error' && <ErrorAlert message={msg} />}
      <form onSubmit={handleSubmit}>
        <div style={css.formGroup}>
          <label style={css.label}>Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Adresse email" required
            style={css.input} className="ll-input"
          />
        </div>
        <button type="submit" style={css.submitBtn} className="ll-btn" disabled={status === 'loading'}>
          {status === 'loading' ? <><Spinner /> Envoi...</> : 'Envoyer le lien'}
        </button>
      </form>
    </>
  );
}

function LoginForm({ onForgot }) {
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe,   setRememberMe]   = useState(false);
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await axios.post(`${API}/login`, { email, password });
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (!rememberMe) sessionStorage.setItem('_session', '1');
        const role = data.user?.role?.toLowerCase()?.trim();
        window.location.href = ROLE_REDIRECT[role] ?? '/';
      } else {
        setError(data.message || 'Erreur de connexion');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const fillTestAccount = ({ email, password }) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <>
      <h2 style={css.formTitle}>Connexion</h2>
      <p style={css.formSub}>Bon retour ! Entrez vos identifiants pour continuer.</p>

      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleLogin}>
        <div style={css.formGroup}>
          <label style={css.label}>Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Adresse email" required
            style={css.input} className="ll-input"
          />
        </div>

        <div style={css.formGroup}>
          <label style={css.label}>Mot de passe</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Mot de passe" required
              style={{ ...css.input, paddingRight: 70 }} className="ll-input"
            />
            <button type="button" onClick={() => setShowPassword(v => !v)} style={css.eyeBtn}>
              {showPassword ? 'CACHER' : 'VOIR'}
            </button>
          </div>
        </div>

        <div style={css.formRow}>
          <CheckBox checked={rememberMe} onChange={() => setRememberMe(v => !v)} label="Se souvenir de moi" />
          <button type="button" onClick={onForgot} style={css.forgotBtn}>Mot de passe oublié ?</button>
        </div>

        <button type="submit" disabled={loading} style={css.submitBtn} className="ll-btn">
          {loading ? <><Spinner /> Connexion...</> : 'Se connecter →'}
        </button>
      </form>

      <div style={css.switchRow}>
        Pas encore de compte ?{' '}
        <Link to="/register" style={css.switchLink}>S'inscrire</Link>
      </div>

      <TestAccounts onSelect={fillTestAccount} />
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function Login() {
  const [slide,      setSlide]      = useState(0);
  const [mounted,    setMounted]    = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={css.page}>
      <GlobalStyles />
      <Navbar />
      <div style={css.body}>
        <HeroSlider slide={slide} onDotClick={setSlide} />
        <div style={css.right}>
          <div style={{ ...css.formContainer, opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(16px)', transition: 'all .6s ease' }}>
            {showForgot
              ? <ForgotPasswordForm onBack={() => setShowForgot(false)} />
              : <LoginForm onForgot={() => setShowForgot(true)} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Global Styles ────────────────────────────────────────────────────────────

function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; margin: 0; padding: 0; }
      @keyframes pulse  { 0%,100%{transform:scale(1);opacity:.5}  50%{transform:scale(1.15);opacity:.8} }
      @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
      @keyframes ll-spin { to { transform: rotate(360deg) } }

      .ll-input:focus { border-color:#f97316 !important; box-shadow:0 0 0 4px rgba(249,115,22,.15); outline:none; }

      .ll-btn { transition: all .25s ease; }
      .ll-btn:hover { transform:translateY(-2px); box-shadow:0 12px 28px -8px rgba(249,115,22,.55); }
      .ll-btn:active { transform:translateY(0); }

      .ll-test:hover { background:#f97316 !important; transform:translateY(-1px); }
      .ll-test { transition:all .2s; }

      .ll-spin {
        display:inline-block; width:14px; height:14px;
        border:2px solid rgba(255,255,255,.4); border-top-color:#fff;
        border-radius:50%; animation:ll-spin .8s linear infinite; vertical-align:middle; margin-right:8px;
      }
    `}</style>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const ORANGE = '#f97316';
const DARK   = '#0f172a';

const css = {
  page: { position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: DARK, overflow: 'hidden', fontFamily: '-apple-system, Segoe UI, Roboto, sans-serif' },

  // Navbar
  nav: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '18px 40px', background: 'rgba(15,23,42,.6)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,.08)' },
  navInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1400, margin: '0 auto' },
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  brand: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' },
  brandMark: { width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${ORANGE}, #fb923c)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 6px 20px -4px rgba(249,115,22,.6)' },
  brandName: { color: '#fff', fontWeight: 800, fontSize: 18, letterSpacing: 2 },
  accueilBtn: { padding: '9px 18px', border: '1.5px solid rgba(255,255,255,.25)', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all .2s', background: 'transparent' },
  navCta: { padding: '9px 18px', border: '1.5px solid rgba(255,255,255,.25)', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all .2s', background: 'transparent' },

  // Layout
  body: { display: 'flex', flex: 1, paddingTop: 76 },

  // Left hero
  left: { width: '55%', position: 'relative', overflow: 'hidden' },
  slide: { position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'opacity 1.2s ease, transform 8s ease' },
  blob: { position: 'absolute', borderRadius: '50%', pointerEvents: 'none' },
  blob1: { top: '15%', right: '-80px', width: 280, height: 280, background: 'radial-gradient(circle,rgba(249,115,22,.4),transparent 70%)', animation: 'pulse 6s ease-in-out infinite' },
  blob2: { bottom: '10%', left: '-60px', width: 220, height: 220, background: 'radial-gradient(circle,rgba(59,130,246,.35),transparent 70%)', animation: 'float 7s ease-in-out infinite' },
  heroContent: { position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 60px', color: '#fff', maxWidth: 600 },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(249,115,22,.15)', border: '1px solid rgba(249,115,22,.4)', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#fb923c', alignSelf: 'flex-start', marginBottom: 24 },
  heroBadgeDot: { width: 8, height: 8, borderRadius: '50%', background: ORANGE, animation: 'pulse 2s infinite' },
  heroTitle: { fontSize: 60, fontWeight: 800, lineHeight: 1.05, margin: '0 0 20px', letterSpacing: -1.5 },
  heroAccent: { background: 'linear-gradient(90deg, #f97316, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroText: { fontSize: 16, lineHeight: 1.65, opacity: .85, margin: '0 0 36px', maxWidth: 480 },
  heroStats: { display: 'flex', gap: 24, marginBottom: 32 },
  statBox: { padding: '14px 22px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, backdropFilter: 'blur(8px)' },
  statNum: { fontSize: 26, fontWeight: 800, color: '#fb923c' },
  statLabel: { fontSize: 11, opacity: .75, marginTop: 2 },
  dots: { display: 'flex', gap: 8 },
  dot: { height: 8, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0, transition: 'all .3s' },

  // Right form
  right: { width: '45%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 50px', background: '#fff', overflowY: 'auto' },
  formContainer: { width: '100%', maxWidth: 380 },
  backBtn: { background: 'none', border: 'none', color: ORANGE, fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: 20 },
  formTitle: { fontSize: 30, fontWeight: 800, color: DARK, margin: '0 0 8px', letterSpacing: -.5 },
  formSub: { fontSize: 14, color: '#64748b', margin: '0 0 28px' },
  errorBox: { background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13, border: '1px solid #fecaca' },
  formGroup: { marginBottom: 18 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6, letterSpacing: .3 },
  input: { width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, transition: 'all .2s', background: '#f8fafc', boxSizing: 'border-box' },
  eyeBtn: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: ORANGE, fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: .5 },
  formRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  checkRow: { display: 'flex', alignItems: 'center', gap: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 5, border: '2px solid', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s' },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: 700 },
  checkLabel: { cursor: 'pointer', fontSize: 13, color: '#475569' },
  forgotBtn: { background: 'none', border: 'none', color: ORANGE, fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0 },
  submitBtn: { width: '100%', padding: 13, background: `linear-gradient(135deg, ${ORANGE}, #ea580c)`, color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 18, boxShadow: '0 8px 20px -8px rgba(249,115,22,.5)' },
  switchRow: { textAlign: 'center', fontSize: 13, color: '#64748b', marginBottom: 22 },
  switchLink: { color: ORANGE, textDecoration: 'none', fontWeight: 700 },
  testBox: { padding: 14, background: '#f8fafc', borderRadius: 12, border: '1px dashed #cbd5e1' },
  testTitle: { fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 1, marginBottom: 10, textAlign: 'center' },
  testRow: { display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' },
  testBtn: { padding: '6px 12px', background: DARK, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600 },
  successBox: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
};

export default Login;