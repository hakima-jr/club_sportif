// src/pages/coach/MesMembres.js

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

/* ═══════════════════════════════════════════════════════════════
   ICÔNES SVG
   ═══════════════════════════════════════════════════════════════ */
const Icon = ({ d, size = 16, color = 'currentColor', strokeWidth = 1.8 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    {Array.isArray(d)
      ? d.map((p, i) => <path key={i} d={p} />)
      : <path d={d} />
    }
  </svg>
);

const IC = {
  users:    ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  user:     ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  search:   ['M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12z','M21 21l-4.35-4.35'],
  close:    ['M18 6L6 18','M6 6l12 12'],
  check:    'M20 6L9 17l-5-5',
  warning:  ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  trash:    ['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'],
  save:     ['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z','M17 21v-8H7v8','M7 3v5h8'],
  presence: ['M9 11l3 3L22 4','M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
  chat:     ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  clock:    ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 6v6l4 2'],
  list:     ['M8 6h13','M8 12h13','M8 18h13','M3 6h.01','M3 12h.01','M3 18h.01'],
  inbox:    ['M22 12h-6l-2 3h-4l-2-3H2','M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
  mail:     ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6'],
  phone:    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.07 6.07l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  calendar: ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  weight:   ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M8 12h8'],
  ruler:    ['M5 3l14 14','M5 3h4','M5 3v4','M19 17h-4','M19 17v-4'],
  target:   ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z','M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z','M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
};

/* ═══════════════════════════════════════════════════════════════
   PALETTE DE COULEURS
   ═══════════════════════════════════════════════════════════════ */
const C = {
  bgDark:     '#0a0e1a',
  surface:    '#111827',
  surfaceAlt: '#1a2234',
  border:     '#1f2937',
  borderLight:'#374151',
  text:       '#f8fafc',
  textMuted:  '#94a3b8',
  textLight:  '#cbd5e1',
  primary:    '#6366f1',
  success:    '#22c55e',
  danger:     '#ef4444',
  warning:    '#f59e0b',
  info:       '#3b82f6',
  purple:     '#8b5cf6',
};

/* ═══════════════════════════════════════════════════════════════
   COMPOSANTS RÉUTILISABLES
   ═══════════════════════════════════════════════════════════════ */

// Avatar avec initiales
const MiniAvatar = ({ nom, prenom }) => {
  const initials = `${nom?.[0] || ''}${prenom?.[0] || ''}`.toUpperCase();
  const hue = ((nom || 'A').charCodeAt(0) * 37) % 360;
  
  return (
    <div style={{
      width: 34,
      height: 34,
      borderRadius: '50%',
      flexShrink: 0,
      background: `hsl(${hue}, 50%, 22%)`,
      border: `2px solid hsl(${hue}, 50%, 38%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: `hsl(${hue}, 60%, 75%)`,
      fontWeight: 700,
      fontSize: 12,
    }}>
      {initials}
    </div>
  );
};

// Badge de statut
const StatusBadge = ({ statut }) => {
  if (!statut) {
    return <span style={{ color: C.textMuted, fontSize: 13 }}>— Non marqué</span>;
  }
  
  const styles = {
    'Présent': { bg: 'rgba(34,197,94,0.12)', color: '#4ade80', border: 'rgba(34,197,94,0.3)' },
    'Absent':  { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.3)' },
  };
  
  const style = styles[statut];
  
  return (
    <span style={{
      background: style.bg,
      color: style.color,
      border: `1px solid ${style.border}`,
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
    }}>
      {statut}
    </span>
  );
};

// Bouton de présence
const PresenceButton = ({ type, statut, saving, onClick }) => {
  const configs = {
    present: {
      label: 'Présent',
      icon: IC.check,
      color: '#4ade80',
      bg: 'rgba(34,197,94,0.12)',
      bgActive: 'rgba(34,197,94,0.25)',
      border: 'rgba(34,197,94,0.3)',
      borderActive: 'rgba(34,197,94,0.6)',
    },
    absent: {
      label: 'Absent',
      icon: IC.close,
      color: '#f87171',
      bg: 'rgba(239,68,68,0.12)',
      bgActive: 'rgba(239,68,68,0.25)',
      border: 'rgba(239,68,68,0.3)',
      borderActive: 'rgba(239,68,68,0.6)',
    },
  };
  
  const config = configs[type];
  const isActive = statut === config.label;
  const isDisabled = saving || isActive;
  
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      style={{
        padding: '6px 12px',
        background: isActive ? config.bgActive : config.bg,
        border: `1px solid ${isActive ? config.borderActive : config.border}`,
        borderRadius: 8,
        color: config.color,
        fontSize: 12,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        opacity: isActive ? 0.6 : 1,
      }}
    >
      <Icon d={config.icon} size={12} color={config.color} /> {config.label}
    </button>
  );
};

// Toast notification
const Toast = ({ message, type }) => {
  if (!message) return null;
  
  const isError = type === 'error';
  
  return (
    <div style={{
      marginBottom: 20,
      padding: '14px 20px',
      borderRadius: 12,
      border: '1px solid',
      fontSize: 14,
      fontWeight: 600,
      background: isError ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
      borderColor: isError ? C.danger : C.success,
      color: isError ? '#f87171' : '#4ade80',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <Icon d={isError ? IC.warning : IC.check} size={14} color={isError ? '#f87171' : '#4ade80'} />
      {message}
    </div>
  );
};

// État vide
const EmptyState = ({ icon, message }) => (
  <div style={{ textAlign: 'center', padding: '60px 0', color: C.textMuted }}>
    <Icon d={icon} size={40} color={C.textMuted} />
    <p style={{ margin: '12px 0 0', fontSize: 14 }}>{message}</p>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   FONCTIONS UTILITAIRES
   ═══════════════════════════════════════════════════════════════ */
const calculateAge = (dateString) => {
  if (!dateString) return '—';
  const today = new Date();
  const birth = new Date(dateString);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/* ═══════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */
export default function MesMembres() {
  // ─── State ───────────────────────────────────────────────────
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [membres, setMembres] = useState([]);
  const [membresInscrits, setMembresInscrits] = useState(null);
  const [seances, setSeances] = useState([]);
  const [selectedSeance, setSelectedSeance] = useState('');
  const [presenceMap, setPresenceMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Modal détails
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberDetail, setMemberDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  
  // Commentaires
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentSaving, setCommentSaving] = useState(false);

  // ─── Notifications ───────────────────────────────────────────
  const notify = useCallback((text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3500);
  }, []);

  // ─── Chargement initial ──────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      let id_coach = null;
      
      try {
        const { data: allCoachs } = await axios.get(`${API}/coachs`);
        const myCoach = allCoachs.find(c => 
          c.email === user.email || 
          (c.nom?.toLowerCase() === user.nom?.toLowerCase() && 
           c.prenom?.toLowerCase() === user.prenom?.toLowerCase())
        );
        
        if (myCoach) {
          id_coach = myCoach.id_coach;
          if (user.id_coach !== id_coach) {
            localStorage.setItem('user', JSON.stringify({ ...user, id_coach }));
          }
        }
      } catch {
        // silencieux
      }
      
      if (!id_coach) id_coach = user.id_coach || user.id;
      
      try {
        const [m, s] = await Promise.all([
          axios.get(`${API}/membres`),
          axios.get(`${API}/seances`),
        ]);
        setMembres(m.data);
        setSeances(s.data.filter(se => Number(se.id_coach) === Number(id_coach)));
      } catch {
        notify('Erreur chargement', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, [notify, user]);

  // ─── Sélection de séance ───────────────────────────────────
  const handleSeanceChange = useCallback(async (id) => {
    setSelectedSeance(id);
    setPresenceMap({});
    setMembresInscrits(null);
    
    if (!id) return;
    
    try {
      const [presData, inscritsData] = await Promise.all([
        axios.get(`${API}/presence/${id}`),
        axios.get(`${API}/seances/${id}/membres`),
      ]);
      
      const map = {};
      if (Array.isArray(presData.data)) {
        presData.data.forEach(p => {
          map[Number(p.id_membre)] = p.statut;
        });
      }
      
      setPresenceMap(map);
      setMembresInscrits(Array.isArray(inscritsData.data) ? inscritsData.data : []);
    } catch (error) {
      console.error('Erreur:', error);
      notify('Erreur chargement présence', 'error');
    }
  }, [notify]);

  // ─── Gestion présence ────────────────────────────────────────
  const handlePresence = useCallback(async (id_membre, statut) => {
    if (!selectedSeance) {
      notify("Choisissez une séance d'abord", 'error');
      return;
    }
    
    setSaving(true);
    
    try {
      await axios.post(`${API}/presence`, {
        id_seance: selectedSeance,
        id_membre,
        statut,
      });
      
      setPresenceMap(prev => ({
        ...prev,
        [Number(id_membre)]: statut,
      }));
      
      notify(`${statut} enregistré`);
    } catch (error) {
      console.error('Erreur:', error);
      notify('Erreur mise à jour présence', 'error');
    } finally {
      setSaving(false);
    }
  }, [selectedSeance, notify]);

  // ─── Récupération statut ───────────────────────────────────
  const getStatut = useCallback((id_membre) => {
    return presenceMap[Number(id_membre)] || null;
  }, [presenceMap]);

  // ─── Modal détails membre ────────────────────────────────────
  const openMemberDetail = useCallback(async (member) => {
    setSelectedMember(member);
    setShowDetail(true);
    setDetailLoading(true);
    
    try {
      const [{ data: detail }, { data: comms }] = await Promise.all([
        axios.get(`${API}/membres/${member.id_personne}`),
        axios.get(`${API}/commentaires/${member.id_personne}`),
      ]);
      
      setMemberDetail(detail);
      setComments(comms);
    } catch {
      setMemberDetail({ ...member });
      setComments([]);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeDetail = useCallback(() => {
    setShowDetail(false);
    setSelectedMember(null);
    setMemberDetail(null);
    setComments([]);
    setNewComment('');
  }, []);

  // ─── Commentaires ────────────────────────────────────────────
  const handleAddComment = useCallback(async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedMember) return;
    
    setCommentSaving(true);
    
    try {
      await axios.post(`${API}/commentaires`, {
        id_membre: selectedMember.id_personne,
        id_coach: user.id_coach,
        commentaire: newComment.trim(),
      });
      
      const { data: comms } = await axios.get(`${API}/commentaires/${selectedMember.id_personne}`);
      setComments(comms);
      setNewComment('');
      notify('Commentaire ajouté');
    } catch {
      notify('Erreur ajout commentaire', 'error');
    } finally {
      setCommentSaving(false);
    }
  }, [newComment, selectedMember, user.id_coach, notify]);

  const handleDeleteComment = useCallback(async (id_commentaire) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return;
    
    try {
      await axios.delete(`${API}/commentaires/${id_commentaire}`);
      setComments(prev => prev.filter(c => c.id_commentaire !== id_commentaire));
      notify('Commentaire supprimé');
    } catch {
      notify('Erreur suppression', 'error');
    }
  }, [notify]);

  // ─── Filtrage des membres ────────────────────────────────────
  const filteredMembers = useMemo(() => {
    let baseList = [...membres];
    
    if (selectedSeance && membresInscrits !== null && Array.isArray(membresInscrits)) {
      const inscritsIds = membresInscrits.map(m => Number(m.id_personne));
      baseList = baseList.filter(m => inscritsIds.includes(Number(m.id_personne)));
    }
    
    const searchTerm = search.toLowerCase();
    
    return baseList.filter(m => {
      const fullName = `${m.nom || ''} ${m.prenom || ''}`.toLowerCase();
      const email = (m.email || '').toLowerCase();
      return fullName.includes(searchTerm) || email.includes(searchTerm);
    });
  }, [membres, membresInscrits, selectedSeance, search]);

  // ─── Statistiques ────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: filteredMembers.length,
    presents: filteredMembers.filter(m => getStatut(m.id_personne) === 'Présent').length,
    absents: filteredMembers.filter(m => getStatut(m.id_personne) === 'Absent').length,
    nonMarques: filteredMembers.filter(m => !getStatut(m.id_personne)).length,
  }), [filteredMembers, getStatut]);

  // ─── Styles communs ──────────────────────────────────────────
  const inputStyle = {
    padding: '10px 14px',
    background: C.surfaceAlt,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    color: C.text,
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
  };

  // ─── Rendu ───────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      background: C.bgDark,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      paddingBottom: 60,
    }}>
      
      {/* ═══ HEADER ═══ */}
      <div style={{
        background: 'linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b)',
        padding: '28px 40px',
      }}>
        <h1 style={{
          fontSize: 28,
          fontWeight: 800,
          color: '#f1f5f9',
          margin: 0,
          letterSpacing: '-0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <Icon d={IC.users} size={26} color="#a78bfa" />
          Mes Membres
        </h1>
        <p style={{
          color: 'rgba(255,255,255,.5)',
          marginTop: 8,
          fontSize: 14,
          margin: '8px 0 0',
        }}>
          {filteredMembers.length} membre(s) affiché(s) sur {membres.length} total
          {selectedSeance && ` - ${stats.presents} présent(s), ${stats.absents} absent(s), ${stats.nonMarques} non marqué(s)`}
        </p>
      </div>

      <div style={{ padding: '28px 40px' }}>
        
        {/* Toast */}
        <Toast message={message.text} type={message.type} />

        {/* ═══ SÉLECTEUR DE SÉANCE ═══ */}
        <div style={{
          background: C.surface,
          borderRadius: 20,
          border: `1px solid ${C.border}`,
          padding: '24px 28px',
          marginBottom: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 700,
            color: C.text,
            margin: '0 0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <Icon d={IC.presence} size={18} color={C.success} />
            Gérer les présences par séance
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 500 }}>
            <label style={{
              fontSize: 11,
              color: C.textMuted,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
            }}>
              Choisir une séance
            </label>
            <select
              value={selectedSeance}
              onChange={e => handleSeanceChange(e.target.value)}
              style={inputStyle}
            >
              <option value="">-- Sélectionner une séance --</option>
              {seances.map(s => (
                <option key={s.id_seance} value={s.id_seance}>
                  {s.date?.slice(0, 10)} à {s.heure} — {s.nom_sport}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ═══ BARRE DE RECHERCHE ═══ */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
            <Icon d={IC.search} size={15} color={C.textMuted} />
          </span>
          <input
            type="text"
            placeholder="Rechercher un membre…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              ...inputStyle,
              paddingLeft: 44,
              paddingRight: search ? 44 : 14,
              borderRadius: 14,
              background: C.surface,
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: C.textMuted,
                cursor: 'pointer',
              }}
            >
              <Icon d={IC.close} size={14} color={C.textMuted} />
            </button>
          )}
        </div>

        {/* ═══ TABLEAU DES MEMBRES ═══ */}
        <div style={{
          background: C.surface,
          borderRadius: 20,
          border: `1px solid ${C.border}`,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          {loading ? (
            <EmptyState icon={IC.clock} message="Chargement…" />
          ) : filteredMembers.length === 0 ? (
            <EmptyState
              icon={selectedSeance ? IC.list : IC.search}
              message={selectedSeance ? 'Aucun membre inscrit à cette séance' : 'Aucun membre trouvé'}
            />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: C.surfaceAlt }}>
                    {['Membre', 'Email', 'Téléphone', 'Statut présence', 'Actions'].map(h => (
                      <th key={h} style={{
                        padding: '13px 18px',
                        textAlign: 'left',
                        fontWeight: 600,
                        color: C.textMuted,
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: 0.6,
                        borderBottom: `1px solid ${C.border}`,
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((m, i) => {
                    const statut = getStatut(m.id_personne);
                    
                    return (
                      <tr
                        key={m.id_personne}
                        style={{
                          background: i % 2 === 0 ? 'transparent' : `${C.surfaceAlt}80`,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1e2a3a'}
                        onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : `${C.surfaceAlt}80`}
                      >
                        {/* Colonne Membre */}
                        <td style={{ padding: '12px 18px', borderBottom: `1px solid ${C.border}` }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <MiniAvatar nom={m.nom} prenom={m.prenom} />
                            <div>
                              <div style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{m.nom}</div>
                              <div style={{ color: C.textMuted, fontSize: 12 }}>{m.prenom}</div>
                            </div>
                          </div>
                        </td>
                        
                        {/* Colonne Email */}
                        <td style={{ padding: '12px 18px', borderBottom: `1px solid ${C.border}`, color: C.info, fontSize: 13 }}>
                          {m.email || '—'}
                        </td>
                        
                        {/* Colonne Téléphone */}
                        <td style={{ padding: '12px 18px', borderBottom: `1px solid ${C.border}`, color: C.textLight }}>
                          {m.telephone || '—'}
                        </td>
                        
                        {/* Colonne Statut */}
                        <td style={{ padding: '12px 18px', borderBottom: `1px solid ${C.border}` }}>
                          <StatusBadge statut={statut} />
                        </td>
                        
                        {/* Colonne Actions */}
                        <td style={{ padding: '12px 18px', borderBottom: `1px solid ${C.border}` }}>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <button
                              onClick={() => openMemberDetail(m)}
                              style={{
                                padding: '6px 12px',
                                background: '#1e1b4b',
                                border: '1px solid #4338ca40',
                                borderRadius: 8,
                                color: '#a78bfa',
                                fontSize: 12,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <Icon d={IC.user} size={12} color="#a78bfa" /> Détails
                            </button>
                            
                            {selectedSeance ? (
                              <>
                                <PresenceButton
                                  type="present"
                                  statut={statut}
                                  saving={saving}
                                  onClick={() => handlePresence(m.id_personne, 'Présent')}
                                />
                                <PresenceButton
                                  type="absent"
                                  statut={statut}
                                  saving={saving}
                                  onClick={() => handlePresence(m.id_personne, 'Absent')}
                                />
                              </>
                            ) : (
                              <span style={{ color: C.textMuted, fontSize: 12, alignSelf: 'center' }}>
                                Choisir une séance
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MODAL DÉTAILS MEMBRE
          ═══════════════════════════════════════════════════════════ */}
      {showDetail && selectedMember && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
            backdropFilter: 'blur(4px)',
          }}
          onClick={closeDetail}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: 20,
              width: '100%',
              maxWidth: 680,
              maxHeight: '90vh',
              overflowY: 'auto',
              border: `1px solid ${C.borderLight}`,
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header du modal */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 28px',
              borderBottom: `1px solid ${C.border}`,
              position: 'sticky',
              top: 0,
              background: C.surface,
              zIndex: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <MiniAvatar nom={selectedMember.nom} prenom={selectedMember.prenom} />
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>
                  {selectedMember.prenom} {selectedMember.nom}
                </h2>
              </div>
              <button
                onClick={closeDetail}
                style={{
                  background: C.surfaceAlt,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  color: C.textMuted,
                  cursor: 'pointer',
                  width: 34,
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon d={IC.close} size={16} color={C.textMuted} />
              </button>
            </div>

            {/* Contenu du modal */}
            {detailLoading ? (
              <EmptyState icon={IC.clock} message="Chargement des détails…" />
            ) : memberDetail ? (
              <div style={{ padding: 28 }}>
                
                {/* ─── Stats rapides ─── */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))',
                  gap: 12,
                  marginBottom: 24,
                }}>
                  {[
                    { iconKey: 'weight', label: 'Poids', value: memberDetail.poids ? `${memberDetail.poids} kg` : '—', color: C.warning },
                    { iconKey: 'ruler', label: 'Taille', value: memberDetail.taille ? `${memberDetail.taille} cm` : '—', color: C.info },
                    { iconKey: 'calendar', label: 'Âge', value: memberDetail.date_naissance ? `${calculateAge(memberDetail.date_naissance)} ans` : '—', color: C.primary },
                    { iconKey: 'target', label: 'Objectif', value: memberDetail.objectif || '—', color: C.success },
                  ].map(item => (
                    <div key={item.label} style={{
                      background: C.surfaceAlt,
                      borderRadius: 12,
                      padding: '16px 14px',
                      textAlign: 'center',
                      border: `1px solid ${C.border}`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                        <Icon d={IC[item.iconKey]} size={24} color={item.color} />
                      </div>
                      <div style={{
                        fontSize: 11,
                        color: C.textMuted,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        marginBottom: 4,
                      }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* ─── Informations complémentaires ─── */}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: C.text,
                    margin: '0 0 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <Icon d={IC.list} size={16} color={C.primary} />
                    Informations complémentaires
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))',
                    gap: 10,
                  }}>
                    {[
                      { label: 'Email', value: memberDetail.email, icon: IC.mail, color: C.info },
                      { label: 'Téléphone', value: memberDetail.telephone, icon: IC.phone, color: C.textLight },
                      { label: 'Date inscription', value: formatDate(memberDetail.date_inscription), icon: IC.calendar, color: C.textLight },
                      { label: 'Adresse', value: memberDetail.adresse, icon: IC.user, color: C.textLight },
                    ].map(({ label, value, icon, color }) => (
                      <div key={label} style={{
                        background: C.surfaceAlt,
                        borderRadius: 10,
                        padding: '12px 14px',
                        border: `1px solid ${C.border}`,
                      }}>
                        <div style={{
                          fontSize: 11,
                          color: C.textMuted,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: 0.6,
                          marginBottom: 4,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}>
                          <Icon d={icon} size={11} color={C.textMuted} /> {label}
                        </div>
                        <div style={{ fontSize: 14, color: color || C.textLight, fontWeight: 500 }}>
                          {value || '—'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ─── Commentaires ─── */}
                <div>
                  <h3 style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: C.text,
                    margin: '0 0 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <Icon d={IC.chat} size={16} color={C.primary} />
                    Commentaires du coach
                  </h3>
                  
                  {/* Formulaire d'ajout */}
                  <form onSubmit={handleAddComment} style={{ marginBottom: 16 }}>
                    <textarea
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Ajouter un commentaire (poids, progression, objectifs…)"
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: C.surfaceAlt,
                        border: `1px solid ${C.border}`,
                        borderRadius: 12,
                        color: C.text,
                        fontSize: 14,
                        outline: 'none',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        marginBottom: 10,
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={commentSaving || !newComment.trim()}
                      style={{
                        padding: '10px 24px',
                        background: 'linear-gradient(135deg,#15803d,#22c55e)',
                        border: 'none',
                        borderRadius: 10,
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: commentSaving || !newComment.trim() ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit',
                        opacity: commentSaving || !newComment.trim() ? 0.6 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <Icon d={IC.save} size={14} color="#fff" />
                      {commentSaving ? 'Envoi…' : 'Ajouter commentaire'}
                    </button>
                  </form>

                  {/* Liste des commentaires */}
                  {comments.length === 0 ? (
                    <p style={{
                      color: C.textMuted,
                      textAlign: 'center',
                      padding: '20px 0',
                      fontStyle: 'italic',
                      fontSize: 14,
                    }}>
                      Aucun commentaire pour ce membre
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {comments.map(comment => (
                        <div key={comment.id_commentaire} style={{
                          background: C.surfaceAlt,
                          borderRadius: 12,
                          padding: '14px 16px',
                          border: `1px solid ${C.border}`,
                          position: 'relative',
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 8,
                          }}>
                            <span style={{
                              color: C.info,
                              fontSize: 13,
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}>
                              <Icon d={IC.user} size={13} color={C.info} />
                              {comment.nom_coach || 'Coach'}
                            </span>
                            <span style={{ color: C.textMuted, fontSize: 12 }}>
                              {formatDateTime(comment.date_creation)}
                            </span>
                          </div>
                          <p style={{ color: C.textLight, fontSize: 14, lineHeight: 1.6, margin: '0 0 8px' }}>
                            {comment.commentaire}
                          </p>
                          <button
                            onClick={() => handleDeleteComment(comment.id_commentaire)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: C.danger,
                              fontSize: 12,
                              cursor: 'pointer',
                              opacity: 0.7,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: 0,
                            }}
                          >
                            <Icon d={IC.trash} size={12} color={C.danger} /> Supprimer
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}