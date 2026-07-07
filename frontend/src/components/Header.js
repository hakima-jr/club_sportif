// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const [user,    setUser]    = useState(null);
  const [hovered, setHovered] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};

  if (!user) return null;

  const isAdmin     = user.role === 'admin';
  const isReception = user.role === 'reception';
  const isCoach     = user.role === 'coach';
  const isMembre    = user.role === 'membre';

  const roleLabel = isAdmin     ? '🔴 Administrateur'
                  : isReception ? '🟡 Réception'
                  : isCoach     ? '🟢 Coach'
                  : isMembre    ? '🔵 Membre' : '';

  const roleColor = isAdmin     ? '#dc2626'
                  : isReception ? '#d97706'
                  : isCoach     ? '#16a34a'
                  : '#2563eb';

  const dashboardPath = isAdmin     ? '/admin/dashboard'
                      : isReception ? '/reception/dashboard'
                      : isCoach     ? '/coach/dashboard'
                      : '/membre/dashboard';

  // Links per role
  const links = isAdmin ? [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/members',         label: 'Membres'   },
    { to: '/admin/coachs',    label: 'Coachs'    },
    { to: '/admin/staff',     label: 'Staff'     },
    { to: '/abonnements',     label: 'Abonnements'},
    { to: '/paiements',       label: 'Paiements' },
    { to: '/seances',         label: 'Séances'   },
    { to: '/presence',        label: 'Présences' },
    { to: '/rapports',        label: 'Rapports'  },
  ] : isReception ? [
    { to: '/reception/dashboard', label: 'Dashboard'   },
    { to: '/members',             label: 'Membres'     },
    { to: '/abonnements',         label: 'Abonnements' },
    { to: '/paiements',           label: 'Paiements'   },
    { to: '/seances',             label: 'Séances'     },
    { to: '/presence',            label: 'Présences'   },
  ] : isCoach ? [
    { to: '/coach/dashboard', label: 'Dashboard'   },
    { to: '/coach/seances',   label: 'Mes Séances' },
    { to: '/coach/membres',   label: 'Mes Membres' },
    { to: '/presence',        label: 'Présences'   },
  ] : [
    { to: '/membre/dashboard',      label: 'Mon Espace'     },
    { to: '/membre/profil',         label: 'Mon Profil'     },
    { to: '/membre/abonnement',     label: 'Abonnement'     },
    { to: '/membre/paiements',      label: 'Mes Paiements'  },
    { to: '/membre/paiement-carte', label: 'Payer par carte'},
  ];

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <Link to={dashboardPath} style={styles.logo}>
        <span style={styles.logoIcon}>✦</span>
        <span style={styles.logoText}>Club Sportif</span>
      </Link>

      {/* Links */}
      <div style={styles.links}>
        {links.map(l => {
          const active = location.pathname === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              style={{
                ...styles.link,
                ...(active           ? styles.linkActive : {}),
                ...(hovered === l.to && !active ? styles.linkHover : {}),
              }}
              onMouseEnter={() => setHovered(l.to)}
              onMouseLeave={() => setHovered(null)}
            >
              {l.label}
            </Link>
          );
        })}
      </div>

      {/* User zone */}
      <div style={styles.userZone}>
        <div style={styles.userInfo}>
          <span style={{ ...styles.roleBadge, background: roleColor }}>{roleLabel}</span>
          <span style={styles.userName}>{user.prenom} {user.nom}</span>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>Déconnexion</button>
      </div>
    </nav>
  );
}

const styles = {
  nav:        {
    background: '#161b27',
    borderBottom: '1px solid #2d3448',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    height: 54,
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    fontFamily: 'Segoe UI, sans-serif',
  },
  logo:       {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    marginRight: 12,
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoIcon:   { color: '#a78bfa', fontSize: 17 },
  logoText:   { color: '#e2e8f0', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' },
  links:      {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    flex: 1,
    overflowX: 'auto',
    scrollbarWidth: 'none',
  },
  link:       {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 500,
    padding: '6px 11px',
    borderRadius: 6,
    whiteSpace: 'nowrap',
    transition: 'all .15s',
  },
  linkActive: { color: '#e2e8f0', background: '#232938' },
  linkHover:  { color: '#cbd5e1', background: '#1e2537' },
  userZone:   {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    marginLeft: 8,
  },
  userInfo:   { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 },
  roleBadge:  {
    color: '#fff',
    fontSize: 10,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 10,
    display: 'inline-block',
  },
  userName:   { color: '#e2e8f0', fontSize: 13, fontWeight: 600 },
  logoutBtn:  {
    padding: '6px 14px',
    background: '#7f1d1d',
    border: '1px solid #dc2626',
    borderRadius: 8,
    color: '#fca5a5',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default Header;