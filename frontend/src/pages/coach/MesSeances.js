// src/pages/coach/MesSeances.js
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
  calendar: ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  plus:     ['M12 5v14','M5 12h14'],
  close:    ['M18 6L6 18','M6 6l12 12'],
  check:    'M20 6L9 17l-5-5',
  warning:  ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  save:     ['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z','M17 21v-8H7v8','M7 3v5h8'],
  clock:    ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 6v6l4 2'],
  inbox:    ['M22 12h-6l-2 3h-4l-2-3H2','M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
  dumbbell: ['M6.5 6.5h11','M6.5 17.5h11','M3 9.5h3v5H3z','M18 9.5h3v5h-3z','M6 12h12'],
  filter:   ['M22 3H2l8 9.46V19l4 2v-8.54L22 3z'],
  users:    ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  edit:     ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  trash:    ['M3 6h18','M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2','M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6','M10 11v6','M14 11v6'],
};

const C = {
  bgDark:'#0a0e1a', surface:'#111827', surfaceAlt:'#1a2234', border:'#1f2937', borderLight:'#374151',
  text:'#f8fafc', textMuted:'#94a3b8', textLight:'#cbd5e1',
  primary:'#6366f1', success:'#22c55e', danger:'#ef4444', warning:'#f59e0b', info:'#3b82f6', purple:'#8b5cf6',
};

const EMPTY_FORM = { date:'', heure:'', capacite:'', id_sport:'', niveau:'' };

export default function MesSeances() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [seances,   setSeances]   = useState([]);
  const [sports,    setSports]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [message,   setMessage]   = useState({ text:'', type:'' });
  const [filter,    setFilter]    = useState('all');
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId,setDeletingId]= useState(null);

  const notify = (text, type='success') => { setMessage({text,type}); setTimeout(()=>setMessage({text:'',type:''}),3500); };

  const resolveCoachId = async () => {
    try {
      const { data:allCoachs } = await axios.get(`${API}/coachs`);
      const myCoach = allCoachs.find(c => c.email===user.email || (c.nom?.toLowerCase()===user.nom?.toLowerCase() && c.prenom?.toLowerCase()===user.prenom?.toLowerCase()));
      if (myCoach) { if(user.id_coach!==myCoach.id_coach) localStorage.setItem('user',JSON.stringify({...user,id_coach:myCoach.id_coach})); return myCoach.id_coach; }
    } catch { /* silencieux */ }
    return user.id_coach || user.id;
  };

  const load = async () => {
    setLoading(true);
    try {
      const id_coach = await resolveCoachId();
      const [s, sp] = await Promise.all([axios.get(`${API}/seances`), axios.get(`${API}/sports`)]);
      setSeances(s.data.filter(se => Number(se.id_coach)===Number(id_coach)));
      setSports(sp.data);
    } catch { notify('Erreur chargement','error'); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const today = new Date().toISOString().slice(0,10);
  const filtered = seances.filter(s => {
    const d = s.date?.slice(0,10);
    if(filter==='today')    return d===today;
    if(filter==='upcoming') return d>today;
    if(filter==='past')     return d<today;
    return true;
  });

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (s) => {
    const sport = sports.find(sp => sp.nom_sport === s.nom_sport);
    setEditingId(s.id_seance);
    setForm({
      date:     s.date ? s.date.slice(0,10) : '',
      heure:    s.heure ? s.heure.slice(0,5) : '',
      capacite: s.capacite || '',
      id_sport: sport ? sport.id_sport : '',
      niveau:   s.niveau || '',
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const id_coach = await resolveCoachId();
      if (!id_coach) return notify('Compte coach introuvable','error');

      if (editingId) {
        await axios.put(`${API}/seances/${editingId}`, { ...form, id_coach });
        notify('Séance modifiée');
      } else {
        await axios.post(`${API}/seances`, { ...form, id_coach });
        notify('Séance ajoutée');
      }
      closeForm();
      load();
    } catch(err) { notify(err.response?.data?.error||'Erreur enregistrement','error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer définitivement cette séance ?')) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API}/seances/${id}`);
      notify('Séance supprimée');
      setSeances(prev => prev.filter(s => s.id_seance !== id));
    } catch {
      notify('Erreur suppression','error');
    } finally {
      setDeletingId(null);
    }
  };

  const filterBtns = [
    { key:'all',      label:'Toutes'      },
    { key:'today',    label:"Aujourd'hui" },
    { key:'upcoming', label:'À venir'     },
    { key:'past',     label:'Passées'     },
  ];

  const inputStyle = { padding:'10px 14px', background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:14, outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box', transition:'border-color 0.2s' };

  const getStatusInfo = (d) => {
    if(d===today) return { label:"Aujourd'hui", color:C.warning };
    if(d>today)   return { label:'À venir',     color:C.info    };
    return             { label:'Passée',         color:C.textMuted };
  };

  return (
    <div style={{ minHeight:'100vh', background:C.bgDark, fontFamily:'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', paddingBottom:60 }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b)', padding:'28px 40px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:800, color:'#f1f5f9', margin:0, letterSpacing:'-0.5px', display:'flex', alignItems:'center', gap:12 }}>
              <Icon d={IC.calendar} size={26} color="#a78bfa" /> Mes Séances
            </h1>
            <p style={{ color:'rgba(255,255,255,.5)', marginTop:8, fontSize:14, margin:'8px 0 0' }}>{seances.length} séance(s) au total</p>
          </div>
          <button onClick={()=> showForm ? closeForm() : openAddForm()} style={{ padding:'11px 22px', background:showForm?C.surfaceAlt:'linear-gradient(135deg,#4338ca,#6366f1)', border:showForm?`1px solid ${C.borderLight}`:'none', borderRadius:12, color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:8, transition:'all 0.2s' }}>
            <Icon d={showForm?IC.close:IC.plus} size={14} color="#fff" />
            {showForm ? 'Fermer' : 'Nouvelle séance'}
          </button>
        </div>
      </div>

      <div style={{ padding:'28px 40px' }}>

        {/* Toast */}
        {message.text && (
          <div style={{ marginBottom:20, padding:'14px 20px', borderRadius:12, border:'1px solid', fontSize:14, fontWeight:600,
            background:message.type==='error'?'rgba(239,68,68,0.1)':'rgba(34,197,94,0.1)',
            borderColor:message.type==='error'?C.danger:C.success, color:message.type==='error'?'#f87171':'#4ade80',
            display:'flex', alignItems:'center', gap:10 }}>
            <Icon d={message.type==='error'?IC.warning:IC.check} size={14} color={message.type==='error'?'#f87171':'#4ade80'} /> {message.text}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, padding:'28px 32px', marginBottom:24, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize:17, fontWeight:700, color:C.text, margin:'0 0 22px', display:'flex', alignItems:'center', gap:8 }}>
              <Icon d={editingId ? IC.edit : IC.plus} size={18} color={C.primary} /> {editingId ? 'Modifier la séance' : 'Ajouter une séance'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:16 }}>
                {[
                  { label:'Date *',     el:<input type="date" value={form.date}     onChange={e=>setForm({...form,date:e.target.value})}     style={inputStyle} min={editingId ? undefined : today} required /> },
                  { label:'Heure *',    el:<input type="time" value={form.heure}    onChange={e=>setForm({...form,heure:e.target.value})}    style={inputStyle} required /> },
                  { label:'Capacité *', el:<input type="number" min="1" max="100" value={form.capacite} onChange={e=>setForm({...form,capacite:e.target.value})} style={inputStyle} placeholder="Capacité" required /> },
                  { label:'Sport *',    el:<select value={form.id_sport} onChange={e=>setForm({...form,id_sport:e.target.value})} style={inputStyle} required>
                      <option value="">-- Choisir --</option>
                      {sports.map(s=><option key={s.id_sport} value={s.id_sport}>{s.nom_sport}</option>)}
                    </select> },
                  { label:'Niveau',     el:<select value={form.niveau} onChange={e=>setForm({...form,niveau:e.target.value})} style={inputStyle}>
                      <option value="">-- Choisir --</option>
                      {['Débutant','Intermédiaire','Avancé','Tous niveaux'].map(n=><option key={n} value={n}>{n}</option>)}
                    </select> },
                ].map(({label,el})=>(
                  <div key={label} style={{ display:'flex', flexDirection:'column', gap:7 }}>
                    <label style={{ fontSize:11, color:C.textMuted, fontWeight:600, textTransform:'uppercase', letterSpacing:0.8 }}>{label}</label>
                    {el}
                  </div>
                ))}
              </div>
              <div style={{ marginTop:20, display:'flex', justifyContent:'flex-end', gap:12 }}>
                <button type="button" onClick={closeForm} style={{ padding:'11px 24px', background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:12, color:C.textMuted, fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>
                  Annuler
                </button>
                <button type="submit" disabled={saving} style={{ padding:'11px 28px', background: editingId ? 'linear-gradient(135deg,#4338ca,#6366f1)' : 'linear-gradient(135deg,#15803d,#22c55e)', border:'none', borderRadius:12, color:'#fff', fontSize:14, fontWeight:600, cursor:saving?'not-allowed':'pointer', fontFamily:'inherit', opacity:saving?0.7:1, display:'flex', alignItems:'center', gap:8 }}>
                  <Icon d={editingId ? IC.save : IC.save} size={14} color="#fff" /> {saving ? 'Enregistrement…' : (editingId ? 'Enregistrer les modifications' : 'Ajouter la séance')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
          <Icon d={IC.filter} size={14} color={C.textMuted} />
          {filterBtns.map(f=>(
            <button key={f.key} onClick={()=>setFilter(f.key)} style={{ padding:'8px 18px', border:filter===f.key?'none':`1px solid ${C.border}`, borderRadius:20, background:filter===f.key?'linear-gradient(135deg,#4338ca,#6366f1)':C.surfaceAlt, color:filter===f.key?'#fff':C.textMuted, fontSize:13, fontWeight:filter===f.key?600:400, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
          {loading ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:C.textMuted }}>
              <Icon d={IC.clock} size={36} color={C.textMuted} />
              <p style={{ margin:'12px 0 0' }}>Chargement…</p>
            </div>
          ) : filtered.length===0 ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:C.textMuted }}>
              <Icon d={IC.inbox} size={40} color={C.textMuted} />
              <p style={{ margin:'12px 0 0', fontSize:14 }}>Aucune séance trouvée</p>
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ background:C.surfaceAlt }}>
                    {['Date','Heure','Sport','Niveau','Capacité','Statut','Actions'].map(h=>(
                      <th key={h} style={{ padding:'13px 18px', textAlign:'left', fontWeight:600, color:C.textMuted, fontSize:11, textTransform:'uppercase', letterSpacing:0.6, borderBottom:`1px solid ${C.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s,i)=>{
                    const d=s.date?.slice(0,10);
                    const {label,color}=getStatusInfo(d);
                    return (
                      <tr key={s.id_seance} style={{ background:i%2===0?'transparent':C.surfaceAlt+'80', transition:'background 0.15s' }}
                        onMouseEnter={e=>e.currentTarget.style.background='#1e2a3a'}
                        onMouseLeave={e=>e.currentTarget.style.background=i%2===0?'transparent':C.surfaceAlt+'80'}>
                        <td style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}` }}>
                          <strong style={{ color:C.text }}>{d}</strong>
                        </td>
                        <td style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}`, color:C.textLight }}>{s.heure}</td>
                        <td style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}` }}>
                          <span style={{ background:'#1e1b4b', color:'#a78bfa', border:'1px solid #4338ca40', padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:600, display:'inline-flex', alignItems:'center', gap:4 }}>
                            <Icon d={IC.dumbbell} size={11} color="#a78bfa" /> {s.nom_sport}
                          </span>
                        </td>
                        <td style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}`, color:C.textLight }}>{s.niveau||'—'}</td>
                        <td style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}`, color:C.textLight }}>
                          <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                            <Icon d={IC.users} size={13} color={C.textMuted} /> {s.capacite} pers.
                          </span>
                        </td>
                        <td style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}` }}>
                          <span style={{ background:color+'20', color, border:`1px solid ${color}40`, padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:600 }}>{label}</span>
                        </td>
                        <td style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}` }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <button onClick={()=>openEditForm(s)} title="Modifier" style={{ width:32, height:32, borderRadius:9, background:'rgba(99,102,241,0.12)', border:`1px solid ${C.primary}40`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}
                              onMouseEnter={e=>e.currentTarget.style.background='rgba(99,102,241,0.25)'}
                              onMouseLeave={e=>e.currentTarget.style.background='rgba(99,102,241,0.12)'}>
                              <Icon d={IC.edit} size={14} color={C.primary} />
                            </button>
                            <button onClick={()=>handleDelete(s.id_seance)} disabled={deletingId===s.id_seance} title="Supprimer" style={{ width:32, height:32, borderRadius:9, background:'rgba(239,68,68,0.12)', border:`1px solid ${C.danger}40`, cursor:deletingId===s.id_seance?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', opacity:deletingId===s.id_seance?0.5:1, transition:'all 0.15s' }}
                              onMouseEnter={e=>{ if(deletingId!==s.id_seance) e.currentTarget.style.background='rgba(239,68,68,0.25)'; }}
                              onMouseLeave={e=>e.currentTarget.style.background='rgba(239,68,68,0.12)'}>
                              <Icon d={IC.trash} size={14} color={C.danger} />
                            </button>
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
    </div>
  );
}