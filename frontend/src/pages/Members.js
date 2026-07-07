// src/pages/Members.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMembers, updateMember, deleteMember } from '../api/api';
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
  users:   ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  user:    ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  edit:    ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  trash:   ['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'],
  plus:    ['M12 5v14','M5 12h14'],
  search:  ['M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12z','M21 21l-4.35-4.35'],
  close:   ['M18 6L6 18','M6 6l12 12'],
  check:   'M20 6L9 17l-5-5',
  export:  ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M7 10l5 5 5-5','M12 15V3'],
  warning: ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
};

const EMPTY_FORM = () => ({
  nom:'', prenom:'', email:'', telephone:'', date_naissance:'', adresse:'', sexe:'',
  date_inscription: new Date().toISOString().split('T')[0],
  poids:'', taille:'', objectif:'', notes:'',
});

function Members() {
  const [members,    setMembers]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [search,     setSearch]     = useState('');
  const [showForm,   setShowForm]   = useState(false);
  const [formKey,    setFormKey]    = useState(0);
  const [editMember, setEditMember] = useState(null);
  const [editKey,    setEditKey]    = useState(0);
  const [toast,      setToast]      = useState({ text:'', type:'' });
  const [formData,   setFormData]   = useState(EMPTY_FORM());
  const [adding,     setAdding]     = useState(false);

  const notify = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast({ text:'', type:'' }), 3000);
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await getMembers();
      setMembers(res.data || []);
    } catch { setError('Erreur lors du chargement des membres'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await axios.post(`${API}/membres`, formData);
      notify('Membre ajouté avec succès');
      handleClose();
      fetchMembers();
    } catch { notify("Erreur lors de l'ajout", 'error'); }
    finally  { setAdding(false); }
  };

  const handleCancel = () => { setFormData(EMPTY_FORM()); setFormKey(k => k+1); };
  const handleClose  = () => { setFormData(EMPTY_FORM()); setFormKey(k => k+1); setShowForm(false); };

  const handleDelete = async (id, nom) => {
    if (!window.confirm(`Supprimer le membre "${nom}" ?`)) return;
    try { await deleteMember(id); notify('Membre supprimé'); fetchMembers(); }
    catch { notify('Erreur lors de la suppression', 'error'); }
  };

  const handleExportExcel = () => {
    const dataToExport = filtered.length > 0 ? filtered : members;
    if (dataToExport.length === 0) { notify('Aucun membre à exporter', 'error'); return; }
    const headers = ['ID','Nom','Prenom','Sexe','Date_Naissance','Email','Telephone','Adresse','Date_Inscription','Poids','Taille','Objectif'];
    const rows = dataToExport.map(m => [m.id_personne||'',m.nom||'',m.prenom||'',m.sexe||'',
      m.date_naissance?new Date(m.date_naissance).toLocaleDateString('fr-FR'):'',m.email||'',
      m.telephone||'',m.adresse||'',m.date_inscription?new Date(m.date_inscription).toLocaleDateString('fr-FR'):'',
      m.poids||'',m.taille||'',m.objectif||'']);
    let csv = '\uFEFF' + headers.join(';') + '\r\n';
    rows.forEach(row => { csv += row.map(c=>{ const v=String(c||''); return (v.includes(';')||v.includes('"'))?'"'+v.replace(/"/g,'""')+'"':v; }).join(';') + '\r\n'; });
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `membres_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    notify(`${dataToExport.length} membre(s) exporté(s)`);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...editMember };
      if (!data.telephone?.trim()) delete data.telephone;
      if (!data.adresse?.trim()) delete data.adresse;
      await updateMember(editMember.id_personne, data);
      notify('Membre modifié avec succès');
      setEditMember(null); setEditKey(k => k+1); fetchMembers();
    } catch { notify('Erreur lors de la modification', 'error'); }
  };

  const openEdit = (m) => { setShowForm(false); setFormData(EMPTY_FORM()); setFormKey(k=>k+1); setEditMember({...m}); setEditKey(k=>k+1); };
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';
  const filtered = members.filter(m => `${m.nom} ${m.prenom} ${m.email}`.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div style={S.center}>Chargement...</div>;
  if (error)   return <div style={{...S.center, color:'#f87171'}}>{error}</div>;

  const inputStyle = { padding:'11px 14px', background:'#232938', border:'1px solid #2d3448', borderRadius:10, color:'#e2e8f0', fontSize:14, outline:'none', width:'100%', boxSizing:'border-box' };
  const labelStyle = { color:'#94a3b8', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:0.5 };
  const fieldStyle = { display:'flex', flexDirection:'column', gap:6 };

  return (
    <div style={S.page}>
      {toast.text && (
        <div style={{ ...S.toast, background:toast.type==='error'?'#3b1f1f':'#14532d', borderColor:toast.type==='error'?'#ef4444':'#16a34a', color:toast.type==='error'?'#f87171':'#4ade80' }}>
          <Icon d={toast.type==='error'?IC.warning:IC.check} size={16} color={toast.type==='error'?'#f87171':'#4ade80'} />
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>
            <Icon d={IC.users} size={26} color="#6366f1" /> Gestion des Membres
          </h1>
          <p style={S.subtitle}>{members.length} membre(s) enregistré(s)</p>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <button style={S.btnExport} onClick={handleExportExcel}>
            <Icon d={IC.export} size={16} color="#fff" /> Exporter Excel
          </button>
          <button style={S.btnPrimary} onClick={() => { if(showForm){handleClose();}else{setFormData(EMPTY_FORM());setFormKey(k=>k+1);setEditMember(null);setShowForm(true);} }}>
            <Icon d={showForm?IC.close:IC.plus} size={16} color="#fff" />
            {showForm ? 'Fermer' : 'Nouveau membre'}
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div style={S.card}>
          <h2 style={S.cardTitle}><Icon d={IC.plus} size={18} color="#6366f1" /> Ajouter un membre</h2>
          <form key={formKey} onSubmit={handleAddSubmit}>
            <div style={S.formGrid}>
              {[['nom','Nom *','text','Nom',true],['prenom','Prénom *','text','Prénom',true],
                ['email','Email *','email','email',true],['telephone','Téléphone','text','telephone',false],
                ['date_naissance','Date de naissance','date','',false],['adresse','Adresse','text','adresse',false],
                ['date_inscription',"Date d'inscription *",'date','',true],
                ['poids','Poids (kg)','number','poids',false],['taille','Taille (cm)','number','taille',false],
              ].map(([key, lbl, type, ph, req]) => (
                <div key={key} style={fieldStyle}>
                  <label style={labelStyle}>{lbl}</label>
                  <input type={type} style={inputStyle} placeholder={ph} value={formData[key]} required={req}
                    onChange={e => setFormData({...formData, [key]:e.target.value})} />
                </div>
              ))}
              <div style={fieldStyle}>
                <label style={labelStyle}>Sexe</label>
                <select style={inputStyle} value={formData.sexe} onChange={e=>setFormData({...formData,sexe:e.target.value})}>
                  <option value="">-- Sélectionner --</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Objectif</label>
                <select style={inputStyle} value={formData.objectif} onChange={e=>setFormData({...formData,objectif:e.target.value})}>
                  <option value="">-- Sélectionner --</option>
                  <option value="Perte de poids">Perte de poids</option>
                  <option value="Prise de masse">Prise de masse</option>
                  <option value="Maintien">Maintien</option>
                  <option value="Performance">Performance</option>
                </select>
              </div>
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:24 }}>
              <button type="button" style={S.btnCancel} onClick={handleCancel}>Annuler</button>
              <button type="submit" style={S.btnSave} disabled={adding}>
                <Icon d={IC.check} size={16} color="#fff" /> {adding?'Ajout...':'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editMember && (
        <div style={S.overlay} onClick={() => setEditMember(null)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={S.modalHeader}>
              <h3 style={S.modalTitle}><Icon d={IC.edit} size={18} color="#6366f1" /> Modifier le membre</h3>
              <button style={S.closeBtn} onClick={()=>setEditMember(null)}><Icon d={IC.close} size={16} color="#94a3b8" /></button>
            </div>
            <form key={editKey} onSubmit={handleEditSubmit}>
              <div style={S.formGrid}>
                {[['nom','Nom','text',true],['prenom','Prénom','text',true],['email','Email','email',true],
                  ['telephone','Téléphone','text',false],['adresse','Adresse','text',false],
                  ['date_inscription','Date inscription','date',false],
                  ['poids','Poids (kg)','number',false],['taille','Taille (cm)','number',false],
                ].map(([key, lbl, type, req]) => (
                  <div key={key} style={fieldStyle}>
                    <label style={labelStyle}>{lbl}</label>
                    <input type={type} style={inputStyle} required={req}
                      value={key==='date_inscription'||key==='date_naissance'?(editMember[key]?.slice(0,10)||''):(editMember[key]||'')}
                      onChange={e=>setEditMember({...editMember,[key]:e.target.value})} />
                  </div>
                ))}
                <div style={fieldStyle}>
                  <label style={labelStyle}>Sexe</label>
                  <select style={inputStyle} value={editMember.sexe||''} onChange={e=>setEditMember({...editMember,sexe:e.target.value})}>
                    <option value="">-- Sélectionner --</option>
                    <option value="Homme">Homme</option><option value="Femme">Femme</option>
                  </select>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Objectif</label>
                  <select style={inputStyle} value={editMember.objectif||''} onChange={e=>setEditMember({...editMember,objectif:e.target.value})}>
                    <option value="">-- Sélectionner --</option>
                    <option value="Perte de poids">Perte de poids</option>
                    <option value="Prise de masse">Prise de masse</option>
                    <option value="Maintien">Maintien</option>
                    <option value="Performance">Performance</option>
                  </select>
                </div>
              </div>
              <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:24 }}>
                <button type="button" style={S.btnCancel} onClick={()=>setEditMember(null)}>Annuler</button>
                <button type="submit" style={S.btnSave}><Icon d={IC.check} size={16} color="#fff" /> Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ position:'relative', marginBottom:8 }}>
        <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }}>
          <Icon d={IC.search} size={15} color="#64748b" />
        </span>
        <input type="text" style={{ ...inputStyle, paddingLeft:40, background:'#1a1f2e', border:'1px solid #2d3448', borderRadius:12, width:'100%', boxSizing:'border-box' }}
          placeholder="Rechercher par nom, prénom ou email..." value={search} onChange={e=>setSearch(e.target.value)} />
        {search && <button style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:16 }} onClick={()=>setSearch('')}>
          <Icon d={IC.close} size={14} color="#64748b" />
        </button>}
      </div>

      <p style={S.count}>{filtered.length} résultat(s)</p>

      {filtered.length === 0 ? (
        <div style={S.empty}><Icon d={IC.search} size={36} color="#64748b" /><p style={{ color:'#64748b', margin:'8px 0 0' }}>Aucun membre trouvé</p></div>
      ) : (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr style={S.thead}>
                {['Nom','Prénom','Sexe','Naissance','Email','Téléphone','Inscription','Poids','Taille','Actions'].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.id_personne} style={{ background: i%2===0?'transparent':'#1e2537' }}>
                  <td style={S.td}><strong style={{ color:'#e2e8f0' }}>{m.nom}</strong></td>
                  <td style={S.td}>{m.prenom}</td>
                  <td style={S.td}>{m.sexe||'—'}</td>
                  <td style={S.td}>{formatDate(m.date_naissance)}</td>
                  <td style={S.td}>{m.email}</td>
                  <td style={S.td}>{m.telephone||'—'}</td>
                  <td style={S.td}>{formatDate(m.date_inscription)}</td>
                  <td style={S.td}>{m.poids?`${m.poids} kg`:'—'}</td>
                  <td style={S.td}>{m.taille?`${m.taille} cm`:'—'}</td>
                  <td style={S.td}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <Link to={`/membres/${m.id_personne}`} style={S.viewBtn}
                        onMouseEnter={e=>{e.currentTarget.style.background='#2563eb';e.currentTarget.style.transform='translateY(-2px)';}}
                        onMouseLeave={e=>{e.currentTarget.style.background='#1e3a5f';e.currentTarget.style.transform='none';}}>
                        <Icon d={IC.user} size={11} color="#60a5fa" /> Profil
                      </Link>
                      <button onClick={()=>openEdit(m)} style={S.editBtn}
                        onMouseEnter={e=>{e.currentTarget.style.background='#16a34a';e.currentTarget.style.transform='translateY(-2px)';}}
                        onMouseLeave={e=>{e.currentTarget.style.background='#1f2d1f';e.currentTarget.style.transform='none';}}>
                        <Icon d={IC.edit} size={11} color="#4ade80" /> Modifier
                      </button>
                      <button onClick={()=>handleDelete(m.id_personne,`${m.nom} ${m.prenom}`)} style={S.deleteBtn}
                        onMouseEnter={e=>{e.currentTarget.style.background='#ef4444';e.currentTarget.style.transform='translateY(-2px)';}}
                        onMouseLeave={e=>{e.currentTarget.style.background='#3b1f1f';e.currentTarget.style.transform='none';}}>
                        <Icon d={IC.trash} size={13} color="#f87171" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const S = {
  page:      { padding:'32px 40px', fontFamily:'Segoe UI, sans-serif', maxWidth:1400, margin:'0 auto' },
  center:    { padding:60, textAlign:'center', color:'#94a3b8', fontFamily:'Segoe UI, sans-serif' },
  toast:     { position:'fixed', top:20, right:20, padding:'12px 20px', borderRadius:10, border:'1px solid', fontWeight:600, fontSize:14, zIndex:9999, display:'flex', alignItems:'center', gap:10 },
  header:    { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28, gap:20, flexWrap:'wrap' },
  title:     { fontSize:26, fontWeight:800, color:'#f1f5f9', margin:0, letterSpacing:'-0.5px', display:'flex', alignItems:'center', gap:10 },
  subtitle:  { color:'#64748b', marginTop:4, fontSize:13 },
  btnPrimary:{ padding:'11px 22px', background:'linear-gradient(135deg,#4338ca,#6366f1)', border:'none', borderRadius:12, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:8 },
  btnExport: { padding:'11px 22px', background:'linear-gradient(135deg,#059669,#10b981)', border:'none', borderRadius:12, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:8 },
  card:      { background:'#1a1f2e', borderRadius:18, padding:'28px 32px', marginBottom:24, border:'1px solid #2d3448', boxShadow:'0 10px 30px rgba(0,0,0,0.25)' },
  cardTitle: { fontSize:17, fontWeight:700, color:'#f1f5f9', marginTop:0, marginBottom:22, display:'flex', alignItems:'center', gap:8 },
  formGrid:  { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:16 },
  btnSave:   { padding:'10px 24px', background:'linear-gradient(135deg,#15803d,#16a34a)', border:'none', borderRadius:10, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:8 },
  btnCancel: { padding:'10px 20px', background:'#232938', border:'1px solid #2d3448', borderRadius:10, color:'#94a3b8', fontSize:14, cursor:'pointer' },
  overlay:   { position:'fixed', inset:0, background:'rgba(0,0,0,.7)', backdropFilter:'blur(4px)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:20 },
  modal:     { background:'#1a1f2e', border:'1px solid #2d3448', borderRadius:20, padding:32, width:'100%', maxWidth:700, maxHeight:'90vh', overflowY:'auto' },
  modalHeader:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 },
  modalTitle:{ color:'#f1f5f9', fontSize:18, fontWeight:700, margin:0, display:'flex', alignItems:'center', gap:8 },
  closeBtn:  { background:'#232938', border:'1px solid #2d3448', borderRadius:8, color:'#94a3b8', width:34, height:34, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' },
  count:     { color:'#64748b', fontSize:12, marginBottom:16 },
  empty:     { textAlign:'center', padding:'48px 0', background:'#1a1f2e', borderRadius:16, border:'1px solid #2d3448', display:'flex', flexDirection:'column', alignItems:'center', gap:8 },
  tableWrap: { background:'#1a1f2e', borderRadius:18, border:'1px solid #2d3448', overflowX:'auto' },
  table:     { width:'100%', borderCollapse:'collapse', fontSize:13, minWidth:950 },
  thead:     { background:'#232938' },
  th:        { padding:'14px 16px', textAlign:'left', fontWeight:700, color:'#64748b', fontSize:12, textTransform:'uppercase', letterSpacing:0.5, whiteSpace:'nowrap' },
  td:        { padding:'12px 16px', borderBottom:'1px solid #1e2435', color:'#cbd5e1' },
  viewBtn:   { display:'inline-flex', alignItems:'center', gap:4, padding:'6px 12px', background:'#1e3a5f', border:'1px solid #2563eb', borderRadius:8, color:'#60a5fa', fontSize:11, textDecoration:'none', fontWeight:700, whiteSpace:'nowrap', transition:'all 0.2s ease', cursor:'pointer' },
  editBtn:   { display:'inline-flex', alignItems:'center', gap:4, padding:'6px 12px', background:'#1f2d1f', border:'1px solid #16a34a', borderRadius:8, color:'#4ade80', fontSize:11, cursor:'pointer', fontWeight:700, whiteSpace:'nowrap', transition:'all 0.2s ease' },
  deleteBtn: { display:'inline-flex', alignItems:'center', padding:'6px 10px', background:'#3b1f1f', border:'1px solid #ef4444', borderRadius:8, color:'#f87171', fontSize:13, cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.2s ease' },
};

export default Members;