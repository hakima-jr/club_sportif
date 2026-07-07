// src/pages/coach/CoachDashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  calendar:  ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  dumbbell:  ['M6.5 6.5h11','M6.5 17.5h11','M3 9.5h3v5H3z','M18 9.5h3v5h-3z','M6 12h12'],
  users:     ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  stat:      ['M18 20V10','M12 20V4','M6 20v-6'],
  check:     'M20 6L9 17l-5-5',
  warning:   ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  clock:     ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 6v6l4 2'],
  arrow:     'M5 12h14M12 5l7 7-7 7',
  flash:     ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
  inbox:     ['M22 12h-6l-2 3h-4l-2-3H2','M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
  presence:  ['M9 11l3 3L22 4','M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
  mapPin:    ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z','M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
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
  { key:'total_seances',      label:'Séances',      sublabel:'Total',      iconKey:'calendar', color:C.purple,  bg:'rgba(139,92,246,0.15)', format:(v)=>fmt(v) },
  { key:'seances_aujourdhui', label:"Aujourd'hui",  sublabel:'Séances',    iconKey:'dumbbell', color:C.success, bg:C.successGlow,           format:(v)=>fmt(v) },
  { key:'total_membres',      label:'Membres',      sublabel:'Inscrits',   iconKey:'users',    color:C.info,    bg:C.infoGlow,              format:(v)=>fmt(v) },
  { key:'taux_presence',      label:'Présence',     sublabel:'Moyenne',    iconKey:'stat',     color:C.orange,  bg:'rgba(249,115,22,0.15)', format:(v)=>`${v}%` },
];

const quickActions = [
  { to:'/coach/seances', iconKey:'calendar', label:'Mes séances',     desc:'Planning complet',      color:C.purple  },
  { to:'/coach/membres', iconKey:'users',    label:'Mes membres',     desc:'Liste des membres',     color:C.info    },
  { to:'/presence',      iconKey:'presence', label:'Gérer présences', desc:'Marquer les présences', color:C.success },
];

function KpiCard({ data, value }) {
  return (
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

export default function CoachDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [seances, setSeances] = useState([]);
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const init = async () => {
      let id_coach = null;
      try {
        const { data: allCoachs } = await axios.get(`${API}/coachs`);
        const myCoach = allCoachs.find(c => c.email===user.email || (c.nom?.toLowerCase()===user.nom?.toLowerCase() && c.prenom?.toLowerCase()===user.prenom?.toLowerCase()));
        if (myCoach) { id_coach=myCoach.id_coach; if(user.id_coach!==id_coach) localStorage.setItem('user',JSON.stringify({...user,id_coach})); }
      } catch { /* silencieux */ }
      if (!id_coach) id_coach = user.id_coach || user.id;
      try {
        const [s, m] = await Promise.all([axios.get(`${API}/seances`), axios.get(`${API}/membres`)]);
        setSeances(s.data.filter(se => Number(se.id_coach)===Number(id_coach)));
        setMembres(m.data);
      } catch (e) { console.error(e); setError('Erreur lors du chargement des données.'); }
      finally { setLoading(false); }
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const today              = new Date().toISOString().slice(0,10);
  const seancesAujourdhui  = seances.filter(s => s.date?.slice(0,10)===today);
  const seancesAVenir      = seances.filter(s => s.date?.slice(0,10)>today).slice(0,5);
  const statsValues        = { total_seances:seances.length, seances_aujourdhui:seancesAujourdhui.length, total_membres:membres.length, taux_presence:85 };
  const dateLabel          = new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

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
            <span style={{ marginLeft:12, fontSize:13, opacity:0.7 }}>{dateLabel}</span>
          </p>
        </div>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.textMuted, padding:'10px 20px', borderRadius:12, fontSize:13, fontWeight:500, display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:C.success, display:'inline-block' }} /> Coach connecté
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
            {kpiCards.map(card => <KpiCard key={card.key} data={card} value={statsValues[card.key]} />)}
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

            {/* Prochaines séances */}
            <div style={{ background:C.surface, borderRadius:20, padding:'28px 32px', border:`1px solid ${C.border}`, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:C.text, margin:'0 0 20px', display:'flex', alignItems:'center', gap:10 }}>
                <Icon d={IC.calendar} size={20} color={C.purple} /> Prochaines séances
                <span style={{ background:C.surfaceAlt, color:C.textMuted, padding:'2px 10px', borderRadius:10, fontSize:12, fontWeight:600 }}>{seancesAVenir.length}</span>
              </h2>
              {seancesAVenir.length===0 ? (
                <div style={{ textAlign:'center', padding:'30px 0' }}>
                  <Icon d={IC.inbox} size={36} color={C.textMuted} />
                  <p style={{ color:C.textMuted, margin:'12px 0 0', fontSize:14 }}>Aucune séance à venir</p>
                  <Link to="/coach/seances" style={{ color:C.primary, fontSize:13, marginTop:12, display:'inline-block', textDecoration:'none', fontWeight:500 }}>
                    Voir mes séances →
                  </Link>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {seancesAVenir.map(s => {
                    const d=s.date?.slice(0,10), isToday=d===today;
                    const statusColor=isToday?C.warning:C.info, statusLabel=isToday?"Aujourd'hui":'À venir';
                    return (
                      <div key={s.id_seance} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', background:C.surfaceAlt, borderRadius:12, border:`1px solid ${C.border}`, transition:'all 0.2s ease', cursor:'pointer' }}
                        onMouseEnter={e=>{ e.currentTarget.style.background=C.borderLight; e.currentTarget.style.borderColor=C.primary+'40'; }}
                        onMouseLeave={e=>{ e.currentTarget.style.background=C.surfaceAlt; e.currentTarget.style.borderColor=C.border; }}>
                        <div style={{ width:40, height:40, borderRadius:10, background:C.purple+'15', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <Icon d={IC.dumbbell} size={18} color={C.purple} />
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:14, fontWeight:600, color:C.textLight, marginBottom:2 }}>{s.nom_sport||'Séance'}</div>
                          <div style={{ fontSize:12, color:C.textMuted, display:'flex', alignItems:'center', gap:6 }}>
                            <Icon d={IC.calendar} size={11} color={C.textMuted} /> {d}
                            <Icon d={IC.clock} size={11} color={C.textMuted} /> {s.heure}
                            <Icon d={IC.users} size={11} color={C.textMuted} /> {s.capacite}
                          </div>
                        </div>
                        <span style={{ background:statusColor+'15', color:statusColor, padding:'4px 10px', borderRadius:8, fontSize:11, fontWeight:600, flexShrink:0, border:`1px solid ${statusColor}40` }}>
                          {statusLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Séances d'aujourd'hui */}
          <div style={{ background:C.surface, borderRadius:20, padding:'28px 32px', border:`1px solid ${C.border}`, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:C.text, margin:0, display:'flex', alignItems:'center', gap:10 }}>
                <Icon d={IC.dumbbell} size={20} color={C.success} /> Séances d'aujourd'hui
                <span style={{ background:C.success+'15', color:C.success, padding:'2px 10px', borderRadius:10, fontSize:12, fontWeight:600, border:`1px solid ${C.success}40` }}>
                  {seancesAujourdhui.length}
                </span>
              </h2>
              <Link to="/coach/seances" style={{ color:C.primary, fontSize:14, fontWeight:500, textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>
                Voir tout <Icon d={IC.arrow} size={14} color={C.primary} />
              </Link>
            </div>
            {seancesAujourdhui.length===0 ? (
              <div style={{ textAlign:'center', padding:'40px 0' }}>
                <Icon d={IC.inbox} size={40} color={C.textMuted} />
                <p style={{ color:C.textMuted, margin:'12px 0 0', fontSize:14 }}>Aucune séance programmée aujourd'hui</p>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:12 }}>
                {seancesAujourdhui.map(s => (
                  <div key={s.id_seance} style={{ padding:'20px 24px', background:C.surfaceAlt, borderRadius:14, border:`1px solid ${C.border}`, transition:'all 0.2s ease', cursor:'pointer' }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.success+'40'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 8px 24px ${C.success}15`; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                      <div style={{ width:44, height:44, borderRadius:12, background:C.success+'15', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Icon d={IC.dumbbell} size={20} color={C.success} />
                      </div>
                      <span style={{ background:C.success+'15', color:C.success, padding:'4px 10px', borderRadius:8, fontSize:11, fontWeight:600, border:`1px solid ${C.success}40` }}>
                        {s.heure}
                      </span>
                    </div>
                    <div style={{ fontSize:16, fontWeight:700, color:C.textLight, marginBottom:4 }}>{s.nom_sport||'Séance'}</div>
                    <div style={{ fontSize:13, color:C.textMuted, marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
                      <Icon d={IC.users} size={13} color={C.textMuted} /> {s.capacite} personnes
                      <Icon d={IC.mapPin} size={13} color={C.textMuted} /> {s.lieu||'Salle principale'}
                    </div>
                    <Link to="/presence" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', background:C.success, color:'#fff', borderRadius:8, fontSize:13, fontWeight:600, textDecoration:'none', transition:'all 0.2s' }}>
                      <Icon d={IC.presence} size={13} color="#fff" /> Gérer présences
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}