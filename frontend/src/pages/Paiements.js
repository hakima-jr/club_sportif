// src/pages/Paiements.js
import React, { useState, useEffect, useRef } from 'react';
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
  payment: ['M1 10h22','M2 5h20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z'],
  plus:    ['M12 5v14','M5 12h14'],
  close:   ['M18 6L6 18','M6 6l12 12'],
  search:  ['M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12z','M21 21l-4.35-4.35'],
  edit:    ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  trash:   ['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'],
  check:   'M20 6L9 17l-5-5',
  warning: ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  money:   ['M12 1v22','M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
  clock:   ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 6v6l4 2'],
};

function Paiements() {
  const user    = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';
  const canEdit = user.role === 'admin' || user.role === 'reception';
  const today   = new Date().toISOString().split('T')[0];

  const EMPTY_FORM = { montant:'', date_paiement:today, mode_paiement:'Espèces', statut:'Payé', id_abonnement:'' };

  const [paiements,      setPaiements]      = useState([]);
  const [membres,        setMembres]        = useState([]);
  const [abonnements,    setAbonnements]    = useState([]);
  const [selectedMembre, setSelectedMembre] = useState('');
  const [memberSearch,   setMemberSearch]   = useState('');
  const [showDropdown,   setShowDropdown]   = useState(false);
  const [filterMembre,   setFilterMembre]   = useState('');
  const [filterStatut,   setFilterStatut]   = useState('');
  const [loading,        setLoading]        = useState(true);
  const [saving,         setSaving]         = useState(false);
  const [showForm,       setShowForm]       = useState(false);
  const [message,        setMessage]        = useState({ text:'', type:'' });
  const [editPaiement,   setEditPaiement]   = useState(null);
  const [formData,       setFormData]       = useState({ ...EMPTY_FORM });
  const dropRef = useRef();

  const notify = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text:'', type:'' }), 3000);
  };

  const loadData = async () => {
    try {
      const [m, p] = await Promise.all([axios.get(`${API}/membres`), axios.get(`${API}/paiements`)]);
      setMembres(m.data || []);
      setPaiements(p.data || []);
    } catch { notify('Erreur chargement', 'error'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => {
    if (selectedMembre) {
      axios.get(`${API}/abonnements-par-membre/${selectedMembre}`)
        .then(res => setAbonnements(res.data || [])).catch(console.error);
    } else { setAbonnements([]); }
  }, [selectedMembre]);

  const resetForm = () => { setFormData({ ...EMPTY_FORM }); setSelectedMembre(''); setMemberSearch(''); setAbonnements([]); setShowDropdown(false); };
  const handleCancel = () => { resetForm(); setShowForm(false); };
  const selectMembre = (m) => { setSelectedMembre(m.id_personne); setMemberSearch(`${m.nom} ${m.prenom}`); setShowDropdown(false); setFormData(prev => ({ ...prev, id_abonnement:'', montant:'' })); };
  const filteredMembres = membres.filter(m => `${m.nom} ${m.prenom}`.toLowerCase().includes(memberSearch.toLowerCase()));
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleAbonnementChange = (e) => {
    const idAbo = e.target.value;
    const abo = abonnements.find(a => a.id_abonnement === parseInt(idAbo));
    setFormData(prev => ({ ...prev, id_abonnement:idAbo, montant:abo ? abo.prix : prev.montant }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await axios.post(`${API}/paiements`, formData); notify('Paiement enregistré'); resetForm(); loadData(); }
    catch { notify('Erreur enregistrement', 'error'); }
    finally { setSaving(false); }
  };
  const handleMarkPaye = async (id) => {
    try { await axios.put(`${API}/paiements/${id}`); notify('Paiement validé'); loadData(); }
    catch { notify('Erreur validation', 'error'); }
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try { await axios.put(`${API}/paiements/update/${editPaiement.id_paiement}`, editPaiement); notify('Paiement modifié'); setEditPaiement(null); loadData(); }
    catch { notify('Erreur modification', 'error'); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce paiement ?')) return;
    try { await axios.delete(`${API}/paiements/${id}`); notify('Paiement supprimé'); loadData(); }
    catch { notify('Erreur suppression', 'error'); }
  };

  const totalPaye    = paiements.filter(p => p.statut==='Payé').reduce((s,p)=>s+Number(p.montant),0);
  const totalAttente = paiements.filter(p => p.statut==='En attente').reduce((s,p)=>s+Number(p.montant),0);
  const filtered = paiements.filter(p => {
    const matchM = filterMembre ? p.nom_membre?.toLowerCase().includes(filterMembre.toLowerCase()) : true;
    const matchS = filterStatut ? p.statut === filterStatut : true;
    return matchM && matchS;
  });

  if (loading) return <div style={{ textAlign:'center', marginTop:60, color:'#94a3b8', fontFamily:'Segoe UI, sans-serif' }}>Chargement...</div>;

  const inputStyle = { padding:'9px 14px', background:'#232938', border:'1px solid #2d3448', borderRadius:8, color:'#e2e8f0', fontSize:14, outline:'none', width:'100%', boxSizing:'border-box', fontFamily:'Segoe UI, sans-serif' };
  const labelStyle = { color:'#94a3b8', fontSize:13, fontWeight:500 };

  return (
    <div style={{ padding:'32px 24px', maxWidth:1300, margin:'0 auto', fontFamily:'Segoe UI, sans-serif', background:'#0f1117', minHeight:'100vh' }}>

      {message.text && (
        <div style={{ padding:'10px 16px', borderRadius:8, border:'1px solid', marginBottom:16, fontSize:14,
          background:message.type==='error'?'#3b1f1f':'#1a3b2a',
          borderColor:message.type==='error'?'#ef4444':'#16a34a',
          color:message.type==='error'?'#f87171':'#4ade80',
          display:'flex', alignItems:'center', gap:8 }}>
          <Icon d={message.type==='error'?IC.warning:IC.check} size={14} color={message.type==='error'?'#f87171':'#4ade80'} /> {message.text}
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <h2 style={{ fontSize:24, fontWeight:700, color:'#e2e8f0', margin:0, display:'flex', alignItems:'center', gap:10 }}>
          <Icon d={IC.payment} size={24} color="#6366f1" /> Gestion des Paiements
        </h2>
        {canEdit && (
          <button style={{ padding:'10px 22px', background:'linear-gradient(135deg,#4338ca,#6366f1)', border:'none', borderRadius:10, color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}
            onClick={() => { if(showForm){handleCancel();}else{resetForm();setShowForm(true);} }}>
            <Icon d={showForm?IC.close:IC.plus} size={16} color="#fff" />
            {showForm ? 'Fermer' : 'Nouveau paiement'}
          </button>
        )}
      </div>

      {isAdmin && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
          {[
            { label:'Total Récupéré', value:`${totalPaye.toFixed(2)} MAD`, color:'#4ade80', border:'#16a34a', icon:IC.money },
            { label:'En Attente',     value:`${totalAttente.toFixed(2)} MAD`, color:'#fb923c', border:'#ea580c', icon:IC.clock },
          ].map(s => (
            <div key={s.label} style={{ background:'#1a1f2e', borderRadius:12, padding:'20px 18px', borderTop:`4px solid ${s.border}` }}>
              <div style={{ color:'#64748b', fontSize:13, marginBottom:6, display:'flex', alignItems:'center', gap:6 }}>
                <Icon d={s.icon} size={14} color="#64748b" /> {s.label}
              </div>
              <div style={{ fontSize:24, fontWeight:700, color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
        <input type="text" style={inputStyle} placeholder="Chercher par nom..."
          value={filterMembre} onChange={e=>setFilterMembre(e.target.value)} />
        <select style={inputStyle} value={filterStatut} onChange={e=>setFilterStatut(e.target.value)}>
          <option value="">Tous les statuts</option>
          <option value="Payé">Payé</option>
          <option value="En attente">En attente</option>
        </select>
      </div>

      {canEdit && showForm && (
        <div style={{ background:'#1a1f2e', borderRadius:12, marginBottom:24, overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', background:'#161b27', borderTop:'4px solid #6366f1' }}>
            <h5 style={{ margin:0, color:'#e2e8f0', fontSize:15, fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
              <Icon d={IC.plus} size={16} color="#6366f1" /> Nouvelle Transaction
            </h5>
          </div>
          <div style={{ padding:'20px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
                {/* Membre */}
                <div style={{ display:'flex', flexDirection:'column', gap:6, position:'relative' }} ref={dropRef}>
                  <label style={labelStyle}>Membre *</label>
                  <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
                    <span style={{ position:'absolute', left:10 }}><Icon d={IC.search} size={13} color="#64748b" /></span>
                    <input style={{ ...inputStyle, paddingLeft:32 }} placeholder="Taper le nom..."
                      value={memberSearch}
                      onChange={e=>{ setMemberSearch(e.target.value); setShowDropdown(true); setSelectedMembre(''); setFormData(prev=>({...prev,id_abonnement:'',montant:''})); }}
                      onFocus={()=>setShowDropdown(true)} />
                    {memberSearch && <button type="button" style={{ position:'absolute', right:10, background:'none', border:'none', color:'#64748b', cursor:'pointer' }}
                      onClick={()=>{ setMemberSearch(''); setSelectedMembre(''); setAbonnements([]); setFormData(prev=>({...prev,id_abonnement:'',montant:''})); }}>
                      <Icon d={IC.close} size={12} color="#64748b" /></button>}
                  </div>
                  {showDropdown && memberSearch && (
                    <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#1a1f2e', border:'1px solid #2d3448', borderRadius:10, zIndex:100, maxHeight:220, overflowY:'auto', marginTop:4, boxShadow:'0 8px 32px rgba(0,0,0,.4)' }}>
                      {filteredMembres.length === 0 ? <div style={{ padding:'14px', color:'#64748b', textAlign:'center', fontSize:13 }}>Aucun membre trouvé</div>
                        : filteredMembres.slice(0,8).map(m => (
                          <div key={m.id_personne} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', cursor:'pointer', transition:'background .1s' }}
                            onClick={()=>selectMembre(m)}
                            onMouseEnter={e=>e.currentTarget.style.background='#2d3448'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#4338ca,#6366f1)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0 }}>
                              {m.prenom?.[0]}{m.nom?.[0]}
                            </div>
                            <div>
                              <div style={{ color:'#e2e8f0', fontSize:13, fontWeight:600 }}>{m.nom} {m.prenom}</div>
                              <div style={{ color:'#64748b', fontSize:11 }}>{m.email}</div>
                            </div>
                            {selectedMembre === m.id_personne && <Icon d={IC.check} size={14} color="#4ade80" />}
                          </div>
                        ))
                      }
                    </div>
                  )}
                  {selectedMembre && <div style={{ marginTop:6, padding:'6px 12px', background:'#14532d20', border:'1px solid #16a34a40', borderRadius:8, color:'#94a3b8', fontSize:12, display:'flex', alignItems:'center', gap:4 }}>
                    <Icon d={IC.check} size={12} color="#4ade80" /> <strong style={{ color:'#4ade80' }}>{memberSearch}</strong>
                  </div>}
                </div>
                {/* Abonnement */}
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <label style={labelStyle}>Abonnement *</label>
                  <select style={{ ...inputStyle, opacity:!selectedMembre?0.5:1 }} name="id_abonnement"
                    value={formData.id_abonnement} onChange={handleAbonnementChange} required disabled={!selectedMembre}>
                    <option value="">-- Choisir --</option>
                    {abonnements.map(a => <option key={a.id_abonnement} value={a.id_abonnement}>{a.type} ({a.prix} MAD)</option>)}
                  </select>
                </div>
                {/* Montant */}
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <label style={labelStyle}>Montant (MAD) *</label>
                  <input type="number" name="montant" style={inputStyle} value={formData.montant} onChange={handleChange} required />
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14, marginTop:14, alignItems:'flex-end' }}>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <label style={labelStyle}>Mode *</label>
                  <select name="mode_paiement" style={inputStyle} value={formData.mode_paiement} onChange={handleChange}>
                    <option>Espèces</option><option>Carte</option><option>Virement</option>
                  </select>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <label style={labelStyle}>Statut *</label>
                  <select name="statut" style={inputStyle} value={formData.statut} onChange={handleChange}>
                    <option value="Payé">Payé</option><option value="En attente">En attente</option>
                  </select>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <label style={labelStyle}>Date *</label>
                  <input type="date" name="date_paiement" style={inputStyle} value={formData.date_paiement} onChange={handleChange} min={today} required />
                </div>
              </div>
              <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                <button type="button" style={{ padding:'10px 20px', background:'#232938', border:'1px solid #2d3448', borderRadius:10, color:'#94a3b8', fontSize:14, cursor:'pointer' }} onClick={resetForm}>Annuler</button>
                <button type="submit" style={{ padding:'11px 24px', background:'#6366f1', border:'none', borderRadius:8, color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', opacity:(saving||!selectedMembre)?0.7:1, display:'flex', alignItems:'center', gap:6 }} disabled={saving||!selectedMembre}>
                  <Icon d={IC.check} size={14} color="#fff" /> {saving?'Enregistrement…':'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editPaiement && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', backdropFilter:'blur(4px)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={()=>setEditPaiement(null)}>
          <div style={{ background:'#1a1f2e', border:'1px solid #2d3448', borderRadius:20, padding:32, width:'100%', maxWidth:500 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h3 style={{ color:'#f1f5f9', fontSize:18, fontWeight:700, margin:0, display:'flex', alignItems:'center', gap:8 }}>
                <Icon d={IC.edit} size={18} color="#6366f1" /> Modifier le paiement
              </h3>
              <button style={{ background:'#232938', border:'1px solid #2d3448', borderRadius:8, color:'#94a3b8', width:32, height:32, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }} onClick={()=>setEditPaiement(null)}>
                <Icon d={IC.close} size={16} color="#94a3b8" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                {[['montant','Montant (MAD)','number'],['date_paiement','Date','date']].map(([k,l,t]) => (
                  <div key={k} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <label style={labelStyle}>{l}</label>
                    <input type={t} style={inputStyle} value={k==='date_paiement'?(editPaiement[k]?.slice(0,10)||''):(editPaiement[k]||'')}
                      min={k==='date_paiement'?today:undefined}
                      onChange={e=>setEditPaiement({...editPaiement,[k]:e.target.value})} required />
                  </div>
                ))}
                {[['mode_paiement','Mode',['Espèces','Carte','Virement']],['statut','Statut',['Payé','En attente']]].map(([k,l,opts]) => (
                  <div key={k} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <label style={labelStyle}>{l}</label>
                    <select style={inputStyle} value={editPaiement[k]||''} onChange={e=>setEditPaiement({...editPaiement,[k]:e.target.value})}>
                      {opts.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:20 }}>
                <button type="button" style={{ padding:'10px 20px', background:'#232938', border:'1px solid #2d3448', borderRadius:10, color:'#94a3b8', fontSize:14, cursor:'pointer' }} onClick={()=>setEditPaiement(null)}>Annuler</button>
                <button type="submit" style={{ padding:'10px 24px', background:'linear-gradient(135deg,#15803d,#16a34a)', border:'none', borderRadius:10, color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                  <Icon d={IC.check} size={14} color="#fff" /> Enregistrer
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
              {['Date','Membre','Abonnement','Montant','Mode','Statut',...(canEdit?['Valider','Modifier','Supprimer']:[])].map(h=>
                <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontWeight:600, color:'#64748b', fontSize:12 }}>{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="9" style={{ padding:'24px', textAlign:'center', color:'#64748b' }}>Aucun paiement trouvé</td></tr>
            ) : filtered.map((p, i) => (
              <tr key={p.id_paiement} style={{ background:i%2===0?'#1a1f2e':'#1e2537' }}>
                <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}>{p.date_paiement?.slice(0,10)}</td>
                <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}><strong style={{ color:'#e2e8f0' }}>{p.nom_membre}</strong></td>
                <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}>{p.type_abonnement||'—'}</td>
                <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}><strong style={{ color:'#4ade80' }}>{p.montant} MAD</strong></td>
                <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}>{p.mode_paiement}</td>
                <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' }}>
                  <span style={{ background:p.statut==='Payé'?'#14532d':'#431407', color:p.statut==='Payé'?'#4ade80':'#fb923c', padding:'3px 10px', borderRadius:10, fontSize:11, fontWeight:600 }}>{p.statut}</span>
                </td>
                {canEdit && <>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435' }}>
                    {p.statut==='En attente' && (
                      <button style={{ padding:'5px 12px', background:'#14532d', border:'1px solid #16a34a', borderRadius:6, color:'#4ade80', fontSize:12, cursor:'pointer', fontWeight:500, display:'flex', alignItems:'center', gap:4 }}
                        onClick={()=>handleMarkPaye(p.id_paiement)}>
                        <Icon d={IC.check} size={12} color="#4ade80" /> Valider
                      </button>
                    )}
                  </td>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435' }}>
                    <button style={{ padding:'5px 12px', background:'#1f2d1f', border:'1px solid #16a34a', borderRadius:6, color:'#4ade80', fontSize:12, cursor:'pointer', fontWeight:500, display:'flex', alignItems:'center', gap:4 }}
                      onClick={()=>{ setEditPaiement(p); setShowForm(false); }}>
                      <Icon d={IC.edit} size={12} color="#4ade80" /> Modifier
                    </button>
                  </td>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #1e2435' }}>
                    <button style={{ padding:'5px 12px', background:'#3b1f1f', border:'1px solid #ef4444', borderRadius:6, color:'#f87171', fontSize:12, cursor:'pointer', fontWeight:500, display:'flex', alignItems:'center', gap:4 }}
                      onClick={()=>handleDelete(p.id_paiement)}>
                      <Icon d={IC.trash} size={12} color="#f87171" /> Supprimer
                    </button>
                  </td>
                </>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Paiements;