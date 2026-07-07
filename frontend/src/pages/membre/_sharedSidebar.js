// src/pages/membre/MemberSidebar.js  (Sidebar + sidebarStyles)
import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Icon({ d, size = 16, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}
const IC = {
  home:    ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z','M9 22V12h6v10'],
  user:    ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  sub:     ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8'],
  payment: ['M1 10h22','M2 5h20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z'],
  card:    ['M3 10h18','M7 15h.01','M11 15h2','M2 7h20a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z'],
  camera:  ['M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z','M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  arrow:   'M9 18l6-6-6-6',
};

const NAV_ICONS = {
  '/membre/dashboard':      IC.home,
  '/membre/profil':         IC.user,
  '/membre/abonnement':     IC.sub,
  '/membre/paiements':      IC.payment,
  '/membre/paiement-carte': IC.card,
};

export function Sidebar({ profil, email, userId }) {
  const location = useLocation();
  const fileRef  = useRef();
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(`photo_${userId}`);
    if (saved) setPhoto(saved);
  }, [userId]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      localStorage.setItem(`photo_${userId}`, ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const initials = `${profil?.prenom?.[0] || ''}${profil?.nom?.[0] || ''}`.toUpperCase();

  const navLinks = [
    { to: '/membre/dashboard',      label: 'Mon Espace'      },
    { to: '/membre/profil',         label: 'Mon Profil'      },
    { to: '/membre/abonnement',     label: 'Abonnement'      },
    { to: '/membre/paiements',      label: 'Mes Paiements'   },
    { to: '/membre/paiement-carte', label: 'Payer par carte' },
  ];

  return (
    <div style={sidebarStyles.sidebar}>
      <div style={sidebarStyles.sideTop}>
        <div style={sidebarStyles.avatarWrap}>
          {photo
            ? <img src={photo} alt="profil" style={sidebarStyles.avatarImg} />
            : <div style={sidebarStyles.avatarPlaceholder}>{initials}</div>}
          <button onClick={() => fileRef.current.click()} style={sidebarStyles.cameraBtn}>
            <Icon d={IC.camera} size={14} color="#fff" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
        </div>
        <h3 style={sidebarStyles.sidebarName}>{profil?.prenom} {profil?.nom}</h3>
        <p style={sidebarStyles.sidebarEmail}>{email}</p>
        <span style={sidebarStyles.memberBadge}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:'#93c5fd', display:'inline-block', marginRight:6 }} />
          Membre
        </span>
      </div>

      <div style={sidebarStyles.sideMenu}>
        <p style={sidebarStyles.menuLabel}>NAVIGATION</p>
        {navLinks.map(link => {
          const active = location.pathname === link.to;
          return (
            <Link key={link.to} to={link.to}
              style={{ ...sidebarStyles.menuLink, ...(active ? sidebarStyles.menuItemActive : {}) }}>
              <Icon d={NAV_ICONS[link.to]} size={16} color={active ? '#c4b5fd' : '#cbd5e1'} />
              <span>{link.label}</span>
              <Icon d={IC.arrow} size={14} color={active ? '#c4b5fd' : '#64748b'} style={{ marginLeft:'auto' }} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export const sidebarStyles = {
  page:        { minHeight: '100vh', background: '#0f172a', fontFamily: 'Segoe UI, sans-serif' },
  toast:       { position: 'fixed', top: 20, right: 20, color: '#fff', padding: '12px 20px', borderRadius: 10, fontWeight: 600, zIndex: 1000 },
  layout:      { display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, padding: 24, maxWidth: 1400, margin: '0 auto' },
  sidebar:     { background: '#1e293b', borderRadius: 16, padding: 20, border: '1px solid #334155', height: 'fit-content', position: 'sticky', top: 24 },
  sideTop:     { textAlign: 'center', paddingBottom: 20, borderBottom: '1px solid #334155' },
  avatarWrap:  { position: 'relative', width: 100, height: 100, margin: '0 auto 12px' },
  avatarImg:   { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' },
  avatarPlaceholder: { width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 32, fontWeight: 700 },
  cameraBtn:   { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: '50%', border: '2px solid #1e293b', background: '#6366f1', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  sidebarName: { color: '#f1f5f9', margin: '8px 0 4px', fontSize: 16, fontWeight: 700 },
  sidebarEmail:{ color: '#94a3b8', fontSize: 12, margin: 0 },
  memberBadge: { display: 'inline-flex', alignItems: 'center', marginTop: 10, background: '#1e3a8a', color: '#93c5fd', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  sideMenu:    { paddingTop: 16 },
  menuLabel:   { color: '#64748b', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8 },
  menuItem:    { width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: 8, color: '#cbd5e1', cursor: 'pointer', fontSize: 14, marginBottom: 4, textAlign: 'left' },
  menuItemActive: { background: '#312e81', color: '#c4b5fd' },
  menuLink:    { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#cbd5e1', textDecoration: 'none', fontSize: 14, marginBottom: 4 },
  menuArrow:   { marginLeft: 'auto', color: '#64748b' },
  content:     { background: '#1e293b', borderRadius: 16, padding: 28, border: '1px solid #334155', minHeight: 600 },
};