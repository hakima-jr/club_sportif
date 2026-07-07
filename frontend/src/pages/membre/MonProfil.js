// src/pages/membre/MonProfil.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

function Icon({ d, size = 18, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}
const IC = {
  user:     ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  edit:     ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  check:    'M20 6L9 17l-5-5',
  save:     ['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z','M17 21v-8H7v8','M7 3v5h8'],
  camera:   ['M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z','M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  mail:     ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6'],
  phone:    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.07 6.07l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  calendar: ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  mapPin:   ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z','M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  weight:   ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M8 12h8'],
  ruler:    ['M5 3l14 14','M5 3h4','M5 3v4','M19 17h-4','M19 17v-4'],
  target:   ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z','M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z','M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
  gender:   ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z'],
  clock:    ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 6v6l4 2'],
  frown:    ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M16 16s-1.5-2-4-2-4 2-4 2','M9 9h.01','M15 9h.01'],
  id:       ['M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z'],
  list:     ['M8 6h13','M8 12h13','M8 18h13','M3 6h.01','M3 12h.01','M3 18h.01'],
  chat:     ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  coach:    ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  warning:  ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  note:     ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8','M10 9H8'],
  circle:   ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z'],
};

const C = {
  bgDark:'#0a0e1a', surface:'#111827', surfaceAlt:'#1a2234', border:'#1f2937', borderLight:'#374151',
  text:'#f8fafc', textMuted:'#94a3b8', textLight:'#cbd5e1',
  primary:'#6366f1', success:'#22c55e', danger:'#ef4444', warning:'#f59e0b', info:'#3b82f6',
};

function Avatar({ profil, photo, size = 120, onEdit }) {
  const initials = `${profil?.prenom?.[0]||''}${profil?.nom?.[0]||''}`.toUpperCase();
  const hue = ((profil?.nom||'A').charCodeAt(0)*37)%360;
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      {photo
        ? <img src={photo} alt="profil" style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', border:`4px solid ${C.borderLight}`, boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }} />
        : <div style={{ width:size, height:size, borderRadius:'50%', background:`hsl(${hue},55%,22%)`, border:`4px solid hsl(${hue},55%,40%)`, display:'flex', alignItems:'center', justifyContent:'center', color:`hsl(${hue},60%,78%)`, fontWeight:700, fontSize:size*0.35, boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>
            {initials}
          </div>
      }
      {onEdit && (
        <button onClick={onEdit} style={{ position:'absolute', bottom:4, right:4, width:32, height:32, borderRadius:'50%', background:C.primary, border:`2px solid ${C.bgDark}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon d={IC.camera} size={14} color="#fff" />
        </button>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value, color = C.textLight, editing, inputType = 'text', onChange }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'14px 18px', background:C.surfaceAlt, borderRadius:12, border:`1px solid ${C.border}`, transition:'all 0.2s' }}
      onMouseEnter={e=>{ if(!editing){ e.currentTarget.style.borderColor=C.borderLight; e.currentTarget.style.transform='translateX(4px)'; } }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='none'; }}>
      <div style={{ width:34, height:34, borderRadius:10, background:'rgba(99,102,241,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
        <Icon d={icon} size={16} color={C.primary} />
      </div>
      <div style={{ flex:1 }}>
        <p style={{ margin:'0 0 4px', fontSize:11, color:C.textMuted, fontWeight:600, textTransform:'uppercase', letterSpacing:0.8 }}>{label}</p>
        {editing
          ? <input type={inputType} defaultValue={value||''} onChange={e=>onChange(e.target.value)}
              style={{ background:'transparent', border:'none', borderBottom:`1px solid ${C.primary}`, color:C.text, fontSize:15, fontWeight:500, outline:'none', width:'100%', padding:'2px 0', fontFamily:'inherit' }} />
          : <p style={{ margin:0, fontSize:15, color:value?color:C.textMuted, fontWeight:500, fontStyle:value?'normal':'italic' }}>{value||'Non renseigné'}</p>
        }
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color, unit='', editing, onChange }) {
  return (
    <div style={{ background:C.surfaceAlt, borderRadius:14, padding:'20px 16px', border:`1px solid ${C.border}`, textAlign:'center', transition:'all 0.2s' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=color+'50'; e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='none'; }}>
      <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}><Icon d={icon} size={26} color={color} /></div>
      {editing
        ? <input type="number" defaultValue={value||''} onChange={e=>onChange(e.target.value)} placeholder="—"
            style={{ width:'80%', background:'transparent', border:'none', borderBottom:`1px solid ${color}`, color, fontSize:22, fontWeight:800, textAlign:'center', outline:'none', fontFamily:'inherit' }} />
        : <div style={{ fontSize:24, fontWeight:800, color, marginBottom:4 }}>{value?`${value}${unit}`:'—'}</div>
      }
      <div style={{ fontSize:12, color:C.textMuted, fontWeight:500, marginTop:4 }}>{label}</div>
    </div>
  );
}

export default function MonProfil() {
  const user    = JSON.parse(localStorage.getItem('user') || '{}');
  const fileRef = useRef();
  const [profil,       setProfil]       = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [editing,      setEditing]      = useState(false);
  const [form,         setForm]         = useState({});
  const [message,      setMessage]      = useState({ text:'', type:'' });
  const [photo,        setPhoto]        = useState(null);
  const [commentaires, setCommentaires] = useState([]);
  const [commLoading,  setCommLoading]  = useState(false);

  const notify = (text, type='success') => { setMessage({text,type}); setTimeout(()=>setMessage({text:'',type:''}),3500); };

  useEffect(() => {
    const userId = user.id_membre || user.id;
    const saved = localStorage.getItem(`member_photo_${userId}`);
    if (saved) setPhoto(saved);
    if (!user.id_membre) { setLoading(false); return; }
    axios.get(`${API}/membres`).then(res => {
      const moi = res.data.find(m => m.id_personne === user.id_membre);
      if (moi) { const c={...moi, date_naissance:moi.date_naissance?.slice(0,10)||''}; setProfil(c); setForm(c); }
    }).catch(()=>notify('Erreur chargement','error')).finally(()=>setLoading(false));
    setCommLoading(true);
    axios.get(`${API}/commentaires/${user.id_membre}`).then(res=>setCommentaires(res.data)).catch(()=>{}).finally(()=>setCommLoading(false));
  }, []);

  const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (ev) => {
    const image = ev.target.result;

    setPhoto(image);

    const userId = user.id_membre || user.id;

    localStorage.setItem(`member_photo_${userId}`, image);

    window.dispatchEvent(new Event("user-profile-updated"));
  };

  reader.readAsDataURL(file);
};



  const handleSave = async () => {
  try {
    const payload = {
      ...form,
      date_naissance: form.date_naissance?.slice(0, 10) || null,
    };

    await axios.put(`${API}/membres/${user.id_membre}`, payload);

    setProfil(payload);
    setEditing(false);

    const currentUser =
      JSON.parse(localStorage.getItem("user")) || {};

    const updatedUser = {
      ...currentUser,
      nom: payload.nom,
      prenom: payload.prenom,
      email: payload.email,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    window.dispatchEvent(new Event("user-profile-updated"));

    notify("Profil mis à jour");
  } catch {
    notify("Erreur mise à jour", "error");
  }
};

  const setField = (key) => (val) => setForm(f=>({...f,[key]:val}));

  const calculateAge = (dateStr) => {
    if (!dateStr) return null;
    const today=new Date(), birth=new Date(dateStr);
    let age = today.getFullYear()-birth.getFullYear();
    const m = today.getMonth()-birth.getMonth();
    if (m<0||(m===0&&today.getDate()<birth.getDate())) age--;
    return age;
  };

  const bmi = profil?.poids&&profil?.taille ? (profil.poids/Math.pow(profil.taille/100,2)).toFixed(1) : null;
  const bmiColor = !bmi?C.textMuted:bmi<18.5?C.info:bmi<25?C.success:bmi<30?C.warning:C.danger;
  const bmiLabel = !bmi?'':bmi<18.5?'Insuffisance pondérale':bmi<25?'Poids normal':bmi<30?'Surpoids':'Obésité';

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', background:C.bgDark, color:C.textMuted, fontFamily:'Inter, sans-serif' }}>
      <div style={{ textAlign:'center' }}><Icon d={IC.clock} size={48} color={C.textMuted} /><p style={{ marginTop:16 }}>Chargement…</p></div>
    </div>
  );
  if (!profil) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', background:C.bgDark, color:C.danger, fontFamily:'Inter, sans-serif' }}>
      <div style={{ textAlign:'center' }}><Icon d={IC.frown} size={48} color={C.danger} /><p style={{ marginTop:16 }}>Profil introuvable</p></div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:C.bgDark, fontFamily:'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', paddingBottom:60 }}>

      {/* Toast */}
      {message.text && (
        <div style={{ position:'fixed', top:20, right:20, padding:'12px 20px', borderRadius:12, fontWeight:600, fontSize:14, zIndex:9999, background:message.type==='error'?'rgba(239,68,68,0.95)':'rgba(34,197,94,0.95)', color:'#fff', boxShadow:'0 8px 24px rgba(0,0,0,0.4)', display:'flex', alignItems:'center', gap:8 }}>
          <Icon d={message.type==='error'?IC.warning:IC.check} size={16} color="#fff" /> {message.text}
        </div>
      )}

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b)', padding:'28px 40px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(99,102,241,0.12)', pointerEvents:'none' }} />
        <h1 style={{ fontSize:28, fontWeight:800, color:'#f1f5f9', margin:0, letterSpacing:'-0.5px', display:'flex', alignItems:'center', gap:12 }}>
          <Icon d={IC.user} size={26} color="#a78bfa" /> Mon Profil
        </h1>
        <p style={{ color:'rgba(255,255,255,.5)', marginTop:8, fontSize:14, margin:'8px 0 0' }}>Vos informations personnelles</p>
      </div>

      <div style={{ padding:'28px 40px' }}>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhotoChange} />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:28 }}>

          {/* LEFT COLUMN */}
          <div>
            {/* Profile Card */}
            <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, padding:'32px 28px', textAlign:'center', marginBottom:20, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
                <Avatar profil={profil} photo={photo} size={130} onEdit={()=>fileRef.current.click()} />
              </div>
              <h2 style={{ fontSize:20, fontWeight:700, color:C.text, margin:'0 0 6px' }}>{profil.prenom} {profil.nom}</h2>
              <p style={{ color:C.textMuted, fontSize:13, margin:'0 0 14px' }}>{user.email}</p>
              <span style={{ padding:'5px 16px', borderRadius:20, fontSize:12, fontWeight:700, background:'rgba(59,130,246,0.15)', border:'1px solid rgba(59,130,246,0.4)', color:C.info, display:'inline-flex', alignItems:'center', gap:6 }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:C.info, display:'inline-block' }} /> Membre
              </span>
              <div style={{ marginTop:20, padding:'14px', background:C.surfaceAlt, borderRadius:10, border:`1px solid ${C.border}`, fontSize:13, color:C.textMuted, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <Icon d={IC.id} size={14} color={C.textMuted} /> Membre <strong style={{ color:C.textLight }}>#{user.id_membre}</strong>
              </div>
              <div style={{ marginTop:12, padding:'10px 14px', background:C.surfaceAlt, borderRadius:10, border:`1px solid ${C.border}`, fontSize:13, color:C.textMuted, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                <Icon d={IC.calendar} size={13} color={C.textMuted} /> Inscrit le <strong style={{ color:C.textLight }}>{profil.date_inscription?new Date(profil.date_inscription).toLocaleDateString('fr-FR'):'—'}</strong>
              </div>
            </div>

            {/* Stats corporelles */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
              <StatCard icon={IC.weight} value={editing?form.poids:profil.poids} label="Poids (kg)"  color={C.warning} unit=" kg" editing={editing} onChange={setField('poids')} />
              <StatCard icon={IC.ruler}  value={editing?form.taille:profil.taille} label="Taille (cm)" color={C.info}    unit=" cm" editing={editing} onChange={setField('taille')} />
            </div>

            {/* IMC Card */}
            <div style={{ background:C.surface, borderRadius:14, padding:'18px 20px', border:`1px solid ${C.border}`, marginBottom:20, textAlign:'center' }}>
              <div style={{ fontSize:13, color:C.textMuted, marginBottom:8, fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>Indice de Masse Corporelle</div>
              <div style={{ fontSize:36, fontWeight:800, color:bmiColor }}>{bmi||'—'}</div>
              {bmi && <div style={{ fontSize:12, color:bmiColor, marginTop:4, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>
                <Icon d={IC.circle} size={10} color={bmiColor} strokeWidth={3} /> {bmiLabel}
              </div>}
            </div>

            {/* Objectif */}
            <div style={{ background:C.surface, borderRadius:14, border:`1px solid ${C.border}`, padding:'16px 18px' }}>
              <div style={{ fontSize:11, color:C.textMuted, fontWeight:600, textTransform:'uppercase', letterSpacing:0.8, marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
                <Icon d={IC.target} size={13} color={C.textMuted} /> Objectif
              </div>
              {editing
                ? <textarea defaultValue={form.objectif||''} onChange={e=>setField('objectif')(e.target.value)} rows={3}
                    style={{ width:'100%', background:'transparent', border:'none', borderBottom:`1px solid ${C.primary}`, color:C.text, fontSize:14, outline:'none', resize:'none', fontFamily:'inherit', boxSizing:'border-box' }} />
                : <p style={{ margin:0, fontSize:14, color:profil.objectif?C.textLight:C.textMuted, fontStyle:profil.objectif?'normal':'italic', lineHeight:1.5 }}>{profil.objectif||'Aucun objectif défini'}</p>
              }
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            {/* Edit button */}
            <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginBottom:16 }}>
              {editing && (
                <button onClick={()=>{ setEditing(false); setForm(profil); }} style={{ padding:'9px 20px', background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:12, color:C.textMuted, fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>
                  Annuler
                </button>
              )}
              <button onClick={()=>editing?handleSave():setEditing(true)}
                style={{ padding:'9px 22px', background:editing?'linear-gradient(135deg,#15803d,#22c55e)':'linear-gradient(135deg,#4338ca,#6366f1)', border:'none', borderRadius:12, color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:6 }}>
                <Icon d={editing?IC.save:IC.edit} size={14} color="#fff" />
                {editing ? 'Enregistrer' : 'Modifier le profil'}
              </button>
            </div>

            {/* Informations personnelles */}
            <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, padding:'28px 32px', marginBottom:24, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
              <h3 style={{ fontSize:17, fontWeight:700, color:C.text, margin:'0 0 20px', display:'flex', alignItems:'center', gap:8 }}>
                <Icon d={IC.list} size={18} color={C.primary} /> Informations personnelles
              </h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:12 }}>
                <InfoRow icon={IC.user}     label="Prénom"            value={editing?form.prenom:profil.prenom}           editing={editing} onChange={setField('prenom')} />
                <InfoRow icon={IC.user}     label="Nom"               value={editing?form.nom:profil.nom}                 editing={editing} onChange={setField('nom')} />
                <InfoRow icon={IC.mail}     label="Email"             value={editing?form.email:profil.email}             editing={editing} onChange={setField('email')}           color={C.info} inputType="email" />
                <InfoRow icon={IC.phone}    label="Téléphone"         value={editing?form.telephone:profil.telephone}     editing={editing} onChange={setField('telephone')} />
                <InfoRow icon={IC.calendar} label="Date de naissance" value={editing?form.date_naissance:profil.date_naissance?.slice(0,10)} editing={editing} onChange={setField('date_naissance')} inputType="date" />
                <InfoRow icon={IC.calendar} label="Âge"               value={calculateAge(profil.date_naissance)?`${calculateAge(profil.date_naissance)} ans`:null} editing={false} onChange={()=>{}} />
                <InfoRow icon={IC.gender}   label="Sexe"              value={editing?form.sexe:profil.sexe}               editing={editing} onChange={setField('sexe')} />
                <InfoRow icon={IC.mapPin}   label="Adresse"           value={editing?form.adresse:profil.adresse}         editing={editing} onChange={setField('adresse')} />
              </div>
            </div>

            {/* Commentaires du coach */}
            <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, padding:'28px 32px', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
              <h3 style={{ fontSize:17, fontWeight:700, color:C.text, margin:'0 0 20px', display:'flex', alignItems:'center', gap:8 }}>
                <Icon d={IC.chat} size={18} color={C.primary} /> Commentaires de mon coach
                <span style={{ background:C.surfaceAlt, color:C.textMuted, fontSize:12, padding:'2px 10px', borderRadius:20, fontWeight:600 }}>{commentaires.length}</span>
              </h3>
              {commLoading ? (
                <div style={{ textAlign:'center', padding:'30px 0', color:C.textMuted }}>Chargement…</div>
              ) : commentaires.length===0 ? (
                <div style={{ textAlign:'center', padding:'40px 0', color:C.textMuted }}>
                  <Icon d={IC.chat} size={36} color={C.textMuted} />
                  <p style={{ margin:'12px 0 0', fontSize:14 }}>Aucun commentaire de votre coach</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {commentaires.map(c => (
                    <div key={c.id_commentaire} style={{ background:C.surfaceAlt, borderRadius:12, padding:'16px 18px', border:`1px solid ${C.border}` }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#4338ca,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Icon d={IC.coach} size={14} color="#fff" />
                          </div>
                          <span style={{ color:C.primary, fontSize:13, fontWeight:600 }}>{c.nom_coach||'Coach'}</span>
                        </div>
                        <span style={{ color:C.textMuted, fontSize:12 }}>
                          {c.date_creation?new Date(c.date_creation).toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'}):''}
                        </span>
                      </div>
                      <p style={{ margin:0, fontSize:14, color:C.textLight, lineHeight:1.6 }}>{c.commentaire}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}