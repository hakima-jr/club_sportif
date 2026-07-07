// src/pages/membre/MembreDashboard.js
import React, { useEffect, useState } from 'react';
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
  sub:      ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8'],
  calendar: ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  clock:    ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 6v6l4 2'],
  money:    ['M12 1v22','M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
  warning:  ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  users:    ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  coach:    ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  dumbbell: ['M6.5 6.5h11','M6.5 17.5h11','M3 9.5h3v5H3z','M18 9.5h3v5h-3z','M6 12h12'],
  plus:     ['M12 5v14','M5 12h14'],
  check:    'M20 6L9 17l-5-5',
  inbox:    ['M22 12h-6l-2 3h-4l-2-3H2','M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
  medal:    ['M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z','M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  run:      ['M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0z','M7 20l2-5 3 2 2-4','M17 13l-2-4-3 1-2-4'],
  today:    ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 6v6l3 3'],
  filter:   ['M22 3H2l8 9.46V19l4 2v-8.54L22 3z'],
  stat:     ['M18 20V10','M12 20V4','M6 20v-6'],
};

const C = {
  bgDark:'#0a0e1a', surface:'#111827', surfaceAlt:'#1a2234',
  border:'#1f2937', text:'#f8fafc', textMuted:'#94a3b8', textLight:'#cbd5e1',
  primary:'#6366f1', success:'#22c55e', danger:'#ef4444', warning:'#f59e0b',
};

const SPORT_ICONS = { 'Musculation':IC.dumbbell, 'Cardio':IC.run, 'Yoga':IC.medal, 'CrossFit':IC.dumbbell, 'Natation':IC.users, 'Boxe':IC.dumbbell, 'Football':IC.users, 'Fitness':IC.dumbbell, 'Zumba':IC.run, 'Pilates':IC.run };
const SPORT_COLORS = {
  'Musculation':{ bg:'#1e3a5f', color:'#60a5fa' }, 'Cardio':{ bg:'#1f2d1f', color:'#4ade80' },
  'Yoga':{ bg:'#3b1f5e', color:'#c084fc' },        'CrossFit':{ bg:'#5e1f1f', color:'#f87171' },
  'Natation':{ bg:'#1f5e5e', color:'#2dd4bf' },    'Boxe':{ bg:'#5e3a1f', color:'#fb923c' },
  'Football':{ bg:'#1f3a1f', color:'#86efac' },    'Fitness':{ bg:'#2d1f5e', color:'#a78bfa' },
  'Zumba':{ bg:'#5e1f4e', color:'#f0abfc' },       'Pilates':{ bg:'#1f4e5e', color:'#67e8f9' },
};
const NIVEAU_COLORS = {
  'Débutant':{ bg:'rgba(34,197,94,0.12)', color:'#4ade80' },
  'Intermédiaire':{ bg:'rgba(59,130,246,0.12)', color:'#60a5fa' },
  'Avancé':{ bg:'rgba(239,68,68,0.12)', color:'#f87171' },
  'Tous niveaux':{ bg:'rgba(148,163,184,0.12)', color:'#94a3b8' },
};
const AUDIENCE_OPTIONS = [
  { key:'all', label:'Tous' }, { key:'Homme', label:'Homme' }, { key:'Femme', label:'Femme' },
  { key:'Enfant', label:'Enfant' }, { key:'Mix', label:'Mix' },
];

export default function MembreDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [abonnement,      setAbonnement]      = useState(null);
  const [seances,         setSeances]         = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [inscrit,         setInscrit]         = useState({});
  const [message,         setMessage]         = useState({ text:'', type:'' });
  const [sportFilter,     setSportFilter]     = useState('Tous');
  const [audienceFilter,  setAudienceFilter]  = useState('all');
  const [niveauFilter,    setNiveauFilter]    = useState('Tous');

  const notify = (text, type='success') => { setMessage({text,type}); setTimeout(()=>setMessage({text:'',type:''}),3000); };

  useEffect(() => {
    const calls = [axios.get(`${API}/seances`)];
    if (user.id_membre) calls.push(axios.get(`${API}/abonnements-par-membre/${user.id_membre}`));
    Promise.all(calls).then(([s, a]) => { setSeances(s.data||[]); if(a) setAbonnement(a.data[0]||null); })
      .catch(console.error).finally(()=>setLoading(false));
  }, []);

  const handleInscrire = async (id_seance) => {
    if (!user.id_membre) return notify('Compte non lié à un membre','error');
    try {
      await axios.post(`${API}/presence`, { id_seance, id_membre:user.id_membre, statut:'Inscrit' });
      setInscrit(prev=>({...prev,[id_seance]:true}));
      notify('Inscription réussie');
    } catch { notify("Erreur lors de l'inscription",'error'); }
  };

  const daysLeft = abonnement ? Math.max(0, Math.ceil((new Date(abonnement.date_fin)-new Date())/86400000)) : null;
  const aboColor = daysLeft===null?'#64748b':daysLeft<=7?'#ef4444':daysLeft<=30?'#f59e0b':'#10b981';
  const sportsList  = ['Tous', ...new Set(seances.map(s=>s.nom_sport).filter(Boolean))];
  const niveauxList = ['Tous', ...new Set(seances.map(s=>s.niveau).filter(Boolean))];
  const filtered = seances.filter(s => {
    const matchSport   = sportFilter==='Tous' || s.nom_sport===sportFilter;
    const matchNiveau  = niveauFilter==='Tous' || s.niveau===niveauFilter;
    return matchSport && matchNiveau;
  });
  const today = new Date().toISOString().slice(0,10);

  const selectStyle = { padding:'10px 14px', background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:13, outline:'none', cursor:'pointer', fontFamily:'inherit' };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', color:C.textMuted, fontFamily:'Inter, sans-serif' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:40, height:40, border:`3px solid ${C.border}`, borderTopColor:C.primary, borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 16px' }} />
        Chargement...
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:C.bgDark, fontFamily:'Inter, -apple-system, sans-serif', paddingBottom:60 }}>

      {/* Toast */}
      {message.text && (
        <div style={{ position:'fixed', top:20, right:20, zIndex:9999, padding:'14px 22px', borderRadius:14, fontWeight:700, fontSize:14, background:message.type==='error'?'rgba(239,68,68,0.15)':'rgba(34,197,94,0.15)', border:`1px solid ${message.type==='error'?C.danger:C.success}`, color:message.type==='error'?'#f87171':'#4ade80', boxShadow:'0 8px 32px rgba(0,0,0,.5)', display:'flex', alignItems:'center', gap:8 }}>
          <Icon d={message.type==='error'?IC.warning:IC.check} size={16} color={message.type==='error'?'#f87171':'#4ade80'} />
          {message.text}
        </div>
      )}

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b)', padding:'28px 40px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h1 style={{ fontSize:26, fontWeight:800, color:'#f1f5f9', margin:0, display:'flex', alignItems:'center', gap:10 }}>
              <Icon d={IC.run} size={26} color="#a78bfa" /> Bonjour, <span style={{ color:'#a78bfa' }}>{user.prenom||'Membre'}</span>
            </h1>
            <p style={{ color:'rgba(255,255,255,.5)', marginTop:6, fontSize:14 }}>Bienvenue sur votre espace personnel</p>
          </div>
          <div style={{ width:54, height:54, borderRadius:'50%', background:'linear-gradient(135deg,#4338ca,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon d={IC.dumbbell} size={26} color="#fff" />
          </div>
        </div>
      </div>

      <div style={{ padding:'28px 40px' }}>

        {/* Abonnement Card */}
        <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, padding:'24px 28px', marginBottom:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16 }}>
            <div>
              <p style={{ color:C.textMuted, fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:.5, margin:'0 0 6px', display:'flex', alignItems:'center', gap:6 }}>
                <Icon d={IC.sub} size={13} color={C.textMuted} /> Mon abonnement
              </p>
              {abonnement ? (
                <h2 style={{ color:aboColor, fontSize:22, fontWeight:800, margin:'0 0 12px' }}>{abonnement.type}</h2>
              ) : (
                <p style={{ color:C.textMuted, fontSize:16, margin:'0 0 12px' }}>Aucun abonnement actif</p>
              )}
              {abonnement && (
                <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
                  <span style={{ color:C.textLight, fontSize:13, display:'flex', alignItems:'center', gap:6 }}>
                    <Icon d={IC.calendar} size={13} color={C.textMuted} /> {abonnement.date_debut?.slice(0,10)} au {abonnement.date_fin?.slice(0,10)}
                  </span>
                  <span style={{ color:C.textLight, fontSize:13, display:'flex', alignItems:'center', gap:6 }}>
                    <Icon d={IC.money} size={13} color={C.textMuted} /> {abonnement.prix?.toLocaleString()} MAD
                  </span>
                </div>
              )}
              {daysLeft!==null && daysLeft<=7 && (
                <div style={{ marginTop:12, padding:'10px 14px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, color:'#fecaca', fontSize:13, display:'flex', alignItems:'center', gap:8 }}>
                  <Icon d={IC.warning} size={14} color="#fecaca" /> Abonnement expire dans {daysLeft} jours — Pensez à renouveler !
                </div>
              )}
            </div>
            {daysLeft!==null && (
              <div style={{ width:80, height:80, borderRadius:'50%', background:aboColor, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink:0 }}>
                <span style={{ fontSize:22, fontWeight:800, lineHeight:1 }}>{daysLeft}</span>
                <span style={{ fontSize:10 }}>jours</span>
              </div>
            )}
          </div>
        </div>

        {/* Séances Section */}
        <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h2 style={{ fontSize:17, fontWeight:700, color:C.text, margin:0, display:'flex', alignItems:'center', gap:8 }}>
                <Icon d={IC.dumbbell} size={18} color={C.primary} /> Séances disponibles
              </h2>
              <span style={{ background:C.surfaceAlt, padding:'4px 12px', borderRadius:20, fontSize:12, color:C.textMuted }}>
                {filtered.length} séance{filtered.length>1?'s':''}
              </span>
            </div>

            {/* Filters */}
            <div style={{ display:'flex', gap:16, flexWrap:'wrap', alignItems:'flex-end' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:6, minWidth:160 }}>
                <label style={{ color:C.textMuted, fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:.5, display:'flex', alignItems:'center', gap:4 }}>
                  <Icon d={IC.medal} size={11} color={C.textMuted} /> Sport
                </label>
                <select value={sportFilter} onChange={e=>setSportFilter(e.target.value)} style={selectStyle}>
                  {sportsList.map(sp=><option key={sp} value={sp}>{sp}</option>)}
                </select>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6, minWidth:150 }}>
                <label style={{ color:C.textMuted, fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:.5, display:'flex', alignItems:'center', gap:4 }}>
                  <Icon d={IC.users} size={11} color={C.textMuted} /> Public
                </label>
                <select value={audienceFilter} onChange={e=>setAudienceFilter(e.target.value)} style={selectStyle}>
                  {AUDIENCE_OPTIONS.map(a=><option key={a.key} value={a.key}>{a.label}</option>)}
                </select>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6, minWidth:160 }}>
                <label style={{ color:C.textMuted, fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:.5, display:'flex', alignItems:'center', gap:4 }}>
                  <Icon d={IC.stat} size={11} color={C.textMuted} /> Niveau
                </label>
                <select value={niveauFilter} onChange={e=>setNiveauFilter(e.target.value)} style={selectStyle}>
                  {niveauxList.map(n=><option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Séances Grid */}
          <div style={{ padding:24 }}>
            {filtered.length===0 ? (
              <div style={{ textAlign:'center', padding:'40px 0', color:C.textMuted }}>
                <Icon d={IC.inbox} size={40} color={C.textMuted} />
                <p style={{ margin:'12px 0 0' }}>Aucune séance trouvée avec ces filtres</p>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
                {filtered.map(s => {
                  const sc    = SPORT_COLORS[s.nom_sport] || { bg:C.surfaceAlt, color:C.textMuted };
                  const nc    = NIVEAU_COLORS[s.niveau]   || { bg:C.surfaceAlt, color:C.textMuted };
                  const done  = inscrit[s.id_seance];
                  const d     = s.date?.slice(0,10);
                  const isToday = d===today;
                  const isPast  = d<today;
                  return (
                    <div key={s.id_seance} style={{ background:C.surfaceAlt, borderRadius:16, border:`1px solid ${isToday?'#f59e0b40':C.border}`, padding:'18px 20px', display:'flex', flexDirection:'column', gap:12, opacity:isPast?.55:1, transition:'all .2s' }}
                      onMouseEnter={e=>{ if(!isPast) e.currentTarget.style.borderColor=sc.color+'60'; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor=isToday?'#f59e0b40':C.border; }}>
                      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                        <span style={{ background:sc.bg, color:sc.color, border:`1px solid ${sc.color}40`, padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>
                          <Icon d={SPORT_ICONS[s.nom_sport]||IC.dumbbell} size={11} color={sc.color} /> {s.nom_sport}
                        </span>
                        {s.niveau && <span style={{ background:nc.bg, color:nc.color, padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:600 }}>{s.niveau}</span>}
                        {isToday && <span style={{ background:'rgba(245,158,11,0.15)', color:'#fbbf24', border:'1px solid rgba(245,158,11,0.3)', padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>
                          <Icon d={IC.today} size={10} color="#fbbf24" /> Aujourd'hui
                        </span>}
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:40, height:40, borderRadius:10, background:sc.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <Icon d={IC.calendar} size={18} color={sc.color} />
                        </div>
                        <div>
                          <p style={{ color:C.text, fontWeight:700, margin:0, fontSize:14, textTransform:'capitalize' }}>
                            {new Date(s.date).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}
                          </p>
                          <p style={{ color:C.textMuted, fontSize:12, margin:0, display:'flex', alignItems:'center', gap:4 }}>
                            <Icon d={IC.clock} size={11} color={C.textMuted} /> {s.heure}
                          </p>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:16, fontSize:12, color:C.textMuted }}>
                        <span style={{ display:'flex', alignItems:'center', gap:4 }}><Icon d={IC.users} size={12} color={C.textMuted} /> {s.capacite} places</span>
                        <span style={{ display:'flex', alignItems:'center', gap:4 }}><Icon d={IC.coach} size={12} color={C.textMuted} /> {s.nom_coach||'Coach TBD'}</span>
                      </div>
                      {!isPast && (
                        <button onClick={()=>handleInscrire(s.id_seance)} disabled={done} style={{ padding:'10px', borderRadius:10, border:done?'1px solid rgba(34,197,94,0.3)':'none', cursor:done?'default':'pointer', fontFamily:'inherit', fontSize:13, fontWeight:700, background:done?'rgba(34,197,94,0.15)':'linear-gradient(135deg,#4338ca,#6366f1)', color:done?'#4ade80':'#fff', transition:'all .2s', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                          <Icon d={done?IC.check:IC.plus} size={14} color={done?'#4ade80':'#fff'} />
                          {done?"Inscrit":"S'inscrire"}
                        </button>
                      )}
                      {isPast && <span style={{ textAlign:'center', color:C.textMuted, fontSize:12, padding:'8px 0' }}>Séance passée</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}