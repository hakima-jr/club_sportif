// src/pages/staff.js
import React, { useState, useEffect } from 'react';

function Icon({ d, size = 16, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}
const IC = {
  staff:   ['M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z','M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'],
  plus:    ['M12 5v14','M5 12h14'],
  close:   ['M18 6L6 18','M6 6l12 12'],
  edit:    ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  trash:   ['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'],
  check:   'M20 6L9 17l-5-5',
  search:  ['M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12z','M21 21l-4.35-4.35'],
  camera:  ['M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z','M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  phone:   'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.07 6.07l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  users:   ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  warning: ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
};

const roles = ['Réceptionniste','Agent de ménage','Nutritionniste','Responsable salle','Sécurité','Staff administratif'];
const initialStaff = [
  { id:1, nom:'Benali',  prenom:'Ahmed',   role:'Responsable salle', tel:'0611111111', email:'ahmed@mail.com',   sexe:'Homme', image:'' },
  { id:2, nom:'Amrani',  prenom:'Sara',    role:'Réceptionniste',    tel:'0622222222', email:'sara@mail.com',    sexe:'Femme', image:'' },
  { id:3, nom:'Tazi',    prenom:'Youssef', role:'Sécurité',          tel:'0633333333', email:'youssef@mail.com', sexe:'Homme', image:'' },
];
const emptyForm = { nom:'', prenom:'', role:'', tel:'', email:'', sexe:'', image:'' };

function Staff() {
  const [staff,    setStaff]    = useState(() => { try { const s = localStorage.getItem('gym_staff'); return s ? JSON.parse(s) : initialStaff; } catch { return initialStaff; } });
  const [search,   setSearch]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form,     setForm]     = useState({ ...emptyForm });
  const [errors,   setErrors]   = useState({});
  const [shake,    setShake]    = useState(false);

  useEffect(() => { localStorage.setItem('gym_staff', JSON.stringify(staff)); }, [staff]);

  const filtered = staff.filter(s => `${s.nom} ${s.prenom} ${s.role}`.toLowerCase().includes(search.toLowerCase()));

  const validate = () => {
    const e = {};
    if (!form.nom.trim())    e.nom    = 'Le nom est requis';
    if (!form.prenom.trim()) e.prenom = 'Le prénom est requis';
    if (!form.role)          e.role   = 'Veuillez choisir une fonction';
    if (!form.tel.trim())    e.tel    = 'Le téléphone est requis';
    else if (!/^[0-9\s+]{8,15}$/.test(form.tel.trim())) e.tel = 'Format invalide';
    if (!form.email.trim())  e.email  = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Email invalide';
    if (!form.sexe)          e.sexe   = 'Veuillez choisir le sexe';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addStaff    = () => { if (!validate()) { setShake(true); setTimeout(()=>setShake(false),500); return; } setStaff([...staff,{...form,id:Date.now()}]); setForm({...emptyForm}); setErrors({}); setShowForm(false); };
  const deleteStaff = (id) => { if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) setStaff(staff.filter(s=>s.id!==id)); };
  const openEdit    = (s) => { setEditMode(true); setSelected(s.id); setForm({...s}); setErrors({}); setShowForm(true); };
  const updateStaff = () => { if (!validate()) { setShake(true); setTimeout(()=>setShake(false),500); return; } setStaff(staff.map(s=>s.id===selected?{...form,id:s.id}:s)); setForm({...emptyForm}); setEditMode(false); setSelected(null); setErrors({}); setShowForm(false); };
  const resetForm   = () => { setForm({...emptyForm}); setEditMode(false); setSelected(null); setErrors({}); };
  const closeForm   = () => { resetForm(); setShowForm(false); };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2*1024*1024) { alert('Image trop grande. Max 2MB.'); return; }
      const r = new FileReader();
      r.onloadend = () => setForm({...form, image:r.result});
      r.readAsDataURL(file);
    }
  };

  const initials   = (s) => `${s.prenom?.[0]||''}${s.nom?.[0]||''}`.toUpperCase();
  const sexeColor  = (sx) => sx==='Femme' ? { bg:'#be185d', color:'#fbcfe8', border:'#f472b6' } : { bg:'#1d4ed8', color:'#bfdbfe', border:'#60a5fa' };
  const roleColor  = (role) => ({ 'Réceptionniste':{bg:'#0f766e',color:'#99f6e4'},'Agent de ménage':{bg:'#a16207',color:'#fef08a'},'Nutritionniste':{bg:'#7c3aed',color:'#ddd6fe'},'Responsable salle':{bg:'#b91c1c',color:'#fecaca'},'Sécurité':{bg:'#1e40af',color:'#bfdbfe'},'Staff administratif':{bg:'#065f46',color:'#a7f3d0'} }[role] || {bg:'#374151',color:'#d1d5db'});
  const roleIcons  = { 'Réceptionniste':'R','Agent de ménage':'M','Nutritionniste':'N','Responsable salle':'RS','Sécurité':'S','Staff administratif':'A' };

  const inputStyle = { padding:'12px 16px', background:'rgba(15,23,42,0.6)', border:'1px solid rgba(51,65,85,0.5)', borderRadius:12, color:'#f1f5f9', outline:'none', fontSize:14, fontFamily:'inherit' };
  const errStyle   = { ...inputStyle, borderColor:'#ef4444', boxShadow:'0 0 0 3px rgba(239,68,68,0.15)' };
  const labelStyle = { color:'#94a3b8', fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}><Icon d={IC.staff} size={28} color="#6366f1" /> Gestion du Staff</h1>
          <p style={S.subtitle}>{staff.length} membre{staff.length>1?'s':''} actif{staff.length>1?'s':''}</p>
        </div>
        <button style={{ ...S.btnPrimary, ...(showForm&&!editMode?S.btnClose:{}) }}
          onClick={() => { if(showForm){closeForm();}else{resetForm();setShowForm(true);} }}>
          <Icon d={showForm&&!editMode?IC.close:IC.plus} size={16} color="#fff" />
          {showForm&&!editMode ? 'Fermer' : 'Nouveau staff'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:12, marginBottom:24 }}>
        {roles.map(role => {
          const count = staff.filter(s=>s.role===role).length;
          const rc = roleColor(role);
          return (
            <div key={role} style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(30,41,55,0.6)', border:'1px solid rgba(51,65,85,0.5)', borderRadius:14, padding:'14px 18px' }}>
              <div style={{ width:36, height:36, borderRadius:10, background:rc.bg, color:rc.color, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:12 }}>
                {roleIcons[role]||'?'}
              </div>
              <div>
                <div style={{ fontSize:20, fontWeight:800, color:rc.color }}>{count}</div>
                <div style={{ fontSize:11, color:'#94a3b8' }}>{role}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position:'relative', marginBottom:24 }}>
        <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)' }}>
          <Icon d={IC.search} size={16} color="#64748b" />
        </span>
        <input style={{ width:'100%', padding:'14px 48px', background:'rgba(30,41,55,0.6)', border:'1px solid rgba(51,65,85,0.5)', borderRadius:16, color:'#e2e8f0', fontSize:14, outline:'none', boxSizing:'border-box' }}
          placeholder="Rechercher par nom, prénom ou fonction..." value={search} onChange={e=>setSearch(e.target.value)} />
        {search && <button style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', border:'none', background:'rgba(51,65,85,0.5)', color:'#94a3b8', cursor:'pointer', width:26, height:26, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }} onClick={()=>setSearch('')}>
          <Icon d={IC.close} size={12} color="#94a3b8" />
        </button>}
      </div>

      {/* Modal */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(2,6,23,0.8)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, padding:20 }} onClick={closeForm}>
          <div style={{ background:'#1e293b', border:'1px solid rgba(51,65,85,0.6)', borderRadius:24, padding:'32px 36px', width:'100%', maxWidth:560, boxShadow:'0 25px 50px -12px rgba(0,0,0,0.5)', ...(shake?{animation:'shake 0.5s ease-in-out'}:{}) }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
              <div>
                <h3 style={{ color:'#f8fafc', fontSize:22, margin:0, fontWeight:700, display:'flex', alignItems:'center', gap:10 }}>
                  <Icon d={editMode?IC.edit:IC.plus} size={20} color="#6366f1" /> {editMode?'Modifier':'Ajouter'} un membre
                </h3>
                <p style={{ color:'#64748b', fontSize:13, marginTop:6 }}>{editMode?'Modifiez les informations':'Remplissez les informations'}</p>
              </div>
              <button onClick={closeForm} style={{ width:36, height:36, borderRadius:12, border:'1px solid rgba(51,65,85,0.5)', background:'rgba(30,41,55,0.6)', color:'#94a3b8', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon d={IC.close} size={16} color="#94a3b8" />
              </button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
              {[['nom','Nom'],['prenom','Prénom'],['tel','Téléphone'],['email','Email']].map(([k,l]) => (
                <div key={k} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <label style={labelStyle}>{l} <span style={{ color:'#ef4444' }}>*</span></label>
                  <input style={errors[k]?errStyle:inputStyle} value={form[k]} placeholder={` ${k==='tel'?'téléphone':k==='email'?'adresse email':`${l.toLowerCase()}`}`}
                    onChange={e=>{ setForm({...form,[k]:e.target.value}); if(errors[k]) setErrors({...errors,[k]:''}); }} />
                  {errors[k] && <span style={{ color:'#ef4444', fontSize:12, fontWeight:500 }}>{errors[k]}</span>}
                </div>
              ))}
              {[['role','Fonction',roles.map(r=>({v:r,l:r}))],['sexe','Sexe',[{v:'Homme',l:'Homme'},{v:'Femme',l:'Femme'}]]].map(([k,l,opts]) => (
                <div key={k} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <label style={labelStyle}>{l} <span style={{ color:'#ef4444' }}>*</span></label>
                  <select style={errors[k]?errStyle:inputStyle} value={form[k]} onChange={e=>{ setForm({...form,[k]:e.target.value}); if(errors[k]) setErrors({...errors,[k]:''}); }}>
                    <option value="">-- Choisir --</option>
                    {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                  {errors[k] && <span style={{ color:'#ef4444', fontSize:12, fontWeight:500 }}>{errors[k]}</span>}
                </div>
              ))}
              <div style={{ gridColumn:'1/-1', display:'flex', flexDirection:'column', gap:6 }}>
                <label style={labelStyle}>Photo de profil</label>
                <div style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', background:'rgba(15,23,42,0.6)', border:'1px dashed rgba(51,65,85,0.8)', borderRadius:12 }}>
                  <input type="file" accept="image/*" onChange={handleImage} style={{ display:'none' }} id="staffImg" />
                  <label htmlFor="staffImg" style={{ padding:'10px 18px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:10, color:'#fff', fontWeight:600, fontSize:13, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6 }}>
                    <Icon d={IC.camera} size={14} color="#fff" /> Choisir une image
                  </label>
                  <span style={{ color:'#64748b', fontSize:12 }}>JPG, PNG • Max 2MB</span>
                </div>
                {form.image && (
                  <div style={{ position:'relative', display:'inline-block', marginTop:8 }}>
                    <img src={form.image} alt="preview" style={{ width:80, height:80, borderRadius:'50%', objectFit:'cover', border:'3px solid #6366f1' }} />
                    <button onClick={()=>setForm({...form,image:''})} style={{ position:'absolute', top:-6, right:-6, width:24, height:24, borderRadius:'50%', background:'#ef4444', color:'#fff', border:'2px solid #1e293b', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>
                      <Icon d={IC.close} size={10} color="#fff" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop:28, display:'flex', justifyContent:'flex-end', gap:12 }}>
              <button onClick={closeForm} style={{ padding:'12px 24px', background:'rgba(30,41,55,0.6)', border:'1px solid rgba(51,65,85,0.5)', borderRadius:12, color:'#94a3b8', cursor:'pointer', fontWeight:600, fontSize:14 }}>Annuler</button>
              <button onClick={editMode?updateStaff:addStaff} style={{ padding:'12px 28px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', borderRadius:12, color:'#fff', cursor:'pointer', fontWeight:600, fontSize:14, boxShadow:'0 4px 14px rgba(99,102,241,0.4)', display:'flex', alignItems:'center', gap:8 }}>
                <Icon d={editMode?IC.check:IC.plus} size={16} color="#fff" /> {editMode?'Enregistrer':'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background:'rgba(30,41,55,0.4)', border:'1px solid rgba(51,65,85,0.4)', borderRadius:20, overflow:'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <Icon d={IC.users} size={48} color="#64748b" />
            <p style={{ color:'#64748b', marginTop:16, fontSize:15 }}>{search?'Aucun membre ne correspond à votre recherche':'Aucun membre dans le staff'}</p>
            {search && <button style={{ marginTop:16, padding:'10px 20px', background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:10, color:'#818cf8', cursor:'pointer', fontWeight:600, fontSize:13 }} onClick={()=>setSearch('')}>Effacer la recherche</button>}
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'rgba(15,23,42,0.6)' }}>
                  {['Membre','Fonction','Contact','Sexe','Actions'].map(h => (
                    <th key={h} style={{ padding:'18px 20px', textAlign:'left', color:'#64748b', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const sc = sexeColor(s.sexe);
                  const rc = roleColor(s.role);
                  return (
                    <tr key={s.id} style={{ background:i%2===0?'transparent':'rgba(30,41,55,0.5)', transition:'background 0.2s' }}>
                      <td style={{ padding:'16px 20px', borderBottom:'1px solid rgba(51,65,85,0.3)', color:'#cbd5e1' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                          {s.image ? (
                            <img src={s.image} alt="" style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(99,102,241,0.3)' }} />
                          ) : (
                            <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:14 }}>
                              {initials(s)}
                            </div>
                          )}
                          <div>
                            <div style={{ color:'#f1f5f9', fontWeight:600, fontSize:14 }}>{s.prenom} {s.nom}</div>
                            <div style={{ color:'#64748b', fontSize:12, marginTop:2 }}>{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'16px 20px', borderBottom:'1px solid rgba(51,65,85,0.3)' }}>
                        <span style={{ padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, background:rc.bg, color:rc.color }}>{s.role}</span>
                      </td>
                      <td style={{ padding:'16px 20px', borderBottom:'1px solid rgba(51,65,85,0.3)', color:'#cbd5e1' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <Icon d={IC.phone} size={14} color="#94a3b8" />
                          <span style={{ fontSize:13, color:'#94a3b8' }}>{s.tel}</span>
                        </div>
                      </td>
                      <td style={{ padding:'16px 20px', borderBottom:'1px solid rgba(51,65,85,0.3)' }}>
                        <span style={{ padding:'5px 12px', borderRadius:20, fontSize:12, fontWeight:600, background:sc.bg, color:sc.color, border:`1px solid ${sc.border}`, display:'inline-flex', alignItems:'center', gap:4 }}>
                          {s.sexe==='Femme'?'♀':'♂'} {s.sexe}
                        </span>
                      </td>
                      <td style={{ padding:'16px 20px', borderBottom:'1px solid rgba(51,65,85,0.3)' }}>
                        <div style={{ display:'flex', gap:8 }}>
                          <button onClick={()=>openEdit(s)} style={{ width:36, height:36, borderRadius:10, background:'rgba(30,58,138,0.3)', border:'1px solid rgba(37,99,235,0.3)', color:'#60a5fa', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
                            title="Modifier"><Icon d={IC.edit} size={15} color="#60a5fa" /></button>
                          <button onClick={()=>deleteStaff(s.id)} style={{ width:36, height:36, borderRadius:10, background:'rgba(153,27,27,0.2)', border:'1px solid rgba(239,68,68,0.3)', color:'#f87171', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
                            title="Supprimer"><Icon d={IC.trash} size={15} color="#f87171" /></button>
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
  );
}

const S = {
  page:      { padding:'32px 40px', fontFamily:"'Inter', 'Segoe UI', system-ui, sans-serif", maxWidth:1200, margin:'0 auto', background:'#0f172a', minHeight:'100vh', color:'#e2e8f0' },
  header:    { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 },
  title:     { fontSize:32, fontWeight:800, color:'#f8fafc', margin:0, letterSpacing:'-0.5px', display:'flex', alignItems:'center', gap:12 },
  subtitle:  { color:'#64748b', marginTop:6, fontSize:14, fontWeight:500 },
  btnPrimary:{ display:'flex', alignItems:'center', gap:8, padding:'12px 24px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', borderRadius:14, color:'#fff', fontWeight:600, cursor:'pointer', fontSize:14, boxShadow:'0 4px 14px rgba(99,102,241,0.4)' },
  btnClose:  { background:'linear-gradient(135deg,#ef4444,#dc2626)', boxShadow:'0 4px 14px rgba(239,68,68,0.4)' },
};

export default Staff;