// src/pages/admin/coachs/AjouterCoach.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const SPECIALITES = ['Musculation','Cardio','Yoga','Boxe','Natation','Zumba','Fitness','Arts martiaux'];
const C = { bgDark:'#0a0e1a', surface:'#111827', surfaceAlt:'#1a2234', border:'#1f2937', borderLight:'#374151', text:'#f8fafc', textMuted:'#94a3b8', textLight:'#cbd5e1', primary:'#6366f1', primaryDark:'#4f46e5', success:'#22c55e', danger:'#ef4444' };
const empty = { nom:'', prenom:'', date_naissance:'', telephone:'', email:'', adresse:'', specialite:'', sexe:'', salaire:'', statut:'actif', photo:null };

function Icon({ d, size = 18, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}
const IC = {
  back:    ['M19 12H5','M12 5l-7 7 7 7'],
  coach:   ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  check:   'M20 6L9 17l-5-5',
  warning: ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  camera:  ['M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z','M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  save:    ['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z','M17 21v-8H7v8','M7 3v5h8'],
  close:   ['M18 6L6 18','M6 6l12 12'],
  clock:   ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 6v6l4 2'],
};

export default function AjouterCoach() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState(empty);
  const [saving,  setSaving]  = useState(false);
  const [message, setMessage] = useState({ text:'', type:'' });
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const notify = (text, type = 'success') => { setMessage({ text, type }); setTimeout(()=>setMessage({text:'',type:''}),4000); };

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2*1024*1024) { notify('La photo ne doit pas dépasser 2MB', 'error'); return; }
    setForm({...form, photo:file});
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.nom||!form.prenom||!form.email||!form.specialite) { notify('Veuillez remplir tous les champs obligatoires (*)', 'error'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => { if (v!==null&&v!=='') fd.append(k,v); });
      await axios.post(`${API}/coachs`, fd, { headers:{ 'Content-Type':'multipart/form-data' } });
      notify('Coach ajouté avec succès');
      setTimeout(()=>navigate('/admin/coachs'), 1500);
    } catch (err) { notify(err.response?.data?.error||"Erreur lors de l'enregistrement", 'error'); setSaving(false); }
  };

  const inputStyle = { padding:'12px 16px', background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:14, outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box', transition:'all 0.2s' };
  const labelStyle = { color:C.textMuted, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:0.8, marginBottom:6, display:'block' };

  const fields = [
    ['nom','Nom *','text','nom',true], ['prenom','Prénom *','text','prenom',true],
    ['date_naissance','Date de naissance','date','',false], ['telephone','Téléphone','tel','telephone',false],
    ['email','Email *','email','email',true], ['salaire','Salaire (MAD)','number','salaire',false],
  ];

  return (
    <div style={{ minHeight:'100vh', background:C.bgDark, fontFamily:'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', paddingBottom:60 }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b)', padding:'28px 40px' }}>
        <button onClick={()=>navigate('/admin/coachs')} style={{ background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', borderRadius:10, color:'rgba(255,255,255,.8)', fontSize:13, padding:'8px 18px', cursor:'pointer', marginBottom:16, fontFamily:'inherit', fontWeight:500, display:'flex', alignItems:'center', gap:8 }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.2)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.1)'}>
          <Icon d={IC.back} size={14} color="rgba(255,255,255,.8)" /> Retour aux coachs
        </button>
        <h1 style={{ fontSize:28, fontWeight:800, color:'#f1f5f9', margin:0, letterSpacing:'-0.5px', display:'flex', alignItems:'center', gap:12 }}>
          <Icon d={IC.coach} size={26} color="#a78bfa" /> Ajouter un Coach
        </h1>
        <p style={{ color:'rgba(255,255,255,.5)', marginTop:8, fontSize:14 }}>Remplissez les informations du nouvel entraîneur</p>
      </div>

      {/* Toast */}
      {message.text && (
        <div style={{ margin:'20px 40px 0', padding:'14px 20px', borderRadius:12, border:'1px solid', fontSize:14, fontWeight:600, display:'flex', alignItems:'center', gap:10,
          background:message.type==='error'?'rgba(239,68,68,0.1)':'rgba(34,197,94,0.1)',
          borderColor:message.type==='error'?'#ef4444':'#22c55e',
          color:message.type==='error'?'#f87171':'#4ade80' }}>
          <Icon d={message.type==='error'?IC.warning:IC.check} size={16} color={message.type==='error'?'#f87171':'#4ade80'} /> {message.text}
        </div>
      )}

      {/* Form */}
      <div style={{ background:C.surface, borderRadius:20, padding:'32px 40px', margin:'28px 40px 0', border:`1px solid ${C.border}`, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
        <form onSubmit={handleSubmit}>
          {/* Photo */}
          <div style={{ display:'flex', alignItems:'center', gap:22, marginBottom:28 }}>
            <div onClick={()=>fileRef.current.click()} style={{ position:'relative', width:100, height:100, borderRadius:'50%', cursor:'pointer', overflow:'hidden', border:`3px dashed ${C.primary}`, flexShrink:0, transition:'all 0.2s' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.primaryDark; e.currentTarget.style.transform='scale(1.05)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.transform='scale(1)'; }}>
              {preview ? <img src={preview} alt="photo" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : (
                <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:C.surfaceAlt }}>
                  <Icon d={IC.camera} size={32} color={C.textMuted} />
                  <span style={{ fontSize:11, color:C.textMuted, marginTop:4 }}>Photo</span>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhoto} />
            <div>
              <p style={{ margin:'0 0 4px', color:C.textLight, fontWeight:600, fontSize:15 }}>Photo du coach</p>
              <p style={{ margin:0, color:C.textMuted, fontSize:13 }}>Cliquez pour {preview?'changer':'ajouter'} une photo<br/><span style={{ fontSize:12, opacity:0.7 }}>JPG, PNG — max 2MB</span></p>
            </div>
          </div>

          <div style={{ height:1, background:C.border, margin:'0 0 28px' }} />

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:20 }}>
            {fields.map(([key,lbl,type,ph,req]) => (
              <div key={key}>
                <label style={labelStyle}>{lbl}</label>
                <input type={type} value={form[key]} required={req} style={inputStyle} placeholder={ph}
                  onChange={e=>setForm({...form,[key]:e.target.value})} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Sexe</label>
              <select value={form.sexe} style={inputStyle} onChange={e=>setForm({...form,sexe:e.target.value})}>
                <option value="">-- Choisir --</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Spécialité *</label>
              <select value={form.specialite} required style={inputStyle} onChange={e=>setForm({...form,specialite:e.target.value})}>
                <option value="">-- Choisir --</option>
                {SPECIALITES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Statut</label>
              <select value={form.statut} style={inputStyle} onChange={e=>setForm({...form,statut:e.target.value})}>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop:20 }}>
            <label style={labelStyle}>Adresse</label>
            <input type="text" value={form.adresse} style={inputStyle} placeholder="adresse" onChange={e=>setForm({...form,adresse:e.target.value})} />
          </div>

          <div style={{ display:'flex', gap:14, marginTop:36 }}>
            <button type="submit" disabled={saving} style={{ padding:'13px 32px', background:saving?'#374151':'linear-gradient(135deg,#4338ca,#6366f1)', border:'none', borderRadius:12, color:'#fff', fontSize:15, fontWeight:600, cursor:saving?'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:10, boxShadow:saving?'none':'0 4px 14px rgba(99,102,241,0.4)', transition:'all 0.2s' }}>
              {saving ? <><Icon d={IC.clock} size={16} color="#fff" /> Enregistrement…</> : <><Icon d={IC.save} size={16} color="#fff" /> Ajouter le coach</>}
            </button>
            <button type="button" onClick={()=>navigate('/admin/coachs')} style={{ padding:'13px 24px', background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:12, color:C.textMuted, fontSize:15, cursor:'pointer', fontFamily:'inherit', fontWeight:500, transition:'all 0.2s' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.borderLight; e.currentTarget.style.color=C.textLight; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMuted; }}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}