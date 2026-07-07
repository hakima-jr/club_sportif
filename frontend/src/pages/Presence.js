// src/pages/Presence.js
import React, { useState, useEffect } from 'react';
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
  check:    'M20 6L9 17l-5-5',
  close:    ['M18 6L6 18','M6 6l12 12'],
  users:    ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  calendar: ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  warning:  ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  user:     ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  tag:      ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z','M7 7h.01'],
  inbox:    ['M22 12h-6l-2 3h-4l-2-3H2','M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
};

function Presence() {
  const user    = JSON.parse(localStorage.getItem('user') || '{}');
  const isCoach = user.role === 'coach';
  const isAdmin = user.role === 'admin';

  const [seances,        setSeances]        = useState([]);
  const [selectedSeance, setSelectedSeance] = useState('');
  const [membres,        setMembres]        = useState([]);
  const [presences,      setPresences]      = useState({});
  const [loading,        setLoading]        = useState(false);
  const [message,        setMessage]        = useState({ text:'', type:'' });

  const notify = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text:'', type:'' }), 3000);
  };

  useEffect(() => {
    axios.get(`${API}/seances`).then(res => {
      let data = res.data || [];
      if (isCoach) data = data.filter(s => Number(s.id_coach) === Number(user.id_coach));
      setSeances(data);
    }).catch(() => notify('Erreur chargement séances', 'error'));
  }, []);

  const handleSeanceChange = async (e) => {
    const id = e.target.value;
    setSelectedSeance(id); setMembres([]); setPresences({});
    if (!id) return;
    setLoading(true);
    try {
      const [inscritsRes, presenceRes] = await Promise.all([
        axios.get(`${API}/seances/${id}/membres`),
        axios.get(`${API}/presence/${id}`),
      ]);
      setMembres(inscritsRes.data || []);
      const presenceMap = {};
      presenceRes.data.forEach(p => { presenceMap[p.id_membre] = p.statut; });
      setPresences(presenceMap);
    } catch { notify('Erreur chargement données', 'error'); }
    finally  { setLoading(false); }
  };

  const handleMark = async (id_membre, statut) => {
    try {
      await axios.post(`${API}/presence`, { id_seance:selectedSeance, id_membre, statut });
      setPresences(prev => ({ ...prev, [id_membre]:statut }));
      notify(`${statut} enregistré`);
    } catch { notify('Erreur enregistrement', 'error'); }
  };

  const total   = membres.length;
  const present = Object.values(presences).filter(s => s==='Présent').length;
  const absent  = Object.values(presences).filter(s => s==='Absent').length;
  const roleColor = isCoach?'#16a34a':isAdmin?'#dc2626':'#d97706';
  const roleLabel = isCoach?'Coach':isAdmin?'Admin':'Réception';

  const inputStyle = { width:'100%', padding:'9px 14px', background:'#232938', border:'1px solid #2d3448', borderRadius:8, color:'#e2e8f0', fontSize:14, outline:'none', boxSizing:'border-box' };

  return (
    <div style={{ padding:'32px 24px', maxWidth:1100, margin:'0 auto', fontFamily:'Segoe UI, sans-serif', background:'#0f1117', minHeight:'100vh' }}>

      {message.text && (
        <div style={{ padding:'10px 16px', borderRadius:8, border:'1px solid', marginBottom:16, fontSize:14,
          background:message.type==='error'?'#3b1f1f':'#1a3b2a',
          borderColor:message.type==='error'?'#ef4444':'#16a34a',
          color:message.type==='error'?'#f87171':'#4ade80',
          display:'flex', alignItems:'center', gap:8 }}>
          <Icon d={message.type==='error'?IC.warning:IC.check} size={14} color={message.type==='error'?'#f87171':'#4ade80'} /> {message.text}
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <div>
          <h2 style={{ fontSize:24, fontWeight:700, color:'#e2e8f0', margin:0, display:'flex', alignItems:'center', gap:10 }}>
            <Icon d={IC.check} size={24} color="#22c55e" /> Suivi de Présence
          </h2>
          <p style={{ color:'#64748b', fontSize:13, marginTop:4 }}>{isCoach?'Vos séances uniquement':'Toutes les séances'}</p>
        </div>
        <span style={{ color:'#fff', padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:600, background:roleColor, display:'flex', alignItems:'center', gap:6 }}>
          <Icon d={IC.tag} size={12} color="#fff" /> {roleLabel}
        </span>
      </div>

      {/* Séance selector */}
      <div style={{ background:'#1a1f2e', borderRadius:12, marginBottom:20, overflow:'hidden' }}>
        <div style={{ padding:'20px' }}>
          <label style={{ color:'#94a3b8', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
            <Icon d={IC.calendar} size={14} color="#94a3b8" /> Choisir une séance
          </label>
          <select style={inputStyle} value={selectedSeance} onChange={handleSeanceChange}>
            <option value="">-- Sélectionner une séance --</option>
            {seances.map(s => (
              <option key={s.id_seance} value={s.id_seance}>
                {s.date?.slice(0,10)} à {s.heure} — {s.nom_sport}{!isCoach&&s.nom_coach?` — ${s.nom_coach}`:''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      {selectedSeance && !loading && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px,1fr))', gap:14, marginBottom:20 }}>
          {[
            { label:'Inscrits', value:total,   color:'#6366f1', bg:'#1e1b4b', icon:IC.users   },
            { label:'Présents', value:present, color:'#4ade80', bg:'#14532d', icon:IC.check   },
            { label:'Absents',  value:absent,  color:'#f87171', bg:'#3b1f1f', icon:IC.close   },
          ].map(c => (
            <div key={c.label} style={{ borderRadius:10, padding:'16px 14px', textAlign:'center', background:c.bg, borderTop:`3px solid ${c.color}` }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}><Icon d={c.icon} size={20} color={c.color} /></div>
              <div style={{ fontSize:28, fontWeight:700, color:c.color }}>{c.value}</div>
              <div style={{ color:'#94a3b8', fontSize:12, marginTop:4 }}>{c.label}</div>
            </div>
          ))}
        </div>
      )}

      {selectedSeance && (
        loading ? (
          <div style={{ textAlign:'center', color:'#64748b', padding:'40px' }}>Chargement…</div>
        ) : membres.length === 0 ? (
          <div style={{ background:'#1a1f2e', color:'#94a3b8', padding:'40px 20px', borderRadius:8, textAlign:'center', border:'1px solid #2d3448', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <Icon d={IC.inbox} size={36} color="#64748b" />
            <span>Aucun membre inscrit à cette séance</span>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'#232938' }}>
                  {['Nom','Prénom','Statut','Actions'].map(h => (
                    <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontWeight:600, color:'#64748b', fontSize:12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {membres.map((m, i) => {
                  const statut = presences[m.id_personne];
                  return (
                    <tr key={m.id_personne} style={{ background:i%2===0?'#1a1f2e':'#1e2537' }}>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}>
                        <strong style={{ color:'#e2e8f0' }}>{m.nom}</strong>
                      </td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}>{m.prenom}</td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}>
                        {statut==='Présent' && <span style={{ background:'#14532d', color:'#4ade80', padding:'3px 10px', borderRadius:10, fontSize:11, fontWeight:600, display:'inline-flex', alignItems:'center', gap:4 }}><Icon d={IC.check} size={11} color="#4ade80" /> Présent</span>}
                        {statut==='Absent'  && <span style={{ background:'#3b1f1f', color:'#f87171', padding:'3px 10px', borderRadius:10, fontSize:11, fontWeight:600, display:'inline-flex', alignItems:'center', gap:4 }}><Icon d={IC.close} size={11} color="#f87171" /> Absent</span>}
                        {!statut && <span style={{ color:'#475569' }}>—</span>}
                      </td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435' }}>
                        <button style={{ padding:'4px 12px', background:'#14532d', border:'1px solid #16a34a', borderRadius:6, color:'#4ade80', fontSize:12, cursor:'pointer', fontWeight:500, marginRight:6, opacity:statut==='Présent'?0.4:1, display:'inline-flex', alignItems:'center', gap:4 }}
                          onClick={()=>handleMark(m.id_personne,'Présent')} disabled={statut==='Présent'}>
                          <Icon d={IC.check} size={12} color="#4ade80" /> Présent
                        </button>
                        <button style={{ padding:'4px 12px', background:'#3b1f1f', border:'1px solid #ef4444', borderRadius:6, color:'#f87171', fontSize:12, cursor:'pointer', fontWeight:500, opacity:statut==='Absent'?0.4:1, display:'inline-flex', alignItems:'center', gap:4 }}
                          onClick={()=>handleMark(m.id_personne,'Absent')} disabled={statut==='Absent'}>
                          <Icon d={IC.close} size={12} color="#f87171" /> Absent
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

export default Presence;