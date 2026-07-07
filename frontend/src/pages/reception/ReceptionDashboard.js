// src/pages/reception/ReceptionDashboard.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  dashboard: ['M3 3h7v7H3z','M14 3h7v7h-7z','M3 14h7v7H3z','M14 14h7v7h-7z'],
  users:     ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z','M23 21v-2a4 4 0 0 0-3-3.87','M16 3.13a4 4 0 0 1 0 7.75'],
  sub:       ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8'],
  money:     ['M12 1v22','M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
  clock:     ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 6v6l4 2'],
  payment:   ['M1 10h22','M2 5h20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z'],
  calendar:  ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  check:     'M20 6L9 17l-5-5',
  plus:      ['M12 5v14','M5 12h14'],
  dumbbell:  ['M6.5 6.5h11','M6.5 17.5h11','M3 9.5h3v5H3z','M18 9.5h3v5h-3z','M6 12h12'],
  inbox:     ['M22 12h-6l-2 3h-4l-2-3H2','M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
  warning:   ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  search:    ['M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12z','M21 21l-4.35-4.35'],
  close:     ['M18 6L6 18','M6 6l12 12'],
  arrow:     'M5 12h14M12 5l7 7-7 7',
  presence:  ['M9 11l3 3L22 4','M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
  flash:     ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
};

const C = {
  bgDark:'#0a0e1a', surface:'#111827', surfaceAlt:'#1a2234', border:'#1f2937', borderLight:'#374151',
  text:'#f8fafc', textMuted:'#94a3b8', textLight:'#cbd5e1',
  primary:'#6366f1', primaryGlow:'rgba(99,102,241,0.15)',
  success:'#22c55e', successGlow:'rgba(34,197,94,0.15)',
  danger:'#ef4444', dangerGlow:'rgba(239,68,68,0.15)',
  warning:'#f59e0b', warningGlow:'rgba(245,158,11,0.15)',
  info:'#3b82f6', infoGlow:'rgba(59,130,246,0.15)',
  teal:'#14b8a6', orange:'#f97316', purple:'#8b5cf6',
};

const fmt = (n) => Number(n || 0).toLocaleString('fr-MA');

const kpiCards = [
  { key:'total_membres',        label:'Membres',     sublabel:'Inscrits',   iconKey:'users',   color:C.primary, bg:C.primaryGlow, to:'/members',     format:(v)=>fmt(v) },
  { key:'abonnements_actifs',   label:'Abonnements', sublabel:'Actifs',     iconKey:'sub',     color:C.info,    bg:C.infoGlow,    to:'/abonnements', format:(v)=>fmt(v) },
  { key:'revenus_totaux',       label:'Revenus',     sublabel:'Ce mois',    iconKey:'money',   color:C.success, bg:C.successGlow, to:'/paiements',   format:(v)=>`${fmt(v)} MAD` },
  { key:'paiements_en_attente', label:'Impayés',     sublabel:'En attente', iconKey:'clock',   color:C.danger,  bg:C.dangerGlow,  to:'/paiements',   format:(v)=>`${fmt(v)} MAD` },
];

const quickActions = [
  { to:'/members',     iconKey:'plus',     label:'Nouveau membre',  desc:'Ajouter un membre',       color:C.primary },
  { to:'/abonnements', iconKey:'sub',      label:'Abonnements',     desc:'Gérer les forfaits',      color:C.teal },
  { to:'/paiements',   iconKey:'payment',  label:'Paiements',       desc:'Encaissements',           color:C.warning },
  { to:'/seances',     iconKey:'calendar', label:'Séances',         desc:'Planning des séances',    color:C.success },
  { to:'/presence',    iconKey:'presence', label:'Présences',       desc:'Marquer les présences',   color:C.info },
];

function KpiCard({ data, value }) {
  return (
    <Link to={data.to} style={{ textDecoration:'none' }}>
      <div style={{ background:C.surface, borderRadius:20, padding:'24px 22px', border:`1px solid ${C.border}`, cursor:'pointer', position:'relative', overflow:'hidden', transition:'all 0.3s ease', boxShadow:'0 4px 20px rgba(0,0,0,0.3)', height:'100%', boxSizing:'border-box' }}
        onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 12px 40px ${data.bg}`; e.currentTarget.style.borderColor=data.color+'40'; }}
        onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.3)'; e.currentTarget.style.borderColor=C.border; }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${data.color}, ${data.color}80)`, borderRadius:'20px 20px 0 0' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:data.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon d={IC[data.iconKey]} size={22} color={data.color} />
          </div>
        </div>
        <div style={{ fontSize:28, fontWeight:800, color:C.text, marginBottom:4, letterSpacing:'-0.5px' }}>{data.format(value)}</div>
        <div style={{ fontSize:13, color:C.textLight, fontWeight:600, marginBottom:2 }}>{data.label}</div>
        <div style={{ fontSize:11, color:C.textMuted }}>{data.sublabel}</div>
        <div style={{ position:'absolute', bottom:20, right:20, color:data.color, opacity:0.3 }}>
          <Icon d={IC.arrow} size={20} color={data.color} />
        </div>
      </div>
    </Link>
  );
}

function ActionCard({ action }) {
  return (
    <Link to={action.to} style={{ textDecoration:'none' }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, background:C.surface, borderRadius:14, padding:'16px 20px', border:`1px solid ${C.border}`, cursor:'pointer', transition:'all 0.25s ease', boxShadow:'0 2px 10px rgba(0,0,0,0.2)' }}
        onMouseEnter={e=>{ e.currentTarget.style.transform='translateX(4px)'; e.currentTarget.style.borderColor=action.color+'30'; e.currentTarget.style.boxShadow=`0 4px 20px ${action.color}15`; }}
        onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,0.2)'; }}>
        <div style={{ width:40, height:40, borderRadius:10, background:action.color+'15', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon d={IC[action.iconKey]} size={20} color={action.color} />
        </div>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:C.textLight, marginBottom:2 }}>{action.label}</div>
          <div style={{ fontSize:12, color:C.textMuted }}>{action.desc}</div>
        </div>
        <div style={{ marginLeft:'auto', opacity:0.4 }}>
          <Icon d={IC.arrow} size={18} color={action.color} />
        </div>
      </div>
    </Link>
  );
}

export default function ReceptionDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats,         setStats]         = useState(null);
  const [seances,       setSeances]       = useState([]);
  const [membres,       setMembres]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [search,        setSearch]        = useState('');
  const [hoveredMembre, setHoveredMembre] = useState(null);

  useEffect(() => {
    Promise.all([axios.get(`${API}/rapports`), axios.get(`${API}/seances`), axios.get(`${API}/membres`)])
      .then(([r, s, m]) => {
        setStats(r.data);
        setMembres(m.data || []);
        const today = new Date();
        const todayStr  = today.toISOString().slice(0, 10);
        const todayStr2 = today.toLocaleDateString('fr-CA');
        const todayStr3 = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
        const allSeances = s.data || [];
        const todaySeances = allSeances.filter(se => { if (!se.date) return false; const seDate = se.date.slice(0, 10); return seDate===todayStr || seDate===todayStr2 || seDate===todayStr3; });
        setSeances(todaySeances);
      })
      .catch((err) => { console.error('Erreur chargement:', err); setError('Erreur lors du chargement des données.'); })
      .finally(() => setLoading(false));
  }, []);

  const getInitials   = (nom, prenom) => `${(nom?.[0]||'').toUpperCase()}${(prenom?.[0]||'').toUpperCase()}`;
  const getAvatarColor = (id) => { const colors=[C.primary,C.info,C.success,C.purple,C.teal,C.orange,C.danger,C.warning]; return colors[(id||0)%colors.length]; };
  const filteredMembres = membres.filter(m => `${m.nom} ${m.prenom} ${m.email||''} ${m.telephone||''}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding:'32px 40px', fontFamily:'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', maxWidth:1400, margin:'0 auto', background:C.bgDark, minHeight:'100vh' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontSize:32, fontWeight:800, margin:0, color:C.text, letterSpacing:'-0.5px', display:'flex', alignItems:'center', gap:12 }}>
            <Icon d={IC.dashboard} size={30} color={C.primary} /> Tableau de bord
          </h1>
          <p style={{ color:C.textMuted, marginTop:8, fontSize:15 }}>
            Bienvenue, <strong style={{ color:C.textLight }}>{user.prenom} {user.nom}</strong>
            <span style={{ marginLeft:12, fontSize:13, opacity:0.7 }}>
              {new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
            </span>
          </p>
        </div>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.textMuted, padding:'10px 20px', borderRadius:12, fontSize:13, fontWeight:500, display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:C.success, display:'inline-block' }} />
          Système opérationnel
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background:C.dangerGlow, border:`1px solid ${C.danger}40`, color:C.danger, padding:'14px 20px', borderRadius:12, marginBottom:24, fontSize:14, fontWeight:500, display:'flex', alignItems:'center', gap:10 }}>
          <Icon d={IC.warning} size={18} color={C.danger} /> {error}
        </div>
      )}

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'80px 0', color:C.textMuted, fontSize:16 }}>
          <div style={{ textAlign:'center' }}>
            <Icon d={IC.clock} size={48} color={C.textMuted} />
            <p style={{ marginTop:20 }}>Chargement des données…</p>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:20, marginBottom:28 }}>
            {kpiCards.map(card => <KpiCard key={card.key} data={card} value={stats?.[card.key]} />)}
          </div>

          {/* Main Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:24, marginBottom:28 }}>
            {/* Actions rapides */}
            <div style={{ background:C.surface, borderRadius:20, padding:'28px 32px', border:`1px solid ${C.border}`, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:C.text, margin:'0 0 20px', display:'flex', alignItems:'center', gap:10 }}>
                <Icon d={IC.flash} size={20} color={C.warning} /> Actions rapides
              </h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:12 }}>
                {quickActions.map(action => <ActionCard key={action.to} action={action} />)}
              </div>
            </div>

            {/* Séances d'aujourd'hui */}
            <div style={{ background:C.surface, borderRadius:20, padding:'28px 32px', border:`1px solid ${C.border}`, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:C.text, margin:'0 0 20px', display:'flex', alignItems:'center', gap:10 }}>
                <Icon d={IC.calendar} size={20} color={C.success} /> Séances d'aujourd'hui
                <span style={{ background:C.surfaceAlt, color:C.textMuted, padding:'2px 10px', borderRadius:10, fontSize:12, fontWeight:600 }}>{seances.length}</span>
              </h2>
              {seances.length === 0 ? (
                <div style={{ textAlign:'center', padding:'30px 0' }}>
                  <Icon d={IC.inbox} size={36} color={C.textMuted} />
                  <p style={{ color:C.textMuted, margin:'12px 0 0', fontSize:14 }}>Aucune séance aujourd'hui</p>
                  <Link to="/seances" style={{ color:C.primary, fontSize:13, marginTop:12, display:'inline-block', textDecoration:'none', fontWeight:500 }}>
                    Planifier une séance →
                  </Link>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {seances.map(s => (
                    <div key={s.id_seance} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', background:C.surfaceAlt, borderRadius:12, border:`1px solid ${C.border}`, cursor:'pointer', transition:'all 0.2s ease' }}
                      onMouseEnter={e=>{ e.currentTarget.style.background=C.borderLight; e.currentTarget.style.borderColor=C.primary+'40'; }}
                      onMouseLeave={e=>{ e.currentTarget.style.background=C.surfaceAlt; e.currentTarget.style.borderColor=C.border; }}
                      onClick={()=>navigate('/presence')}>
                      <div style={{ width:40, height:40, borderRadius:10, background:C.success+'15', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <Icon d={IC.dumbbell} size={18} color={C.success} />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14, fontWeight:600, color:C.textLight, marginBottom:2 }}>{s.nom_sport||'Séance'}</div>
                        <div style={{ fontSize:12, color:C.textMuted }}>{s.heure} — {s.nom_coach||'Coach'}</div>
                      </div>
                      <span style={{ background:C.success+'15', color:C.success, padding:'4px 10px', borderRadius:8, fontSize:11, fontWeight:600, flexShrink:0 }}>
                        {s.capacite} pers.
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Membres récents */}
          <div style={{ background:C.surface, borderRadius:20, padding:'28px 32px', border:`1px solid ${C.border}`, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12 }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:C.text, margin:0, display:'flex', alignItems:'center', gap:10 }}>
                <Icon d={IC.users} size={20} color={C.primary} /> Membres récents
              </h2>
              <Link to="/members" style={{ color:C.primary, fontSize:14, fontWeight:500, textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>
                Voir tous <Icon d={IC.arrow} size={14} color={C.primary} />
              </Link>
            </div>

            {/* Search */}
            <div style={{ position:'relative', marginBottom:20 }}>
              <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }}>
                <Icon d={IC.search} size={16} color={C.textMuted} />
              </span>
              <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Rechercher par nom, email ou téléphone..."
                style={{ width:'100%', padding:'12px 16px 12px 42px', background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:12, color:C.textLight, fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'inherit', transition:'all 0.2s' }}
                onFocus={e=>{ e.currentTarget.style.borderColor=C.primary+'60'; e.currentTarget.style.boxShadow=`0 0 0 3px ${C.primaryGlow}`; }}
                onBlur={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow='none'; }} />
              {search && (
                <button onClick={()=>setSearch('')} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:C.textMuted, cursor:'pointer', padding:4 }}>
                  <Icon d={IC.close} size={14} color={C.textMuted} />
                </button>
              )}
            </div>

            {filteredMembres.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px 0' }}>
                <Icon d={IC.search} size={40} color={C.textMuted} />
                <p style={{ color:C.textMuted, margin:'12px 0 0', fontSize:14 }}>{search?'Aucun membre trouvé':'Aucun membre enregistré'}</p>
              </div>
            ) : (
              <>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:12 }}>
                  {filteredMembres.slice(0, 12).map((m, idx) => (
                    <div key={m.id_personne} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', background:hoveredMembre===idx?C.surfaceAlt:C.surface, borderRadius:12, border:`1px solid ${hoveredMembre===idx?getAvatarColor(m.id_personne)+'40':C.border}`, cursor:'pointer', transition:'all 0.2s ease' }}
                      onMouseEnter={()=>setHoveredMembre(idx)} onMouseLeave={()=>setHoveredMembre(null)}
                      onClick={()=>navigate(`/membres/${m.id_personne}`)}>
                      <div style={{ width:40, height:40, borderRadius:'50%', background:getAvatarColor(m.id_personne), display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#fff', flexShrink:0 }}>
                        {getInitials(m.nom, m.prenom)}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14, fontWeight:600, color:C.textLight, marginBottom:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.prenom} {m.nom}</div>
                        <div style={{ fontSize:12, color:C.textMuted, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.email||'—'}</div>
                        <div style={{ fontSize:11, color:C.textMuted, opacity:0.7 }}>{m.telephone||'—'}</div>
                      </div>
                      <span style={{ color:getAvatarColor(m.id_personne), opacity:hoveredMembre===idx?1:0, transition:'opacity 0.2s', flexShrink:0 }}>
                        <Icon d={IC.arrow} size={16} color={getAvatarColor(m.id_personne)} />
                      </span>
                    </div>
                  ))}
                </div>
                {filteredMembres.length > 12 && (
                  <div style={{ textAlign:'center', marginTop:20 }}>
                    <button onClick={()=>navigate('/members')} style={{ background:C.surfaceAlt, border:`1px solid ${C.border}`, color:C.textMuted, padding:'10px 24px', borderRadius:10, cursor:'pointer', fontSize:13, fontWeight:500, transition:'all 0.2s' }}
                      onMouseEnter={e=>{ e.currentTarget.style.background=C.borderLight; e.currentTarget.style.color=C.textLight; }}
                      onMouseLeave={e=>{ e.currentTarget.style.background=C.surfaceAlt; e.currentTarget.style.color=C.textMuted; }}>
                      Voir les {filteredMembres.length - 12} membres restants →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}