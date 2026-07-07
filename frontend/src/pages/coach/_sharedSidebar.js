// src/pages/coach/_SharedSidebar.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Icon({ d, size = 16, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}
const IC = {
  home:     ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z','M9 22V12h6v10'],
  calendar: ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  users:    ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  user:     ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  dumbbell: ['M6.5 6.5h11','M6.5 17.5h11','M3 9.5h3v5H3z','M18 9.5h3v5h-3z','M6 12h12'],
  logout:   ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4','M16 17l5-5-5-5','M21 12H9'],
};

const NAV_ICONS = {
  '/coach/dashboard': IC.home,
  '/coach/seances':   IC.calendar,
  '/coach/membres':   IC.users,
  '/coach/profil':    IC.user,
};

const navItems = [
  { to: '/coach/dashboard', label: 'Dashboard'   },
  { to: '/coach/seances',   label: 'Mes Séances' },
  { to: '/coach/membres',   label: 'Mes Membres' },
  { to: '/coach/profil',    label: 'Mon Profil'  },
];

export const sidebarStyles = {
  shell:    { display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '100vh', background: '#0a0e1a', color: '#e2e8f0', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  sidebar:  { background: '#111827', borderRight: '1px solid #1f2937', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 8 },
  brand:    { fontSize: 20, fontWeight: 800, color: '#fff', padding: '8px 12px 24px', borderBottom: '1px solid #1f2937', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 },
  userBox:  { padding: '12px', background: '#0a0e1a', borderRadius: 10, marginBottom: 16 },
  userName: { fontSize: 14, fontWeight: 700, color: '#fff' },
  userRole: { fontSize: 12, color: '#22c55e', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 },
  navLink:  { display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, color: '#94a3b8', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'all .15s' },
  navActive:{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', boxShadow: '0 4px 12px rgba(34,197,94,.35)' },
  logout:   { marginTop: 'auto', padding: '11px 14px', background: '#0a0e1a', border: '1px solid #1f2937', borderRadius: 10, color: '#ef4444', cursor: 'pointer', fontSize: 14, fontWeight: 600, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 },
  main:     { padding: '32px 36px', overflowY: 'auto' },
};

export function Sidebar() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const user         = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => { localStorage.removeItem('user'); navigate('/login'); };

  return (
    <aside style={sidebarStyles.sidebar}>
      <div style={sidebarStyles.brand}>
        <Icon d={IC.dumbbell} size={22} color="#22c55e" /> Coach Space
      </div>
      <div style={sidebarStyles.userBox}>
        <div style={sidebarStyles.userName}>{user.prenom} {user.nom}</div>
        <div style={sidebarStyles.userRole}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', display:'inline-block' }} /> Coach
        </div>
      </div>
      {navItems.map(item => {
        const active = pathname === item.to || pathname.startsWith(item.to + '/');
        return (
          <Link key={item.to} to={item.to} style={{ ...sidebarStyles.navLink, ...(active ? sidebarStyles.navActive : {}) }}>
            <Icon d={NAV_ICONS[item.to]} size={16} color={active ? '#fff' : '#94a3b8'} />
            <span>{item.label}</span>
          </Link>
        );
      })}
      <button onClick={logout} style={sidebarStyles.logout}>
        <Icon d={IC.logout} size={16} color="#ef4444" /> Déconnexion
      </button>
    </aside>
  );
}