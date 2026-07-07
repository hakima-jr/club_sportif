// src/pages/Seance.js
import { useState, useEffect } from "react";
import { getSeances, getSports, getCoachs, addSeance, deleteSeance } from "../api/api";
import axios from "axios";

const API = 'http://localhost:5000/api';
const today = new Date().toISOString().split('T')[0];
const EMPTY_FORM = { nom:"", sport:"", coach:"", jour:"", debut:"", fin:"", capaciteMax:"", niveau:"Débutant", public_cible:"Mixte" };

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
  edit:     ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  trash:    ['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'],
  check:    'M20 6L9 17l-5-5',
  warning:  ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  save:     ['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z','M17 21v-8H7v8','M7 3v5h8'],
};

// Trie toujours la liste par date décroissante (la plus récente en premier),
// puis par heure de début décroissante pour les séances du même jour.
const sortSeances = (list) =>
  [...list].sort((a, b) => {
    if (a.jour !== b.jour) return (b.jour || '').localeCompare(a.jour || '');
    return (b.debut || '').localeCompare(a.debut || '');
  });

function Seance() {
  const [seances,    setSeances]    = useState([]);
  const [sports,     setSports]     = useState([]);
  const [coachs,     setCoachs]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [toast,      setToast]      = useState({ text:'', type:'' });
  const [showForm,   setShowForm]   = useState(true);
  const [formData,   setFormData]   = useState(EMPTY_FORM);
  const [editSeance, setEditSeance] = useState(null);

  const notify = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast({ text:'', type:'' }), 3000);
  };

  const fetchAll = async () => {
    try {
      const [sp, co, se] = await Promise.all([getSports(), getCoachs(), getSeances()]);
      setSports(sp.data || []);
      setCoachs(co.data || []);
      const data = (se.data || []).map(s => {
        const heureParts = s.heure ? s.heure.split("-") : ["00:00","00:00"];
        return { id:s.id_seance, id_sport:s.id_sport, id_coach:s.id_coach, nom:s.nom, sport:s.id_sport,
          nom_sport:s.nom_sport, nom_coach:s.nom_coach, jour:s.date?s.date.split("T")[0]:"",
          debut:heureParts[0]||"00:00", fin:heureParts[1]||"00:00", capaciteMax:s.capacite,
          placesOccupees:s.placesOccupees||0, niveau:s.niveau||"Débutant", public_cible:s.public_cible||"Mixte" };
      });
      setSeances(sortSeances(data));
    } catch { notify('Erreur chargement des données', 'error'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]:(id==="sport"||id==="capaciteMax"||id==="coach")?Number(value):value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.coach)              { notify('Veuillez choisir un coach !', 'error'); return; }
    if (formData.fin <= formData.debut) { notify("L'heure de fin doit être après l'heure de début !", 'error'); return; }
    const payload = { nom:formData.nom, date:formData.jour, heure:`${formData.debut}-${formData.fin}`,
      capacite:formData.capaciteMax, id_sport:formData.sport, id_coach:formData.coach,
      niveau:formData.niveau, public_cible:formData.public_cible };
    try {
      const res = await addSeance(payload);
      const coach = coachs.find(c => c.id_coach === formData.coach);
      const nouvelleSeance = { id:res.data.id, nom:formData.nom, sport:formData.sport, id_sport:formData.sport,
        id_coach:formData.coach, nom_sport:sports.find(s=>s.id_sport===formData.sport)?.nom_sport||"—",
        nom_coach:coach?`${coach.nom} ${coach.prenom}`:"—", jour:formData.jour, debut:formData.debut, fin:formData.fin,
        capaciteMax:formData.capaciteMax, placesOccupees:0, niveau:formData.niveau, public_cible:formData.public_cible };
      setSeances(prev => sortSeances([...prev, nouvelleSeance]));
      setFormData(EMPTY_FORM);
      notify('Séance ajoutée avec succès');
    } catch { notify("Erreur lors de l'ajout — vérifiez les données", 'error'); }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editSeance.fin <= editSeance.debut) { notify("L'heure de fin doit être après l'heure de début !", 'error'); return; }
    try {
      await axios.put(`${API}/seances/${editSeance.id}`, { nom:editSeance.nom, date:editSeance.jour,
        heure:`${editSeance.debut}-${editSeance.fin}`, capacite:editSeance.capaciteMax,
        id_sport:Number(editSeance.id_sport), id_coach:Number(editSeance.id_coach),
        niveau:editSeance.niveau, public_cible:editSeance.public_cible });
      notify('Séance modifiée'); setEditSeance(null); fetchAll();
    } catch { notify('Erreur modification', 'error'); }
  };

  const supprimer = async (id) => {
    if (!window.confirm("Voulez-vous supprimer cette séance ?")) return;
    try { await deleteSeance(id); setSeances(prev => sortSeances(prev.filter(s=>s.id!==id))); notify('Séance supprimée'); }
    catch { notify('Erreur lors de la suppression', 'error'); }
  };

  const niveauColor = (n) => {
    if (n==='Débutant')      return { bg:'#1a3a1a', color:'#4ade80' };
    if (n==='Intermédiaire') return { bg:'#1e2f4a', color:'#60a5fa' };
    if (n==='Avancé')        return { bg:'#3b1f1f', color:'#f87171' };
    return { bg:'#232938', color:'#94a3b8' };
  };
  const publicColor = (p) => {
    if (p==='Femmes')  return { bg:'#500725', color:'#fbcfe8' };
    if (p==='Hommes')  return { bg:'#0c4a6e', color:'#bae6fd' };
    if (p==='Enfants') return { bg:'#422006', color:'#fef08a' };
    return { bg:'#3b0764', color:'#d8b4fe' };
  };

  if (loading) return <div style={{ padding:60, textAlign:'center', color:'#94a3b8', fontFamily:'Segoe UI, sans-serif' }}>Chargement...</div>;

  const inputStyle = { padding:'9px 14px', background:'#232938', border:'1px solid #2d3448', borderRadius:8, color:'#e2e8f0', fontSize:14, outline:'none', fontFamily:'Segoe UI, sans-serif', width:'100%', boxSizing:'border-box' };

  return (
    <div style={{ padding:'32px 24px', maxWidth:1100, margin:'0 auto', fontFamily:'Segoe UI, sans-serif', background:'#0f1117', minHeight:'100vh' }}>

      {toast.text && (
        <div style={{ position:'fixed', top:20, right:20, padding:'12px 20px', borderRadius:10, border:'1px solid', fontWeight:600, fontSize:14, zIndex:9999,
          background:toast.type==='error'?'#3b1f1f':'#14532d', borderColor:toast.type==='error'?'#ef4444':'#16a34a', color:toast.type==='error'?'#f87171':'#4ade80',
          display:'flex', alignItems:'center', gap:8 }}>
          <Icon d={toast.type==='error'?IC.warning:IC.check} size={14} color={toast.type==='error'?'#f87171':'#4ade80'} /> {toast.text}
        </div>
      )}

      {/* Edit Modal */}
      {editSeance && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', backdropFilter:'blur(4px)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={()=>setEditSeance(null)}>
          <div style={{ background:'#1a1f2e', border:'1px solid #2d3448', borderRadius:20, padding:32, width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h3 style={{ color:'#f1f5f9', fontSize:18, fontWeight:700, margin:0, display:'flex', alignItems:'center', gap:8 }}>
                <Icon d={IC.edit} size={18} color="#8b5cf6" /> Modifier la séance
              </h3>
              <button style={{ background:'#232938', border:'1px solid #2d3448', borderRadius:8, color:'#94a3b8', width:32, height:32, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }} onClick={()=>setEditSeance(null)}>
                <Icon d={IC.close} size={16} color="#94a3b8" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {[['nom','Nom','text'],['jour','Date','date'],['debut','Heure début','time'],['fin','Heure fin','time'],['capaciteMax','Capacité','number']].map(([k,l,t]) => (
                  <div key={k} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <label style={{ color:'#94a3b8', fontSize:13, fontWeight:500 }}>{l}</label>
                    <input type={t} style={inputStyle} value={editSeance[k]||''} min={k==='jour'?today:undefined}
                      onChange={e=>setEditSeance({...editSeance,[k]:e.target.value})} />
                  </div>
                ))}
                {[['id_sport','Sport',sports.map(s=>({v:s.id_sport,l:s.nom_sport}))],
                  ['id_coach','Coach',coachs.map(c=>({v:c.id_coach,l:`${c.nom} ${c.prenom}`}))],
                  ['niveau','Niveau',[{v:'Débutant',l:'Débutant'},{v:'Intermédiaire',l:'Intermédiaire'},{v:'Avancé',l:'Avancé'}]],
                  ['public_cible','Public',[{v:'Mixte',l:'Mixte'},{v:'Femmes',l:'Femmes'},{v:'Hommes',l:'Hommes'},{v:'Enfants',l:'Enfants'}]],
                ].map(([k,l,opts]) => (
                  <div key={k} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <label style={{ color:'#94a3b8', fontSize:13, fontWeight:500 }}>{l}</label>
                    <select style={inputStyle} value={editSeance[k]||''} onChange={e=>setEditSeance({...editSeance,[k]:e.target.value})}>
                      {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:20 }}>
                <button type="button" style={{ padding:'10px 20px', background:'#232938', border:'1px solid #2d3448', borderRadius:8, color:'#94a3b8', fontSize:14, cursor:'pointer' }} onClick={()=>setEditSeance(null)}>Annuler</button>
                <button type="submit" style={{ padding:'10px 28px', background:'#7c3aed', border:'none', borderRadius:8, color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                  <Icon d={IC.save} size={14} color="#fff" /> Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:700, color:'#e2e8f0', margin:0, display:'flex', alignItems:'center', gap:10 }}>
          <Icon d={IC.calendar} size={24} color="#8b5cf6" /> Gestion des Séances
        </h1>
        <button style={{ padding:'9px 20px', fontSize:13, background:'#7c3aed', border:'none', borderRadius:8, color:'#fff', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}
          onClick={() => { setShowForm(f=>!f); if(showForm) setFormData(EMPTY_FORM); }}>
          <Icon d={showForm?IC.close:IC.plus} size={14} color="#fff" />
          {showForm ? 'Fermer le formulaire' : 'Nouvelle séance'}
        </button>
      </div>

      {showForm && (
        <div style={{ background:'#1a1f2e', borderRadius:12, marginBottom:24, overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', background:'#161b27', borderTop:'4px solid #8b5cf6' }}>
            <h5 style={{ margin:0, color:'#e2e8f0', fontSize:15, fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
              <Icon d={IC.plus} size={16} color="#8b5cf6" /> Ajouter une nouvelle séance
            </h5>
          </div>
          <div style={{ padding:'20px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'20px 14px' }}>
                {[['nom','Nom de la séance','text','Nom de la séance',true],
                  ['jour','Date','date','',true],['debut','Heure début','time','',true],
                  ['fin','Heure fin','time','',true],['capaciteMax','Capacité max','number','Capacité',true],
                ].map(([id,lbl,type,ph,req]) => (
                  <div key={id} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <label style={{ color:'#94a3b8', fontSize:13, fontWeight:500 }}>{lbl}</label>
                    <input id={id} type={type} value={formData[id]} onChange={handleChange}
                      style={inputStyle} placeholder={ph} required={req} min={id==='jour'?today:undefined} />
                  </div>
                ))}
                {[['sport','Sport',sports.map(s=>({v:s.id_sport,l:s.nom_sport})),'Choisir un sport',true],
                  ['coach','Coach',coachs.map(c=>({v:c.id_coach,l:`${c.nom} ${c.prenom} — ${c.specialite}`})),'Choisir un coach',true],
                  ['niveau','Niveau',[{v:'Débutant',l:'Débutant'},{v:'Intermédiaire',l:'Intermédiaire'},{v:'Avancé',l:'Avancé'}],'',false],
                  ['public_cible','Public cible',[{v:'Mixte',l:'Mixte'},{v:'Femmes',l:'Femmes'},{v:'Hommes',l:'Hommes'},{v:'Enfants',l:'Enfants'}],'',false],
                ].map(([id,lbl,opts,ph,req]) => (
                  <div key={id} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <label style={{ color:'#94a3b8', fontSize:13, fontWeight:500 }}>{lbl}</label>
                    <select id={id} value={formData[id]} onChange={handleChange} style={inputStyle} required={req}>
                      {ph && <option value="">-- {ph} --</option>}
                      {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:20, display:'flex', gap:10, justifyContent:'flex-end' }}>
                <button type="button" style={{ padding:'10px 20px', background:'#232938', border:'1px solid #2d3448', borderRadius:8, color:'#94a3b8', fontSize:14, cursor:'pointer' }} onClick={()=>setFormData(EMPTY_FORM)}>Annuler</button>
                <button type="submit" style={{ padding:'10px 28px', background:'#7c3aed', border:'none', borderRadius:8, color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                  <Icon d={IC.plus} size={14} color="#fff" /> Ajouter la Séance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:'#232938' }}>
              {['Nom','Sport','Coach','Jour','Heure','Niveau','Public','Places','Actions'].map(h => (
                <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontWeight:600, color:'#64748b', fontSize:12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {seances.length === 0 ? (
              <tr><td colSpan="9" style={{ padding:'24px', textAlign:'center', color:'#64748b' }}>Aucune séance enregistrée</td></tr>
            ) : seances.map((s, i) => {
              const nc = niveauColor(s.niveau);
              const pc = publicColor(s.public_cible);
              return (
                <tr key={s.id} style={{ background:i%2===0?'#1a1f2e':'#1e2537' }}>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}><strong style={{ color:'#e2e8f0' }}>{s.nom||"—"}</strong></td>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}>
                    <span style={{ background:'#2d1f5e', color:'#a78bfa', padding:'3px 10px', borderRadius:10, fontSize:11, fontWeight:600 }}>{s.nom_sport||"—"}</span>
                  </td>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}>{s.nom_coach||"—"}</td>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}>{s.jour}</td>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}>{s.debut} - {s.fin}</td>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}>
                    <span style={{ background:nc.bg, color:nc.color, padding:'3px 10px', borderRadius:10, fontSize:11, fontWeight:600 }}>{s.niveau}</span>
                  </td>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}>
                    <span style={{ background:pc.bg, color:pc.color, padding:'3px 10px', borderRadius:10, fontSize:11, fontWeight:600 }}>{s.public_cible}</span>
                  </td>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}>{s.placesOccupees}/{s.capaciteMax}</td>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button style={{ padding:'4px 12px', background:'#1f2d1f', border:'1px solid #16a34a', borderRadius:6, color:'#4ade80', fontSize:12, cursor:'pointer', fontWeight:500, display:'flex', alignItems:'center', gap:4 }} onClick={()=>setEditSeance(s)}>
                        <Icon d={IC.edit} size={12} color="#4ade80" /> Modifier
                      </button>
                      <button style={{ padding:'4px 12px', background:'#3b1f1f', border:'1px solid #ef4444', borderRadius:6, color:'#f87171', fontSize:12, cursor:'pointer', fontWeight:500, display:'flex', alignItems:'center', gap:4 }} onClick={()=>supprimer(s.id)}>
                        <Icon d={IC.trash} size={12} color="#f87171" /> Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Seance;