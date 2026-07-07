// src/pages/admin/GestionCoachs.js
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const SPECIALITES = ['Musculation','Cardio','Yoga','Boxe','Natation','Zumba','Fitness','Arts martiaux'];
const SPEC_COLORS = {
  Musculation:     { bg:'#1e1b4b', color:'#a78bfa', border:'#4338ca', gradient:'linear-gradient(135deg,#4338ca,#6366f1)' },
  Cardio:          { bg:'#1f2937', color:'#60a5fa', border:'#2563eb', gradient:'linear-gradient(135deg,#2563eb,#3b82f6)' },
  Yoga:            { bg:'#132624', color:'#34d399', border:'#059669', gradient:'linear-gradient(135deg,#059669,#10b981)' },
  Boxe:            { bg:'#3b1f1f', color:'#f87171', border:'#ef4444', gradient:'linear-gradient(135deg,#ef4444,#f87171)' },
  Natation:        { bg:'#0c1e38', color:'#38bdf8', border:'#0284c7', gradient:'linear-gradient(135deg,#0284c7,#0ea5e9)' },
  Zumba:           { bg:'#2e1a3a', color:'#e879f9', border:'#a21caf', gradient:'linear-gradient(135deg,#a21caf,#d946ef)' },
  Fitness:         { bg:'#1c2e1a', color:'#86efac', border:'#16a34a', gradient:'linear-gradient(135deg,#16a34a,#22c55e)' },
  'Arts martiaux': { bg:'#2d2215', color:'#fbbf24', border:'#d97706', gradient:'linear-gradient(135deg,#d97706,#f59e0b)' },
};
const C = {
  bgDark:'#0a0e1a', surface:'#111827', surfaceAlt:'#1a2234', border:'#1f2937',
  borderLight:'#374151', text:'#f8fafc', textMuted:'#94a3b8', textLight:'#cbd5e1',
  primary:'#6366f1', success:'#22c55e', danger:'#ef4444', warning:'#f59e0b', info:'#3b82f6',
};
const fmt = (n) => Number(n||0).toLocaleString('fr-MA');

function Icon({ d, size = 16, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}
const IC = {
  coach:   ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  plus:    ['M12 5v14','M5 12h14'],
  edit:    ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  trash:   ['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'],
  search:  ['M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12z','M21 21l-4.35-4.35'],
  close:   ['M18 6L6 18','M6 6l12 12'],
  check:   'M20 6L9 17l-5-5',
  warning: ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  mail:    ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6'],
  phone:   'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.07 6.07l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  mapPin:  ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z','M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  money:   ['M12 1v22','M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
  medal:   ['M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z','M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  user:    ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
};

function Avatar({ coach, size = 56 }) {
  const initials = `${coach.nom?.[0]||''}${coach.prenom?.[0]||''}`.toUpperCase();
  const hue = ((coach.nom||'A').charCodeAt(0)*37)%360;
  if (coach.photo) return <img src={`${API}/uploads/${coach.photo}`} alt="profil" style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', border:`3px solid ${C.borderLight}`, flexShrink:0 }} />;
  return <div style={{ width:size, height:size, borderRadius:'50%', flexShrink:0, background:`hsl(${hue},55%,22%)`, border:`3px solid hsl(${hue},55%,40%)`, display:'flex', alignItems:'center', justifyContent:'center', color:`hsl(${hue},60%,78%)`, fontWeight:700, fontSize:size*0.33, userSelect:'none' }}>{initials}</div>;
}

function CoachCard({ coach, onEdit, onDelete, onToggle, navigate }) {
  const spec = coach.specialite||'';
  const col = SPEC_COLORS[spec] || { bg:C.surfaceAlt, color:C.textMuted, border:C.borderLight, gradient:`linear-gradient(135deg,${C.borderLight},${C.border})` };
  const isActif = coach.statut === 'actif';
  return (
    <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, overflow:'hidden', display:'flex', flexDirection:'column', transition:'all 0.3s ease', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}
      onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 16px 48px rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor=col.border; }}
      onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.3)'; e.currentTarget.style.borderColor=C.border; }}>
      <div style={{ height:4, background:col.gradient }} />
      <div style={{ padding:'20px 20px 14px', display:'flex', alignItems:'center', gap:14 }}>
        <Avatar coach={coach} size={58} />
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ margin:0, fontWeight:700, fontSize:15, color:C.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{coach.prenom} {coach.nom}</p>
          <p style={{ margin:'4px 0 0', fontSize:12, color:C.textMuted }}>{coach.sexe||'—'}</p>
        </div>
        <button onClick={()=>onToggle(coach)} style={{ padding:'5px 14px', borderRadius:20, fontSize:11, fontWeight:700, cursor:'pointer', border:'1px solid', whiteSpace:'nowrap',
          background:isActif?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)', borderColor:isActif?'#22c55e':'#ef4444', color:isActif?'#22c55e':'#ef4444' }}>
          {isActif?'● Actif':'● Inactif'}
        </button>
      </div>
      {spec && (
        <div style={{ padding:'0 20px 12px' }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 14px', borderRadius:20, fontSize:11, fontWeight:700, background:col.bg, color:col.color, border:`1px solid ${col.border}` }}>
            <Icon d={IC.medal} size={12} color={col.color} /> {spec}
          </span>
        </div>
      )}
      <div style={{ height:1, background:C.border, margin:'0 20px' }} />
      <div style={{ padding:'14px 20px', display:'flex', flexDirection:'column', gap:8, flex:1 }}>
        {[
          { iconKey:'mail',   val:coach.email||'—',     color:C.textLight },
          { iconKey:'phone',  val:coach.telephone||'—', color:C.textMuted },
          { iconKey:'mapPin', val:coach.adresse||'—',   color:C.textMuted },
        ].map(r => (
          <div key={r.iconKey} style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <Icon d={IC[r.iconKey]} size={13} color="#64748b" />
            <span style={{ fontSize:12, color:r.color, wordBreak:'break-all', lineHeight:1.5 }}>{r.val}</span>
          </div>
        ))}
        {coach.salaire && (
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:4, padding:'8px 12px', background:'rgba(34,197,94,0.08)', borderRadius:10, border:'1px solid rgba(34,197,94,0.2)' }}>
            <Icon d={IC.money} size={14} color={C.success} />
            <span style={{ color:C.success, fontWeight:700, fontSize:14 }}>{fmt(coach.salaire)} MAD / mois</span>
          </div>
        )}
      </div>
      <div style={{ padding:'12px 20px 18px', display:'flex', gap:8 }}>
        <button onClick={()=>navigate(`/admin/coachs/${coach.id_coach}`)} style={{ flex:2, padding:'9px 0', background:C.surfaceAlt, border:`1px solid ${C.borderLight}`, borderRadius:10, color:C.textLight, fontSize:12, cursor:'pointer', fontWeight:600, transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}
          onMouseEnter={e=>{ e.currentTarget.style.background=C.primary; e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.color='#fff'; }}
          onMouseLeave={e=>{ e.currentTarget.style.background=C.surfaceAlt; e.currentTarget.style.borderColor=C.borderLight; e.currentTarget.style.color=C.textLight; }}>
          <Icon d={IC.user} size={12} color="currentColor" /> Profil
        </button>
        <button onClick={()=>navigate(`/admin/coachs/modifier/${coach.id_coach}`)} style={{ flex:2, padding:'9px 0', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.3)', borderRadius:10, color:C.info, fontSize:12, cursor:'pointer', fontWeight:600, transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(59,130,246,0.2)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(59,130,246,0.1)'}>
          <Icon d={IC.edit} size={12} color={C.info} /> Modifier
        </button>
        <button onClick={()=>onDelete(coach.id_coach)} style={{ flex:1, padding:'9px 0', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, color:C.danger, fontSize:12, cursor:'pointer', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.2)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(239,68,68,0.1)'}>
          <Icon d={IC.trash} size={14} color={C.danger} />
        </button>
      </div>
    </div>
  );
}

export default function GestionCoachs() {
  const navigate = useNavigate();
  const [coachs,       setCoachs]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [message,      setMessage]      = useState({ text:'', type:'' });
  const [filterSpec,   setFilterSpec]   = useState('all');
  const [filterStatut, setFilterStatut] = useState('all');

  const notify = (text, type = 'success') => { setMessage({ text, type }); setTimeout(()=>setMessage({text:'',type:''}),3500); };
  const load = async () => {
    setLoading(true);
    try { const { data } = await axios.get(`${API}/coachs`); setCoachs(data); }
    catch { notify('Erreur chargement coachs', 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async id => {
    if (!window.confirm('Supprimer ce coach ? Cette action est irréversible.')) return;
    try { await axios.delete(`${API}/coachs/${id}`); notify('Coach supprimé'); load(); }
    catch { notify('Erreur suppression', 'error'); }
  };
  const toggleStatut = async c => {
    const newStatut = c.statut==='actif'?'inactif':'actif';
    try { await axios.put(`${API}/coachs/${c.id_coach}`, { ...c, statut:newStatut }); notify(`Coach ${newStatut==='actif'?'activé':'désactivé'}`); load(); }
    catch { notify('Erreur changement statut', 'error'); }
  };

  const filtered = coachs.filter(c => {
    const matchSearch  = `${c.nom} ${c.prenom} ${c.specialite}`.toLowerCase().includes(search.toLowerCase());
    const matchSpec    = filterSpec==='all'   || c.specialite===filterSpec;
    const matchStatut  = filterStatut==='all' || c.statut===filterStatut;
    return matchSearch && matchSpec && matchStatut;
  });
  const actifs         = coachs.filter(c=>c.statut==='actif').length;
  const inactifs       = coachs.length - actifs;
  const totalSalaires  = coachs.reduce((s,c)=>s+parseFloat(c.salaire||0),0);

  const inputStyle = { padding:'12px 16px', background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, color:C.text, fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'inherit' };

  return (
    <div style={{ padding:'0 0 60px', fontFamily:'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', maxWidth:1400, margin:'0 auto', background:C.bgDark, minHeight:'100vh' }}>

      {/* Hero Header */}
      <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b)', padding:'36px 40px 28px', marginBottom:28 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:24 }}>
          <div>
            <h1 style={{ fontSize:32, fontWeight:800, color:'#f1f5f9', margin:0, letterSpacing:'-0.5px', display:'flex', alignItems:'center', gap:12 }}>
              <Icon d={IC.coach} size={30} color="#a78bfa" /> Gestion des Coachs
            </h1>
            <p style={{ color:'rgba(255,255,255,.5)', marginTop:8, fontSize:14 }}>Gérez votre équipe d'entraîneurs et suivez leurs performances</p>
          </div>
          <div style={{ display:'flex', gap:16 }}>
            {[
              { num:coachs.length, label:'Total',      col:'#a78bfa', bg:'rgba(167,139,250,0.15)' },
              { num:actifs,        label:'Actifs',     col:'#4ade80', bg:'rgba(74,222,128,0.15)' },
              { num:inactifs,      label:'Inactifs',   col:'#f87171', bg:'rgba(248,113,113,0.15)' },
              { num:`${fmt(totalSalaires)} MAD`, label:'Salaires/mois', col:'#fbbf24', bg:'rgba(251,191,36,0.15)' },
            ].map(s => (
              <div key={s.label} style={{ background:s.bg, borderRadius:14, padding:'14px 20px', textAlign:'center', minWidth:80, border:`1px solid ${s.col}30` }}>
                <span style={{ display:'block', fontSize:s.label==='Salaires/mois'?14:22, fontWeight:800, color:s.col }}>{s.num}</span>
                <span style={{ display:'block', fontSize:10, color:s.col, marginTop:4, textTransform:'uppercase', letterSpacing:1, opacity:0.8 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      {message.text && (
        <div style={{ margin:'0 40px 20px', padding:'14px 20px', borderRadius:12, border:'1px solid', fontSize:14, fontWeight:600,
          background:message.type==='error'?'rgba(239,68,68,0.1)':'rgba(34,197,94,0.1)',
          borderColor:message.type==='error'?'#ef4444':'#22c55e',
          color:message.type==='error'?'#f87171':'#4ade80', display:'flex', alignItems:'center', gap:10 }}>
          <Icon d={message.type==='error'?IC.warning:IC.check} size={14} color={message.type==='error'?'#f87171':'#4ade80'} /> {message.text}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display:'flex', gap:16, margin:'0 40px 24px', flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', display:'flex', alignItems:'center', flex:1, minWidth:280 }}>
          <span style={{ position:'absolute', left:14 }}><Icon d={IC.search} size={15} color="#64748b" /></span>
          <input style={{ ...inputStyle, width:'100%', paddingLeft:40 }} placeholder="Rechercher par nom, prénom ou spécialité…" value={search} onChange={e=>setSearch(e.target.value)} />
          {search && <button style={{ position:'absolute', right:12, background:'none', border:'none', color:C.textMuted, cursor:'pointer' }} onClick={()=>setSearch('')}><Icon d={IC.close} size={14} color={C.textMuted} /></button>}
        </div>
        <select value={filterSpec} onChange={e=>setFilterSpec(e.target.value)} style={{ ...inputStyle, minWidth:150, cursor:'pointer' }}>
          <option value="all">Toutes spécialités</option>
          {SPECIALITES.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterStatut} onChange={e=>setFilterStatut(e.target.value)} style={{ ...inputStyle, minWidth:130, cursor:'pointer' }}>
          <option value="all">Tous statuts</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
        <button onClick={()=>navigate('/admin/coachs/ajouter')} style={{ padding:'12px 24px', background:'linear-gradient(135deg,#4338ca,#6366f1)', border:'none', borderRadius:12, color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 14px rgba(99,102,241,0.4)', whiteSpace:'nowrap' }}
          onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 6px 20px rgba(99,102,241,0.6)'; e.currentTarget.style.transform='translateY(-1px)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.boxShadow='0 4px 14px rgba(99,102,241,0.4)'; e.currentTarget.style.transform='none'; }}>
          <Icon d={IC.plus} size={16} color="#fff" /> Ajouter un coach
        </button>
      </div>

      <p style={{ color:C.textMuted, fontSize:13, margin:'0 40px 20px', fontWeight:500 }}>{filtered.length} coach(s) trouvé(s) sur {coachs.length} total</p>

      {/* Grid */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:'80px 0', color:C.textMuted, fontSize:16 }}>
          <div style={{ textAlign:'center' }}><Icon d={IC.coach} size={40} color={C.textMuted} /><p style={{ marginTop:16 }}>Chargement des coachs…</p></div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'100px 0', textAlign:'center' }}>
          <Icon d={IC.search} size={56} color={C.textMuted} style={{ opacity:0.3, marginBottom:20 }} />
          <p style={{ color:C.textMuted, margin:0, fontSize:16, fontWeight:500 }}>Aucun coach trouvé</p>
          <p style={{ color:C.textMuted, margin:'8px 0 0', fontSize:13 }}>Essayez de modifier vos filtres</p>
          <button style={{ marginTop:24, padding:'12px 24px', background:'linear-gradient(135deg,#4338ca,#6366f1)', border:'none', borderRadius:12, color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}
            onClick={()=>navigate('/admin/coachs/ajouter')}>
            <Icon d={IC.plus} size={16} color="#fff" /> Ajouter un coach
          </button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:24, padding:'0 40px' }}>
          {filtered.map(c => (
            <CoachCard key={c.id_coach} coach={c} onEdit={()=>navigate(`/admin/coachs/modifier/${c.id_coach}`)} onDelete={handleDelete} onToggle={toggleStatut} navigate={navigate} />
          ))}
          <div onClick={()=>navigate('/admin/coachs/ajouter')} style={{ borderRadius:20, border:`2px dashed ${C.borderLight}`, background:'transparent', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:280, cursor:'pointer', transition:'all 0.3s', color:C.textMuted }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.background='rgba(99,102,241,0.05)'; e.currentTarget.style.color=C.primary; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.borderLight; e.currentTarget.style.background='transparent'; e.currentTarget.style.color=C.textMuted; }}>
            <Icon d={IC.plus} size={44} color="currentColor" />
            <p style={{ margin:'12px 0 0', fontSize:15, fontWeight:600 }}>Nouveau Coach</p>
            <p style={{ margin:'6px 0 0', fontSize:12, opacity:0.7 }}>Cliquez pour ajouter</p>
          </div>
        </div>
      )}
    </div>
  );
}