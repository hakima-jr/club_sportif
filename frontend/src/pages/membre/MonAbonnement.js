// src/pages/membre/MonAbonnement.js
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
  arrow:    'M5 12h14M12 5l7 7-7 7',
  warning:  ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  phone:    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.07 6.07l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  frown:    ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M16 16s-1.5-2-4-2-4 2-4 2','M9 9h.01','M15 9h.01'],
  clock:    ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 6v6l4 2'],
};

export default function MonAbonnement() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [abonnements, setAbonnements] = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    if (!user.id_membre) { setLoading(false); return; }
    axios.get(`${API}/abonnements-par-membre/${user.id_membre}`)
      .then(res => setAbonnements(res.data))
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  const getStatut = (date_fin) => {
    const days = Math.ceil((new Date(date_fin) - new Date()) / 86400000);
    if (days < 0)  return { label:'Expiré',            color:'#f87171', bg:'#7f1d1d' };
    if (days <= 7) return { label:`${days}j restants`,  color:'#fb923c', bg:'#7c2d12' };
    return             { label:'Actif',              color:'#4ade80', bg:'#064e3b' };
  };

  const actif    = abonnements.find(a => new Date(a.date_fin) >= new Date());
  const daysLeft = actif ? Math.max(0, Math.ceil((new Date(actif.date_fin) - new Date()) / 86400000)) : 0;
  const pct      = actif ? Math.min(100, Math.round((daysLeft / Math.ceil((new Date(actif.date_fin) - new Date(actif.date_debut)) / 86400000)) * 100)) : 0;

  if (loading) return <div style={S.center}>Chargement…</div>;

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.title}><Icon d={IC.sub} size={26} color="#a78bfa" /> Mon Abonnement</h1>
      </div>

      {actif ? (
        <div style={S.heroCard}>
          <div style={S.heroLeft}>
            <p style={S.heroMeta}><Icon d={IC.sub} size={13} color="rgba(255,255,255,.65)" /> Abonnement actuel</p>
            <h2 style={S.heroType}>{actif.type}</h2>
            <div style={S.heroDates}>
              <div style={S.dateChip}>
                <span style={S.dateChipLabel}>Début</span>
                <span style={S.dateChipVal}>{actif.date_debut?.slice(0,10)}</span>
              </div>
              <Icon d={IC.arrow} size={20} color="rgba(255,255,255,.4)" />
              <div style={S.dateChip}>
                <span style={S.dateChipLabel}>Fin</span>
                <span style={S.dateChipVal}>{actif.date_fin?.slice(0,10)}</span>
              </div>
            </div>
            <div style={S.progressWrap}>
              <div style={{ ...S.progressBar, width:`${pct}%` }} />
            </div>
            <p style={S.heroNote}>
              <Icon d={IC.phone} size={13} color="rgba(255,255,255,.7)" /> Pour renouveler, contactez la réception.
            </p>
          </div>
          <div style={S.heroRight}>
            <div style={S.daysCircle}>
              <span style={S.daysNum}>{daysLeft}</span>
              <span style={S.daysLabel}>jours<br/>restants</span>
            </div>
            <div style={S.prixBadge}>{actif.prix} MAD</div>
          </div>
        </div>
      ) : (
        <div style={S.noAbo}>
          <Icon d={IC.frown} size={48} color="#94a3b8" />
          <p style={{ color:'#94a3b8', marginTop:12, fontSize:16 }}>Aucun abonnement actif</p>
          <p style={{ color:'#64748b', fontSize:13 }}>Contactez la réception pour vous abonner</p>
        </div>
      )}

      {abonnements.length > 0 && (
        <div style={S.card}>
          <h3 style={S.cardTitle}>
            <Icon d={IC.clock} size={18} color="#6366f1" /> Historique des abonnements
          </h3>
          <div style={{ overflowX:'auto' }}>
            <table style={S.table}>
              <thead>
                <tr style={S.thead}>
                  {['Type','Début','Fin','Prix','Statut'].map(h => <th key={h} style={S.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {abonnements.map((a, i) => {
                  const st = getStatut(a.date_fin);
                  return (
                    <tr key={a.id_abonnement} style={{ background:i%2===0?'transparent':'#1e2537' }}>
                      <td style={S.td}><strong style={{ color:'#e2e8f0' }}>{a.type}</strong></td>
                      <td style={S.td}>{a.date_debut?.slice(0,10)}</td>
                      <td style={S.td}>{a.date_fin?.slice(0,10)}</td>
                      <td style={S.td}><strong style={{ color:'#4ade80' }}>{a.prix} MAD</strong></td>
                      <td style={S.td}>
                        <span style={{ background:st.bg, color:st.color, padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:600 }}>{st.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  page:         { padding:'32px 40px', fontFamily:'Segoe UI, sans-serif', maxWidth:1200, margin:'0 auto' },
  center:       { padding:60, textAlign:'center', color:'#94a3b8', fontFamily:'Segoe UI, sans-serif' },
  header:       { marginBottom:28 },
  title:        { fontSize:26, fontWeight:800, color:'#f1f5f9', margin:0, letterSpacing:'-0.5px', display:'flex', alignItems:'center', gap:10 },
  heroCard:     { background:'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius:20, padding:'36px 40px', marginBottom:24, display:'flex', justifyContent:'space-between', alignItems:'center', gap:24, flexWrap:'wrap' },
  heroLeft:     { flex:1 },
  heroMeta:     { color:'rgba(255,255,255,.65)', fontSize:13, margin:'0 0 4px', display:'flex', alignItems:'center', gap:6 },
  heroType:     { color:'#fff', fontSize:28, fontWeight:800, margin:'0 0 20px', letterSpacing:'-0.5px' },
  heroDates:    { display:'flex', alignItems:'center', gap:12, marginBottom:18 },
  dateChip:     { background:'rgba(255,255,255,.15)', borderRadius:10, padding:'8px 16px', display:'flex', flexDirection:'column' },
  dateChipLabel:{ color:'rgba(255,255,255,.6)', fontSize:11 },
  dateChipVal:  { color:'#fff', fontWeight:700, fontSize:14 },
  progressWrap: { background:'rgba(255,255,255,.2)', borderRadius:999, height:6, marginBottom:16, overflow:'hidden' },
  progressBar:  { height:'100%', background:'#fff', borderRadius:999, transition:'width .5s' },
  heroNote:     { color:'rgba(255,255,255,.7)', fontSize:13, margin:0, display:'flex', alignItems:'center', gap:6 },
  heroRight:    { display:'flex', flexDirection:'column', alignItems:'center', gap:16 },
  daysCircle:   { width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,.2)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' },
  daysNum:      { color:'#fff', fontSize:32, fontWeight:800, lineHeight:1 },
  daysLabel:    { color:'rgba(255,255,255,.7)', fontSize:11, lineHeight:1.4 },
  prixBadge:    { background:'rgba(255,255,255,.2)', color:'#fff', padding:'8px 20px', borderRadius:20, fontWeight:700, fontSize:16 },
  noAbo:        { textAlign:'center', padding:'60px 0', background:'#1a1f2e', borderRadius:20, border:'1px solid #2d3448', marginBottom:24, display:'flex', flexDirection:'column', alignItems:'center', gap:8 },
  card:         { background:'#1a1f2e', borderRadius:16, padding:'28px 32px', border:'1px solid #2d3448' },
  cardTitle:    { fontSize:16, fontWeight:700, color:'#f1f5f9', marginTop:0, marginBottom:20, display:'flex', alignItems:'center', gap:8 },
  table:        { width:'100%', borderCollapse:'collapse', fontSize:13 },
  thead:        { background:'#232938' },
  th:           { padding:'13px 16px', textAlign:'left', fontWeight:600, color:'#64748b', fontSize:12, textTransform:'uppercase', letterSpacing:0.5 },
  td:           { padding:'12px 16px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' },
};