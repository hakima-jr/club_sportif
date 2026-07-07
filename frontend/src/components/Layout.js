// src/components/Layout.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';

function Icon({ d, size = 16, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}

const IC = {
  dashboard: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M3 14h7v7H3z', 'M14 14h7v7h-7z'],
  users:     ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  coach:     ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M12 11v4', 'M10 15h4'],
  staff:     ['M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z', 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'],
  sub:       ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
  payment:   ['M1 10h22', 'M2 5h20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z'],
  calendar:  ['M3 4h18v18H3z', 'M16 2v4', 'M8 2v4', 'M3 10h18'],
  check:     ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
  shop:      ['M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z', 'M3 6h18', 'M16 10a4 4 0 0 1-8 0'],
  chart:     ['M18 20V10', 'M12 20V4', 'M6 20v-6'],
  user:      ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  plus:      ['M12 5v14', 'M5 12h14'],
  logout:    ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'M16 17l5-5-5-5', 'M21 12H9'],
  spark:     ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
};

const roleConfig = {
  reception: { color: '#d97706', label: 'Réception', dash: '/reception/dashboard', links: [{ to: '/reception/dashboard', iconKey: 'dashboard', label: 'Dashboard' }, { to: '/members', iconKey: 'users', label: 'Membres' }, { to: '/abonnements', iconKey: 'sub', label: 'Abonnements' }, { to: '/paiements', iconKey: 'payment', label: 'Paiements' }, { to: '/seances', iconKey: 'calendar', label: 'Séances' }, { to: '/presence', iconKey: 'check', label: 'Présences' }] },
  admin: { color: '#dc2626', label: 'Administrateur', dash: '/admin/dashboard', links: [{ to: '/admin/dashboard', iconKey: 'dashboard', label: 'Dashboard' }, { to: '/admin/profil', iconKey: 'user', label: 'Mon Profil' }, { to: '/members', iconKey: 'users', label: 'Membres' }, { iconKey: 'coach', label: 'Coachs', children: [{ to: '/admin/coachs', iconKey: 'users', label: 'Profils Coachs' }, { to: '/admin/coachs/ajouter', iconKey: 'plus', label: 'Ajouter un Coach' }] }, { to: '/admin/staff', iconKey: 'staff', label: 'Staff' }, { to: '/abonnements', iconKey: 'sub', label: 'Abonnements' }, { to: '/paiements', iconKey: 'payment', label: 'Paiements' }, { to: '/seances', iconKey: 'calendar', label: 'Séances' }, { to: '/presence', iconKey: 'check', label: 'Présences' }, { to: '/shop', iconKey: 'shop', label: 'Boutique' }, { to: '/rapports', iconKey: 'chart', label: 'Rapports' }] },
  coach: { color: '#16a34a', label: 'Coach', dash: '/coach/dashboard', links: [{ to: '/coach/dashboard', iconKey: 'dashboard', label: 'Dashboard' }, { to: '/coach/profil', iconKey: 'user', label: 'Mon Profil' }, { to: '/coach/seances', iconKey: 'calendar', label: 'Mes Séances' }, { to: '/coach/membres', iconKey: 'users', label: 'Mes Membres' }] },
  membre: { color: '#2563eb', label: 'Membre', dash: '/membre/dashboard', links: [{ to: '/membre/dashboard', iconKey: 'dashboard', label: 'Mon Espace' }, { to: '/membre/profil', iconKey: 'user', label: 'Mon Profil' }, { to: '/membre/abonnement', iconKey: 'sub', label: 'Mon Abonnement' }, { to: '/membre/paiements', iconKey: 'payment', label: 'Mes Paiements' }, { to: '/shop', iconKey: 'shop', label: 'Boutique' }] },
};

function NavItem({ link, collapsed, location, accentColor }) {
  const hasChildren = !!link.children;
  const linkPath = link.to || link.path;
  const isChildActive = hasChildren && link.children.some(c => location.pathname.startsWith(c.to));
  const [open, setOpen] = useState(isChildActive);

  if (hasChildren) {
    return (
      <div>
        <button onClick={() => !collapsed && setOpen(o => !o)} title={collapsed ? link.label : ''}
          style={{ ...S.navLink, width: '100%', background: isChildActive ? '#232938' : 'transparent', color: isChildActive ? '#e2e8f0' : '#94a3b8', justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px 0' : '10px 16px', border: 'none', cursor: 'pointer', fontFamily: 'Segoe UI, sans-serif' }}>
          <Icon d={IC[link.iconKey]} size={16} color={isChildActive ? '#e2e8f0' : '#94a3b8'} />
          {!collapsed && (
            <>
              <span style={S.navLinkLabel}>{link.label}</span>
              <span style={{ fontSize: 11, color: '#64748b', marginLeft: 4 }}>{open ? '▾' : '›'}</span>
            </>
          )}
          {isChildActive && !collapsed && <span style={{ ...S.activeDot, background: accentColor }} />}
        </button>
        {open && !collapsed && (
          <div style={{ paddingLeft: 12, marginTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {link.children.map(child => {
              const active = location.pathname === child.to;
              return (
                <Link key={child.to} to={child.to} style={{ ...S.navLink, padding: '8px 12px', fontSize: 12, borderLeft: `2px solid ${active ? accentColor : '#2d3448'}`, borderRadius: '0 8px 8px 0', ...(active ? S.navLinkActive : {}) }}>
                  <Icon d={IC[child.iconKey]} size={13} color={active ? '#e2e8f0' : '#94a3b8'} />
                  <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{child.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const active = location.pathname === linkPath;
  return (
    <Link to={linkPath} title={collapsed ? link.label : ''} style={{ ...S.navLink, ...(active ? S.navLinkActive : {}), justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px 0' : '10px 16px' }}>
      <Icon d={IC[link.iconKey]} size={16} color={active ? '#e2e8f0' : '#94a3b8'} />
      {!collapsed && <span style={S.navLinkLabel}>{link.label}</span>}
      {active && !collapsed && <span style={{ ...S.activeDot, background: accentColor }} />}
    </Link>
  );
}

function SidebarAvatar({ photoUrl, initials, color, size }) {
  const base = { width: size, height: size, borderRadius: '50%', flexShrink: 0 };
  if (photoUrl) {
    return <img src={photoUrl} alt="avatar" style={{ ...base, objectFit: 'cover', border: `2px solid ${color}` }} />;
  }
  return (
    <div style={{ ...base, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: size * 0.36 }}>
      {initials || '?'}
    </div>
  );
}

export default function Layout({ children }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [photoUrl, setPhotoUrl]   = useState(null);
  const [userData, setUserData]   = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));

  const loadUserAndPhoto = () => {
    const user  = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    setUserData(user);

    const userId     = user.id_membre || user.id_coach || user.id_admin || user.id || user.id_personne;
    const savedPhoto  = localStorage.getItem(`member_photo_${userId}`);

    if (savedPhoto) {
      // Photo stockée en local (base64) — cas membre
      setPhotoUrl(savedPhoto);
    } else if (user.photo) {
      // Le user en localStorage a déjà un nom de fichier photo
      setPhotoUrl(`${API}/uploads/${user.photo}?t=${Date.now()}`);
    } else if (user.role === 'coach' && user.id_coach) {
      axios.get(`${API}/coachs/${user.id_coach}`)
        .then(({ data }) => {
          setPhotoUrl(data.photo ? `${API}/uploads/${data.photo}?t=${Date.now()}` : null);
        }).catch(() => setPhotoUrl(null));
    } else if (user.role === 'admin' && token) {
      axios.get(`${API}/admin/profil`, { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data }) => {
          const profil = data.profil || data;
          setPhotoUrl(profil.photo ? `${API}/uploads/${profil.photo}?t=${Date.now()}` : null);
        }).catch(() => setPhotoUrl(null));
    } else {
      setPhotoUrl(null);
    }
  };

  useEffect(() => {
    loadUserAndPhoto();
    window.addEventListener('user-profile-updated', loadUserAndPhoto);
    window.addEventListener('coach-photo-updated', loadUserAndPhoto);
    window.addEventListener("storage", loadUserAndPhoto);
    return () => {
      window.removeEventListener('user-profile-updated', loadUserAndPhoto);
      window.removeEventListener('coach-photo-updated', loadUserAndPhoto);
      window.removeEventListener("storage", loadUserAndPhoto);
    };
  }, []);

  const config   = roleConfig[userData.role] || roleConfig.reception;
  const initials = `${userData.prenom?.[0] || ''}${userData.nom?.[0] || ''}`.toUpperCase();

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};

  const sideW = collapsed ? 64 : 220;

  return (
    <div style={S.root}>
      <aside style={{ ...S.sidebar, width: sideW }}>
        <div style={S.sideTop}>
          {!collapsed && (
            <Link to={config.dash} style={S.logo}>
              <Icon d={IC.spark} size={14} color="#a78bfa" />
              <span style={S.logoText}>Club Sportif</span>
            </Link>
          )}
          <button style={S.toggleBtn} onClick={() => setCollapsed(c => !c)}>{collapsed ? '›' : '‹'}</button>
        </div>

        {!collapsed ? (
          <div style={S.userBlock}>
            <SidebarAvatar photoUrl={photoUrl} initials={initials} color={config.color} size={44} />
            <div style={S.userName}>{userData.prenom} {userData.nom}</div>
            <div style={{ ...S.rolePill, background: config.color + '33', color: config.color }}>{config.label}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
            <SidebarAvatar photoUrl={photoUrl} initials={initials} color={config.color} size={36} />
          </div>
        )}

        <div style={S.divider} />
        <nav style={S.nav}>
          {config.links.map((l, i) => (
            <NavItem key={l.to || l.path || l.label + i} link={l} collapsed={collapsed} location={location} accentColor={config.color} />
          ))}
        </nav>

        <div style={S.sideBottom}>
          <div style={S.divider} />
          <button style={{ ...S.logoutBtn, justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px 0' : '10px 16px' }} onClick={handleLogout}>
            <Icon d={IC.logout} size={16} color="#f87171" />
            {!collapsed && <span style={{ marginLeft: 10, fontSize: 13 }}>Déconnexion</span>}
          </button>
        </div>
      </aside>

      <main style={{ ...S.main, marginLeft: sideW, padding: '28px 32px' }}>{children}</main>
    </div>
  );
}

const S = {
  root:          { display: 'flex', minHeight: '100vh', background: '#0f1117', fontFamily: 'Segoe UI, sans-serif' },
  sidebar:       { position: 'fixed', top: 0, left: 0, bottom: 0, background: '#161b27', borderRight: '1px solid #2d3448', display: 'flex', flexDirection: 'column', transition: 'width .2s ease', zIndex: 200, overflow: 'hidden' },
  sideTop:       { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 12px 8px', minHeight: 56 },
  logo:          { display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', overflow: 'hidden' },
  logoText:      { color: '#e2e8f0', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' },
  toggleBtn:     { background: '#232938', border: '1px solid #2d3448', borderRadius: 6, color: '#94a3b8', width: 28, height: 28, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  userBlock:     { padding: '12px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  avatar:        { width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0 },
  userName:      { color: '#e2e8f0', fontSize: 13, fontWeight: 600, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' },
  rolePill:      { fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 10, whiteSpace: 'nowrap' },
  divider:       { height: 1, background: '#2d3448', margin: '4px 0' },
  nav:           { flex: 1, overflowY: 'auto', padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: 2 },
  navLink:       { display: 'flex', alignItems: 'center', gap: 10, borderRadius: 8, color: '#94a3b8', textDecoration: 'none', fontSize: 13, fontWeight: 500, transition: 'all .15s', position: 'relative' },
  navLinkActive: { color: '#e2e8f0', background: '#232938' },
  navLinkLabel:  { flex: 1, whiteSpace: 'nowrap' },
  activeDot:     { width: 6, height: 6, borderRadius: '50%', flexShrink: 0 },
  sideBottom:    { padding: '0 8px 12px' },
  logoutBtn:     { width: '100%', display: 'flex', alignItems: 'center', gap: 0, background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', borderRadius: 8, fontFamily: 'Segoe UI, sans-serif', transition: 'background .15s' },
  main:          { flex: 1, minHeight: '100vh', transition: 'margin-left .2s ease', background: '#0f1117' },
};