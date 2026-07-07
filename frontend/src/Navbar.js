// src/Navbar.js  —  Responsive version
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('user') || '{}');
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered,  setHovered]  = useState(null);

  const roleColor = user.role === 'admin' ? '#dc2626'
                  : user.role === 'coach'  ? '#16a34a'
                  : '#d97706';

  const roleLabel = user.role === 'admin' ? '🔴 Admin'
                  : user.role === 'coach'  ? '🟢 Coach'
                  : '🟡 Réception';

  const allLinks = [
    { to: '/dashboard',   label: 'Dashboard'   },
    { to: '/members',     label: 'Membres'     },
    { to: '/abonnements', label: 'Abonnements' },
    { to: '/paiements',   label: 'Paiements'   },
    { to: '/seances',     label: 'Séances'     },
    { to: '/presence',    label: 'Présences'   },
    { to: '/rapports',    label: 'Rapports',   adminOnly: true },
    { to: '/sports',      label: 'Sports',     adminOnly: true },
    { to: '/coach',       label: 'Coachs',     adminOnly: true },
    { to: '/staff',       label: 'Staff',      adminOnly: true },
  ];

  const links = allLinks.filter(l => !l.adminOnly || user.role === 'admin');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <>
      {/* ───── Styles ───── */}
      <style>{`
        .nb-root {
          background: #161b27;
          border-bottom: 1px solid #2d3448;
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'Segoe UI', sans-serif;
        }

        /* ── Top bar ── */
        .nb-bar {
          display: flex;
          align-items: center;
          padding: 0 16px;
          height: 56px;
          gap: 8px;
        }

        /* Logo */
        .nb-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          text-decoration: none;
        }
        .nb-logo-icon { color: #a78bfa; font-size: 18px; }
        .nb-logo-text { color: #e2e8f0; font-weight: 700; font-size: 15px; white-space: nowrap; }

        /* Desktop links */
        .nb-links {
          display: flex;
          align-items: center;
          gap: 2px;
          flex: 1;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .nb-links::-webkit-scrollbar { display: none; }

        .nb-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 6px;
          white-space: nowrap;
          transition: all .15s;
        }
        .nb-link:hover  { color: #cbd5e1; background: #1e2537; }
        .nb-link.active { color: #e2e8f0; background: #232938; }

        /* User zone */
        .nb-user {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          margin-left: 8px;
        }
        .nb-user-name  { color: #e2e8f0; font-size: 13px; font-weight: 600; text-align: right; }
        .nb-role-badge {
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 10px;
          display: inline-block;
        }
        .nb-logout {
          padding: 6px 14px;
          background: #dc2626;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        /* Hamburger button — hidden on desktop */
        .nb-burger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          margin-left: auto;
          flex-shrink: 0;
        }
        .nb-burger span {
          display: block;
          width: 22px;
          height: 2px;
          background: #e2e8f0;
          border-radius: 2px;
          transition: all .2s;
        }

        /* Mobile drawer — hidden by default */
        .nb-drawer {
          display: none;
          flex-direction: column;
          background: #1a2032;
          border-top: 1px solid #2d3448;
          padding: 12px 16px 16px;
          gap: 4px;
        }
        .nb-drawer.open { display: flex; }

        .nb-drawer .nb-link {
          font-size: 14px;
          padding: 10px 14px;
          border-radius: 8px;
        }

        .nb-drawer-user {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px 8px;
          border-top: 1px solid #2d3448;
          margin-top: 8px;
        }
        .nb-drawer-user .nb-user-name { font-size: 14px; }

        /* ── Mobile breakpoint ── */
        @media (max-width: 768px) {
          .nb-links { display: none; }
          .nb-user   { display: none; }
          .nb-burger { display: flex; }
        }
      `}</style>

      <nav className="nb-root">
        {/* Top bar */}
        <div className="nb-bar">
          {/* Logo */}
          <Link to="/dashboard" className="nb-logo">
            <span className="nb-logo-icon">✦</span>
            <span className="nb-logo-text">Club Sportif</span>
          </Link>

          {/* Desktop links */}
          <div className="nb-links">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`nb-link${location.pathname === l.to ? ' active' : ''}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop user zone */}
          <div className="nb-user">
            <div>
              <div className="nb-user-name">{user.prenom} {user.nom}</div>
              <div className="nb-role-badge" style={{ background: roleColor }}>{roleLabel}</div>
            </div>
            <button className="nb-logout" onClick={handleLogout}>Déconnexion</button>
          </div>

          {/* Hamburger (mobile only) */}
          <button
            className="nb-burger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span style={menuOpen ? { transform: 'rotate(45deg) translate(5px, 5px)' } : {}} />
            <span style={menuOpen ? { opacity: 0 } : {}} />
            <span style={menuOpen ? { transform: 'rotate(-45deg) translate(5px, -5px)' } : {}} />
          </button>
        </div>

        {/* Mobile drawer */}
        <div className={`nb-drawer${menuOpen ? ' open' : ''}`}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`nb-link${location.pathname === l.to ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}

          {/* User + logout inside drawer */}
          <div className="nb-drawer-user">
            <div>
              <div className="nb-user-name">{user.prenom} {user.nom}</div>
              <div className="nb-role-badge" style={{ background: roleColor }}>{roleLabel}</div>
            </div>
            <button className="nb-logout" onClick={handleLogout}>Déconnexion</button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;