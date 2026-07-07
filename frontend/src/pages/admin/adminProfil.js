// src/pages/admin/AdminProfil.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';

function Icon({ d, size = 18, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}

const IC = {
  user:     ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  edit:     ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  check:    'M20 6L9 17l-5-5',
  save:     ['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z','M17 21v-8H7v8','M7 3v5h8'],
  warning:  ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  close:    ['M18 6L6 18','M6 6l12 12'],
  back:     ['M19 12H5','M12 5l-7 7 7 7'],
  calendar: ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  clock:    ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 6v6l4 2'],
  mail:     ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6'],
  phone:    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.07 6.07l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  mapPin:   ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z','M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  gender:   ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z'],
  money:    ['M12 1v22','M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
  medal:    ['M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z','M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  id:       ['M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z'],
  stat:     ['M18 20V10','M12 20V4','M6 20v-6'],
  list:     ['M8 6h13','M8 12h13','M8 18h13','M3 6h.01','M3 12h.01','M3 18h.01'],
  inbox:    ['M22 12h-6l-2 3h-4l-2-3H2','M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
  arrow:    'M5 12h14M12 5l7 7-7 7',
  work:     ['M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z','M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'],
  camera:   ['M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z','M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  lock:     ['M19 11H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2zm-7-9a4 4 0 0 1 4 4v2H8V6a4 4 0 0 1 4-4z'],
  shield:   ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  building: ['M3 21h18','M5 21V7l8-4 8 4v14','M9 21v-6h6v6','M10 9h4','M10 13h4'],
  members:  ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z','M23 21v-2a4 4 0 0 0-3-3.87','M16 3.13a4 4 0 0 1 0 7.75'],
  dumbbell: ['M6.5 6.5h11','M6.5 17.5h11','M3 9.5h3v5H3z','M18 9.5h3v5h-3z','M6 12h12'],
  sessions: ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  online:   ['M22 11.08V12a10 10 0 1 1-5.93-9.14'],
  activity: ['M22 12h-4l-3 9L9 3l-3 9H2'],
  key:      ['M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4'],
  eye:      ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  eyeOff:   ['M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24','M1 1l22 22'],
  refresh:  ['M23 4v6h-6','M1 20v-6h6','M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15'],
  chevronRight: 'M9 18l6-6-6-6',
  security: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z','M12 8v4','M12 16h.01'],
};

// === COULEURS PROFESSIONNELLES & SOBRES ===
const C = {
  bgDark: '#0a0c10',
  surface: '#111318',
  surfaceAlt: '#161a21',
  surfaceHover: '#1c2129',
  border: '#1e232b',
  borderLight: '#2a303c',
  text: '#e8ecf1',
  textMuted: '#6b7280',
  textLight: '#9ca3af',
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  primaryGlow: 'rgba(99,102,241,0.10)',
  success: '#10b981',
  successGlow: 'rgba(16,185,129,0.10)',
  danger: '#ef4444',
  dangerGlow: 'rgba(239,68,68,0.10)',
  warning: '#f59e0b',
  info: '#3b82f6',
  purple: '#8b5cf6',
  headerBg: '#0d0f14',
};

const fmt = (n) => Number(n || 0).toLocaleString('fr-MA');

function Avatar({ admin, size = 120, previewUrl = null }) {
  if (previewUrl) {
    return <img src={previewUrl} alt="profil" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${C.borderLight}`, flexShrink: 0 }} />;
  }
  const initials = `${admin.nom?.[0] || ''}${admin.prenom?.[0] || ''}`.toUpperCase();
  const hue = ((admin.nom || 'A').charCodeAt(0) * 37) % 360;
  if (admin.photo) return <img src={`${API}/uploads/${admin.photo}`} alt="profil" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${C.borderLight}`, flexShrink: 0 }} />;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg, hsl(${hue},35%,22%), hsl(${hue},25%,16%))`, border: `2px solid hsl(${hue},30%,35%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `hsl(${hue},40%,75%)`, fontWeight: 600, fontSize: size * 0.35, userSelect: 'none' }}>{initials}</div>
  );
}

function InfoRow({ icon, label, value, color = C.textLight }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', background: C.surfaceAlt, borderRadius: 10, border: `1px solid ${C.border}`, transition: 'all 0.2s ease' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderLight; e.currentTarget.style.background = C.surfaceHover; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surfaceAlt; }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: C.primaryGlow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
        <Icon d={icon} size={15} color={C.primary} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 3px', fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</p>
        <p style={{ margin: 0, fontSize: 14, color, fontWeight: 500, wordBreak: 'break-word', lineHeight: 1.4 }}>{value || '—'}</p>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color, trend }) {
  return (
    <div style={{ background: C.surfaceAlt, borderRadius: 12, padding: '18px 16px', border: `1px solid ${C.border}`, textAlign: 'center', transition: 'all 0.2s ease' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color + '25'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none'; }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: color + '10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={icon} size={18} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color, marginBottom: 3, letterSpacing: '-0.3px' }}>{value}</div>
      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 500, marginBottom: trend ? 4 : 0 }}>{label}</div>
      {trend && <div style={{ fontSize: 10, color: C.success, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}><Icon d={IC.arrow} size={9} color={C.success} /> {trend}</div>}
    </div>
  );
}

function InputField({ label, name, value, onChange, type = 'text', icon, options, required, disabled }) {
  const baseStyle = { width: '100%', padding: '10px 14px 10px 40px', background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, color: C.textLight, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'all 0.2s' };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, color: C.textMuted, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label} {required && <span style={{ color: C.danger }}>*</span>}</label>
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 1, opacity: 0.6 }}>{icon}</span>}
        {type === 'select'
          ? <select name={name} value={value || ''} onChange={onChange} disabled={disabled} style={{ ...baseStyle, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1 }} onFocus={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.primaryGlow}`; }} onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}><option value="">Sélectionner...</option>{options.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>
          : <input type={type} name={name} value={value || ''} onChange={onChange} disabled={disabled} style={{ ...baseStyle, cursor: disabled ? 'not-allowed' : 'text', opacity: disabled ? 0.6 : 1 }} onFocus={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.primaryGlow}`; }} onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }} />
        }
      </div>
    </div>
  );
}

function ActivityItem({ icon, color, text, time }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: `1px solid ${C.border}`, transition: 'all 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.paddingLeft = 6; e.currentTarget.style.background = C.surfaceHover; e.currentTarget.style.borderRadius = 6; e.currentTarget.style.margin = '0 -6px'; e.currentTarget.style.padding = '12px 6px'; }}
      onMouseLeave={e => { e.currentTarget.style.paddingLeft = 0; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderRadius = 0; e.currentTarget.style.margin = '0'; e.currentTarget.style.padding = '12px 0'; }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: color + '10', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon d={icon} size={15} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 2px', fontSize: 13, color: C.textLight, fontWeight: 500, lineHeight: 1.4 }}>{text}</p>
        <span style={{ fontSize: 11, color: C.textMuted }}>{time}</span>
      </div>
    </div>
  );
}

function PasswordStrength({ password }) {
  const getStrength = (pwd) => { let s = 0; if (pwd.length >= 6) s++; if (pwd.length >= 10) s++; if (/[A-Z]/.test(pwd)) s++; if (/[0-9]/.test(pwd)) s++; if (/[^A-Za-z0-9]/.test(pwd)) s++; return s; };
  const strength = getStrength(password);
  const colors = ['#EF4444', '#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#10B981'];
  const labels = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Fort', 'Très fort'];
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
        {[1, 2, 3, 4, 5].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? colors[strength] : C.border, transition: 'all 0.3s' }}></div>)}
      </div>
      <span style={{ fontSize: 10, color: colors[strength], fontWeight: 600 }}>{labels[strength]}</span>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function AdminProfil() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [admin, setAdmin] = useState(() => ({
    nom: user.nom || '', prenom: user.prenom || '', email: user.email || '',
    telephone: user.telephone || '', adresse: user.adresse || '', sexe: user.sexe || '',
    date_naissance: user.date_naissance || '', photo: user.photo || null,
    role: user.role || 'Administrateur', id_admin: user.id_admin || user.id || null,
    date_creation: user.date_creation || new Date().toISOString(), club: user.club || 'FITCLUB Tétouan',
  }));

  const [stats, setStats] = useState({ totalMembers: 0, totalCoaches: 0, totalSessions: 0, revenue: 0 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(() => ({ ...admin }));
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Password change state — 3 steps
  const [pwdStep, setPwdStep] = useState(1);
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState({ text: '', type: '' });
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  // Password section expanded/collapsed
  const [pwdExpanded, setPwdExpanded] = useState(false);

  const notify = (text, type = 'success') => { setMessage({ text, type }); setTimeout(() => setMessage({ text: '', type: '' }), 4000); };
  const notifyPwd = (text, type = 'success') => { setPwdMessage({ text, type }); setTimeout(() => setPwdMessage({ text: '', type: '' }), 4000); };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    setLoading(false);

    const enrich = async () => {
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const res = await axios.get(`${API}/admin/profil`, { headers, timeout: 3000 });
        const apiData = res.data.profil || res.data;
        if (apiData && (apiData.nom || apiData.prenom)) { setAdmin(prev => ({ ...prev, ...apiData })); setEditForm(prev => ({ ...prev, ...apiData })); }
      } catch (e) {
        console.error('❌ Erreur chargement profil admin:', e.response?.data || e.message);
      }

      try {
        const [mRes, cRes, sRes, pRes] = await Promise.all([
          axios.get(`${API}/membres`, { headers, timeout: 3000 }).catch(() => ({ data: [] })),
          axios.get(`${API}/coachs`, { headers, timeout: 3000 }).catch(() => ({ data: [] })),
          axios.get(`${API}/seances`, { headers, timeout: 3000 }).catch(() => ({ data: [] })),
          axios.get(`${API}/paiements`, { headers, timeout: 3000 }).catch(() => ({ data: [] })),
        ]);
        const members = Array.isArray(mRes.data) ? mRes.data : [];
        const coaches = Array.isArray(cRes.data) ? cRes.data : [];
        const seances = Array.isArray(sRes.data) ? sRes.data : [];
        const paiements = Array.isArray(pRes.data) ? pRes.data : (pRes.data?.paiements || []);
        const revenue = paiements.reduce((sum, p) => sum + (Number(p.montant) || 0), 0);
        setStats({ totalMembers: members.length, totalCoaches: coaches.length, totalSessions: seances.length, revenue });
      } catch (e) {}

      try {
        const res = await axios.get(`${API}/admin/activite`, { headers, timeout: 3000 });
        const acts = res.data.activites || res.data || [];
        if (acts.length > 0) setActivities(acts);
      } catch (e) { setActivities([{ text: 'Connexion administrateur', time: "A l'instant" }]); }
    };

    enrich();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { return () => { if (photoPreview) URL.revokeObjectURL(photoPreview); }; }, [photoPreview]);

  const handleEditChange = (e) => { const { name, value } = e.target; setEditForm(prev => ({ ...prev, [name]: value })); };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) { notify('Format image non supporte (jpg, png, webp)', 'error'); return; }
    if (file.size > 2 * 1024 * 1024) { notify('Image trop lourde (max 2MB)', 'error'); return; }
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // ✅ CORRIGÉ : un seul endpoint réel, plus d'erreurs silencieuses, plus de "mode local" trompeur
  // ✅ AJOUT : synchronise localStorage('user') + notifie Layout.js pour rafraîchir l'avatar de la sidebar
  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('nom', editForm.nom || '');
      fd.append('prenom', editForm.prenom || '');
      fd.append('email', editForm.email || '');
      fd.append('telephone', editForm.telephone || '');
      fd.append('adresse', editForm.adresse || '');
      fd.append('sexe', editForm.sexe || '');
      fd.append('date_naissance', editForm.date_naissance ? editForm.date_naissance.slice(0, 10) : '');
      if (photoFile) fd.append('photo', photoFile);

      // On appelle le VRAI endpoint et on laisse l'erreur remonter si ça échoue
      await axios.put(`${API}/admin/profil`, fd, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });

      // Recharge depuis la DB pour être sûr d'afficher ce qui a vraiment été sauvegardé (photo incluse)
      const res = await axios.get(`${API}/admin/profil`, { headers: { Authorization: `Bearer ${token}` }, timeout: 5000 });
      const refreshed = res.data.profil || res.data;
      setAdmin(refreshed);
      setEditForm(refreshed);

      // Synchronise le localStorage('user') avec les nouvelles données (nom, prenom, photo...)
      // pour que Layout.js (sidebar) affiche direct la bonne info sans re-login
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...refreshed };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Prévient Layout.js de recharger la photo/avatar tout de suite
      window.dispatchEvent(new Event('user-profile-updated'));

      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoFile(null);
      setPhotoPreview(null);
      setIsEditing(false);
      notify('Profil mis à jour avec succès');
    } catch (err) {
      // ✅ on affiche le vrai message d'erreur renvoyé par le backend au lieu de rien dire
      console.error('❌ Erreur sauvegarde profil:', err.response?.data || err.message);
      notify(err.response?.data?.error || 'Erreur lors de la mise à jour', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm(admin);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null); setPhotoPreview(null); setIsEditing(false);
  };

  // Password steps
  const handlePwdStep1 = (e) => {
    e.preventDefault();
    setPwdMessage({ text: '', type: '' });
    if (!pwdForm.currentPassword) { notifyPwd('Veuillez entrer votre mot de passe actuel', 'error'); return; }
    setPwdStep(2);
  };

  const handlePwdStep2 = (e) => {
    e.preventDefault();
    setPwdMessage({ text: '', type: '' });
    if (pwdForm.newPassword.length < 6) { notifyPwd('Minimum 6 caracteres requis', 'error'); return; }
    setPwdStep(3);
  };

  const handlePwdStep3 = async (e) => {
    e.preventDefault();
    setPwdMessage({ text: '', type: '' });
    if (pwdForm.newPassword !== pwdForm.confirmPassword) { notifyPwd('Les mots de passe ne correspondent pas', 'error'); return; }

    setPwdLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/admin/password`, { currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword }, { headers: { Authorization: `Bearer ${token}` } });
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwdStep(1);
      setPwdExpanded(false);
      notifyPwd('Mot de passe modifie avec succes !');
    } catch (err) {
      notifyPwd(err.response?.data?.error || 'Mot de passe actuel incorrect', 'error');
      setPwdStep(1);
    } finally { setPwdLoading(false); }
  };

  const resetPwdFlow = () => { setPwdStep(1); setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); setPwdMessage({ text: '', type: '' }); setPwdExpanded(false); };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', background: C.bgDark, color: C.textMuted, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: `2px solid ${C.border}`, borderTop: `2px solid ${C.primary}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
        <p style={{ marginTop: 16, fontSize: 14 }}>Chargement du profil...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const revenueValue = typeof stats.revenue === 'string' ? stats.revenue : `${fmt(stats.revenue)} DH`;

  return (
    <div style={{ minHeight: '100vh', background: C.bgDark, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', paddingBottom: 40 }}>

      {/* === HEADER SOBRE & PROFESSIONNEL === */}
      <div style={{ background: C.headerBg, borderBottom: `1px solid ${C.border}`, padding: '20px 40px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.primaryGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d={IC.shield} size={20} color={C.primary} />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: 0, letterSpacing: '-0.3px' }}>Mon Profil</h1>
              <p style={{ color: C.textMuted, margin: '2px 0 0', fontSize: 12 }}>Gérez vos informations personnelles et sécurité</p>
            </div>
          </div>

          {/* === BOUTON MOT DE PASSE DANS LA BARRE === */}
          <button
            onClick={() => setPwdExpanded(!pwdExpanded)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 8,
              background: pwdExpanded ? C.primaryGlow : 'transparent',
              border: `1px solid ${pwdExpanded ? C.primary + '30' : C.border}`,
              color: pwdExpanded ? C.primary : C.textMuted,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderLight; e.currentTarget.style.color = C.textLight; }}
            onMouseLeave={e => { if (!pwdExpanded) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}}
          >
            <Icon d={IC.lock} size={15} color="currentColor" />
            Changer le mot de passe
            <Icon d={IC.chevronRight} size={14} color="currentColor" style={{ transform: pwdExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>
      </div>

      {/* === SECTION MOT DE PASSE DÉPLIABLE DANS LA BARRE === */}
      {pwdExpanded && (
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '24px 40px', animation: 'slideDown 0.3s ease' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon d={IC.security} size={16} color={C.warning} />
                Changer votre mot de passe
              </h3>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1, 2, 3].map(s => (
                  <div key={s} style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: s === pwdStep ? C.primary : s < pwdStep ? C.success : C.surfaceAlt, color: s === pwdStep ? '#fff' : s < pwdStep ? C.success : C.textMuted, border: `1.5px solid ${s === pwdStep ? C.primary : s < pwdStep ? C.success : C.border}` }}>{s}</div>
                ))}
              </div>
            </div>

            <p style={{ fontSize: 12, color: C.textMuted, margin: '0 0 16px' }}>
              {pwdStep === 1 ? 'Étape 1 : Vérifiez votre identité' : pwdStep === 2 ? 'Étape 2 : Choisissez un nouveau mot de passe' : 'Étape 3 : Confirmez le nouveau mot de passe'}
            </p>

            {pwdMessage.text && (
              <div style={{ padding: '10px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, marginBottom: 14, background: pwdMessage.type === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)', border: `1px solid ${pwdMessage.type === 'error' ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}`, color: pwdMessage.type === 'error' ? '#f87171' : '#34d399', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon d={pwdMessage.type === 'error' ? IC.warning : IC.check} size={12} /> {pwdMessage.text}
              </div>
            )}

            {/* STEP 1 */}
            {pwdStep === 1 && (
              <form onSubmit={handlePwdStep1}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 11, color: C.textMuted, fontWeight: 600, marginBottom: 6 }}>MOT DE PASSE ACTUEL</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showCurrentPwd ? 'text' : 'password'} value={pwdForm.currentPassword} onChange={e => setPwdForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      style={{ width: '100%', padding: '10px 40px 10px 14px', background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, color: C.textLight, fontSize: 14, outline: 'none', boxSizing: 'border-box', letterSpacing: pwdForm.currentPassword ? 2 : 0 }}
                      onFocus={e => { e.currentTarget.style.borderColor = C.warning; }}
                      onBlur={e => { e.currentTarget.style.borderColor = C.border; }}
                      placeholder="Entrez votre mot de passe actuel" required autoFocus />
                    <button type="button" onClick={() => setShowCurrentPwd(!showCurrentPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 3 }}>
                      <Icon d={showCurrentPwd ? IC.eyeOff : IC.eye} size={16} color={C.textMuted} />
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={resetPwdFlow} style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 8, color: C.textMuted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
                  <button type="submit" style={{ padding: '8px 18px', background: C.warning, border: 'none', borderRadius: 8, color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Vérifier</button>
                </div>
              </form>
            )}

            {/* STEP 2 */}
            {pwdStep === 2 && (
              <form onSubmit={handlePwdStep2}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 11, color: C.textMuted, fontWeight: 600, marginBottom: 6 }}>NOUVEAU MOT DE PASSE</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showNewPwd ? 'text' : 'password'} value={pwdForm.newPassword} onChange={e => setPwdForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      style={{ width: '100%', padding: '10px 40px 10px 14px', background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, color: C.textLight, fontSize: 14, outline: 'none', boxSizing: 'border-box', letterSpacing: pwdForm.newPassword ? 2 : 0 }}
                      onFocus={e => { e.currentTarget.style.borderColor = C.info; }}
                      onBlur={e => { e.currentTarget.style.borderColor = C.border; }}
                      placeholder="Minimum 6 caractères" required autoFocus />
                    <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 3 }}>
                      <Icon d={showNewPwd ? IC.eyeOff : IC.eye} size={16} color={C.textMuted} />
                    </button>
                  </div>
                  <PasswordStrength password={pwdForm.newPassword} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setPwdStep(1)} style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 8, color: C.textMuted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Retour</button>
                  <button type="submit" style={{ padding: '8px 18px', background: C.info, border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Continuer</button>
                </div>
              </form>
            )}

            {/* STEP 3 */}
            {pwdStep === 3 && (
              <form onSubmit={handlePwdStep3}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 11, color: C.textMuted, fontWeight: 600, marginBottom: 6 }}>CONFIRMER LE MOT DE PASSE</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showConfirmPwd ? 'text' : 'password'} value={pwdForm.confirmPassword} onChange={e => setPwdForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      style={{ width: '100%', padding: '10px 40px 10px 14px', background: C.surfaceAlt, border: `1px solid ${pwdForm.confirmPassword && pwdForm.newPassword !== pwdForm.confirmPassword ? C.danger : C.border}`, borderRadius: 8, color: C.textLight, fontSize: 14, outline: 'none', boxSizing: 'border-box', letterSpacing: pwdForm.confirmPassword ? 2 : 0 }}
                      onFocus={e => { e.currentTarget.style.borderColor = C.success; }}
                      onBlur={e => { e.currentTarget.style.borderColor = pwdForm.confirmPassword && pwdForm.newPassword !== pwdForm.confirmPassword ? C.danger : C.border; }}
                      placeholder="Retapez le nouveau mot de passe" required autoFocus />
                    <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 3 }}>
                      <Icon d={showConfirmPwd ? IC.eyeOff : IC.eye} size={16} color={C.textMuted} />
                    </button>
                  </div>
                  {pwdForm.confirmPassword && pwdForm.newPassword !== pwdForm.confirmPassword && (
                    <p style={{ margin: '6px 0 0', fontSize: 11, color: C.danger, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}><Icon d={IC.warning} size={11} /> Les mots de passe ne correspondent pas</p>
                  )}
                  {pwdForm.confirmPassword && pwdForm.newPassword === pwdForm.confirmPassword && (
                    <p style={{ margin: '6px 0 0', fontSize: 11, color: C.success, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}><Icon d={IC.check} size={11} /> Parfait ! Les mots de passe correspondent</p>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" onClick={() => setPwdStep(2)} style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 8, color: C.textMuted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Retour</button>
                  <button type="submit" disabled={pwdLoading || pwdForm.newPassword !== pwdForm.confirmPassword} style={{ padding: '8px 18px', background: C.success, border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, cursor: (pwdLoading || pwdForm.newPassword !== pwdForm.confirmPassword) ? 'not-allowed' : 'pointer', opacity: (pwdLoading || pwdForm.newPassword !== pwdForm.confirmPassword) ? 0.5 : 1 }}>
                    {pwdLoading ? 'Modification...' : 'Changer le mot de passe'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {message.text && (
        <div style={{ margin: '16px 40px 0', padding: '12px 18px', borderRadius: 10, border: '1px solid', fontSize: 13, fontWeight: 600, background: message.type === 'error' ? 'rgba(239,68,68,0.06)' : message.type === 'warning' ? 'rgba(245,158,11,0.06)' : 'rgba(16,185,129,0.06)', borderColor: message.type === 'error' ? 'rgba(239,68,68,0.2)' : message.type === 'warning' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)', color: message.type === 'error' ? '#f87171' : message.type === 'warning' ? '#fbbf24' : '#34d399', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon d={message.type === 'error' ? IC.warning : IC.check} size={14} /> {message.text}
        </div>
      )}

      <div style={{ padding: '24px 40px', display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>

        {/* LEFT COLUMN */}
        <div>
          <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: '28px 20px', textAlign: 'center', marginBottom: 16 }}>
            <div style={{ marginBottom: 14 }}>
              <Avatar admin={admin} size={100} previewUrl={photoPreview} />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: '0 0 4px' }}>{admin.prenom} {admin.nom}</h2>
            <div style={{ marginBottom: 10 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 16, fontSize: 11, fontWeight: 700, background: C.primaryGlow, color: C.primary, border: `1px solid ${C.primary}25` }}>
                <Icon d={IC.shield} size={10} color={C.primary} /> {admin.role || 'Administrateur'}
              </span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ padding: '4px 12px', borderRadius: 16, fontSize: 10, fontWeight: 700, background: C.successGlow, border: `1px solid ${C.success}30`, color: C.success, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.success, display: 'inline-block' }}></span> En ligne
              </span>
            </div>
            <div style={{ padding: '8px 12px', background: C.surfaceAlt, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, color: C.textMuted, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <Icon d={IC.id} size={12} color={C.textMuted} /> Admin <strong style={{ color: C.textLight }}>#{admin.id_admin || admin.id || '—'}</strong>
            </div>
            <button onClick={() => setIsEditing(true)} style={{ width: '100%', padding: '10px 16px', background: C.primary, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              onMouseEnter={e => { e.currentTarget.style.background = C.primaryDark; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.primary; }}>
              <Icon d={IC.edit} size={14} color="#fff" /> Modifier mon profil
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <StatCard icon={IC.members} value={fmt(stats.totalMembers)} label="Membres" color={C.info} trend="+12%" />
            <StatCard icon={IC.dumbbell} value={fmt(stats.totalCoaches)} label="Coachs" color={C.success} />
            <StatCard icon={IC.sessions} value={fmt(stats.totalSessions)} label="Séances" color={C.warning} />
            <StatCard icon={IC.money} value={revenueValue} label="Revenus" color={C.purple} trend="+8%" />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* PERSONAL INFO */}
          <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: '24px 28px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: C.primaryGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={IC.user} size={16} color={C.primary} />
              </div>
              Informations personnelles
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 10 }}>
              <InfoRow icon={IC.user} label="Nom complet" value={`${admin.prenom} ${admin.nom}`} />
              <InfoRow icon={IC.calendar} label="Date de naissance" value={admin.date_naissance ? new Date(admin.date_naissance).toLocaleDateString('fr-FR') : null} />
              <InfoRow icon={IC.gender} label="Sexe" value={admin.sexe} />
              <InfoRow icon={IC.mail} label="Email" value={admin.email} color={C.info} />
              <InfoRow icon={IC.phone} label="Téléphone" value={admin.telephone} />
              <InfoRow icon={IC.mapPin} label="Adresse" value={admin.adresse} />
            </div>
          </div>

          {/* PROFESSIONAL INFO */}
          <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: '24px 28px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: C.successGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={IC.work} size={16} color={C.success} />
              </div>
              Informations professionnelles
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 10 }}>
              <InfoRow icon={IC.shield} label="Rôle" value={admin.role || 'Administrateur'} color={C.warning} />
              <InfoRow icon={IC.building} label="Club" value={admin.club || 'FITCLUB Tétouan'} />
              <InfoRow icon={IC.calendar} label="Membre depuis" value={admin.date_creation ? new Date(admin.date_creation).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'Janvier 2024'} />
              <InfoRow icon={IC.id} label="ID Admin" value={`#${admin.id_admin || admin.id || '—'}`} color={C.textMuted} />
            </div>
          </div>

          {/* ACTIVITY */}
          <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: '24px 28px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={IC.activity} size={16} color={C.purple} />
              </div>
              Activité récente
            </h3>
            {activities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: C.textMuted }}>
                <Icon d={IC.inbox} size={36} color={C.textMuted} />
                <p style={{ margin: '10px 0 0', fontSize: 13 }}>Aucune activité récente</p>
              </div>
            ) : (
              <div>
                {activities.slice(0, 6).map((a, i) => {
                  const colorMap = { 'Nouveau membre': C.success, 'Paiement': C.warning, 'Seance': C.danger, 'Coach': C.info, 'equipement': C.purple };
                  let color = C.textMuted;
                  for (const key of Object.keys(colorMap)) { if (a.text?.includes(key)) { color = colorMap[key]; break; } }
                  return (<ActivityItem key={i} icon={a.icon || IC.check} color={color} text={a.text} time={a.time} />);
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflow: 'auto' }}>
          <div style={{ background: C.surface, borderRadius: 20, border: `1px solid ${C.border}`, width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '20px 28px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: C.surface, zIndex: 10, borderRadius: '20px 20px 0 0' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon d={IC.edit} size={16} color={C.primary} /> Modifier mon profil
              </h2>
              <button onClick={handleCancel} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', padding: 5, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.color = C.textLight; e.currentTarget.style.background = C.surfaceAlt; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.background = 'transparent'; }}>
                <Icon d={IC.close} size={20} color="currentColor" />
              </button>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
                <div style={{ position: 'relative', marginBottom: 12 }}>
                  <Avatar admin={admin} size={90} previewUrl={photoPreview} />
                  <label htmlFor="photo-upload" style={{ position: 'absolute', bottom: -2, right: -2, width: 32, height: 32, borderRadius: '50%', background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `3px solid ${C.surface}` }}>
                    <Icon d={IC.camera} size={14} color="#fff" />
                  </label>
                  <input id="photo-upload" type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handlePhotoChange} style={{ display: 'none' }} />
                </div>
                <span style={{ fontSize: 11, color: C.textMuted }}>{photoFile ? photoFile.name : "Cliquez sur l'icône pour changer la photo"}</span>
                <span style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>JPG, PNG ou WEBP — 2MB max</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <InputField label="Prénom" name="prenom" value={editForm.prenom} onChange={handleEditChange} icon={<Icon d={IC.user} size={14} color={C.textMuted} />} required />
                <InputField label="Nom" name="nom" value={editForm.nom} onChange={handleEditChange} icon={<Icon d={IC.user} size={14} color={C.textMuted} />} required />
                <InputField label="Email" name="email" value={editForm.email} onChange={handleEditChange} icon={<Icon d={IC.mail} size={14} color={C.textMuted} />} type="email" required />
                <InputField label="Téléphone" name="telephone" value={editForm.telephone} onChange={handleEditChange} icon={<Icon d={IC.phone} size={14} color={C.textMuted} />} />
                <InputField label="Date de naissance" name="date_naissance" value={editForm.date_naissance ? editForm.date_naissance.slice(0, 10) : ''} onChange={handleEditChange} icon={<Icon d={IC.calendar} size={14} color={C.textMuted} />} type="date" />
                <InputField label="Sexe" name="sexe" value={editForm.sexe} onChange={handleEditChange} icon={<Icon d={IC.gender} size={14} color={C.textMuted} />} type="select" options={['Homme', 'Femme']} />
                <InputField label="Adresse" name="adresse" value={editForm.adresse} onChange={handleEditChange} icon={<Icon d={IC.mapPin} size={14} color={C.textMuted} />} />
              </div>
            </div>
            <div style={{ padding: '16px 28px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'flex-end', gap: 10, position: 'sticky', bottom: 0, background: C.surface, zIndex: 10 }}>
              <button onClick={handleCancel} style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 8, color: C.textMuted, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: '8px 20px', background: C.primary, border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                {saving ? 'Enregistrement...' : <><Icon d={IC.save} size={14} color="#fff" /> Enregistrer</>}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}