// src/pages/coach/MonProfil.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  warning:  ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  close:    ['M18 6L6 18','M6 6l12 12'],
  back:     ['M19 12H5','M12 5l-7 7 7 7'],
  calendar: ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  clock:    ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 6v6l4 2'],
  dumbbell: ['M6.5 6.5h11','M6.5 17.5h11','M3 9.5h3v5H3z','M18 9.5h3v5h-3z','M6 12h12'],
  mail:     ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6'],
  phone:    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.07 6.07l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  mapPin:   ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z','M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  gender:   ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z'],
  money:    ['M12 1v22','M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
  medal:    ['M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z','M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  id:       ['M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z'],
  stat:     ['M18 20V10','M12 20V4','M6 20v-6'],
  list:     ['M8 6h13','M8 12h13','M8 18h13','M3 6h.01','M3 12h.01','M3 18h.01'],
  inbox:    ['M22 12h-6l-2 3h-4l-2-3H2','M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
  arrow:    'M5 12h14M12 5l7 7-7 7',
  work:     ['M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z','M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'],
  camera:   ['M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z','M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
};

const C = {
  bgDark:'#0a0e1a', surface:'#111827', surfaceAlt:'#1a2234', border:'#1f2937', borderLight:'#374151',
  text:'#f8fafc', textMuted:'#94a3b8', textLight:'#cbd5e1',
  primary:'#6366f1', primaryDark:'#4f46e5', primaryGlow:'rgba(99,102,241,0.15)',
  success:'#22c55e', danger:'#ef4444', warning:'#f59e0b', info:'#3b82f6', purple:'#8b5cf6', orange:'#f97316',
};

const SPEC_COLORS = {
  Musculation:    {bg:'#1e1b4b',color:'#a78bfa',border:'#4338ca',gradient:'linear-gradient(135deg,#4338ca,#6366f1)'},
  Cardio:         {bg:'#1f2937',color:'#60a5fa',border:'#2563eb',gradient:'linear-gradient(135deg,#2563eb,#3b82f6)'},
  Yoga:           {bg:'#132624',color:'#34d399',border:'#059669',gradient:'linear-gradient(135deg,#059669,#10b981)'},
  Boxe:           {bg:'#3b1f1f',color:'#f87171',border:'#ef4444',gradient:'linear-gradient(135deg,#ef4444,#f87171)'},
  Natation:       {bg:'#0c1e38',color:'#38bdf8',border:'#0284c7',gradient:'linear-gradient(135deg,#0284c7,#0ea5e9)'},
  Zumba:          {bg:'#2e1a3a',color:'#e879f9',border:'#a21caf',gradient:'linear-gradient(135deg,#a21caf,#d946ef)'},
  Fitness:        {bg:'#1c2e1a',color:'#86efac',border:'#16a34a',gradient:'linear-gradient(135deg,#16a34a,#22c55e)'},
  'Arts martiaux':{bg:'#2d2215',color:'#fbbf24',border:'#d97706',gradient:'linear-gradient(135deg,#d97706,#f59e0b)'},
};

const fmt = (n) => Number(n||0).toLocaleString('fr-MA');

function Avatar({ coach, size=120, previewUrl=null }) {
  if (previewUrl) {
    return <img src={previewUrl} alt="profil" style={{ width:size,height:size,borderRadius:'50%',objectFit:'cover',border:`4px solid ${C.borderLight}`,flexShrink:0,boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }} />;
  }
  const initials=`${coach.nom?.[0]||''}${coach.prenom?.[0]||''}`.toUpperCase();
  const hue=((coach.nom||'A').charCodeAt(0)*37)%360;
  if(coach.photo) return <img src={`${API}/uploads/${coach.photo}`} alt="profil" style={{ width:size,height:size,borderRadius:'50%',objectFit:'cover',border:`4px solid ${C.borderLight}`,flexShrink:0,boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }} />;
  return <div style={{ width:size,height:size,borderRadius:'50%',flexShrink:0,background:`hsl(${hue},55%,22%)`,border:`4px solid hsl(${hue},55%,40%)`,display:'flex',alignItems:'center',justifyContent:'center',color:`hsl(${hue},60%,78%)`,fontWeight:700,fontSize:size*0.4,userSelect:'none',boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>{initials}</div>;
}

function InfoRow({ icon, label, value, color=C.textLight }) {
  return (
    <div style={{ display:'flex',alignItems:'flex-start',gap:14,padding:'14px 18px',background:C.surfaceAlt,borderRadius:12,border:`1px solid ${C.border}`,transition:'all 0.2s' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.borderLight; e.currentTarget.style.transform='translateX(4px)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='none'; }}>
      <div style={{ width:36,height:36,borderRadius:10,background:'rgba(99,102,241,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2 }}>
        <Icon d={icon} size={16} color={C.primary} />
      </div>
      <div style={{ flex:1 }}>
        <p style={{ margin:'0 0 4px',fontSize:11,color:C.textMuted,fontWeight:600,textTransform:'uppercase',letterSpacing:0.8 }}>{label}</p>
        <p style={{ margin:0,fontSize:15,color,fontWeight:500,wordBreak:'break-word' }}>{value||'—'}</p>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <div style={{ background:C.surfaceAlt,borderRadius:14,padding:'20px 24px',border:`1px solid ${C.border}`,textAlign:'center',transition:'all 0.2s' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=color+'40'; e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='none'; }}>
      <div style={{ display:'flex',justifyContent:'center',marginBottom:8 }}><Icon d={icon} size={28} color={color} /></div>
      <div style={{ fontSize:24,fontWeight:800,color,marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:12,color:C.textMuted,fontWeight:500 }}>{label}</div>
    </div>
  );
}

function InputField({ label, name, value, onChange, type='text', icon, options, required }) {
  const baseStyle = { width:'100%',padding:'12px 16px 12px 42px',background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:12,color:C.textLight,fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit',transition:'all 0.2s' };
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:'block',fontSize:12,color:C.textMuted,fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:0.5 }}>
        {label} {required&&<span style={{ color:C.danger }}>*</span>}
      </label>
      <div style={{ position:'relative' }}>
        {icon && <span style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',zIndex:1 }}>{icon}</span>}
        {type==='select'
          ? <select name={name} value={value||''} onChange={onChange} style={baseStyle}
              onFocus={e=>{ e.currentTarget.style.borderColor=C.primary+'60'; e.currentTarget.style.boxShadow=`0 0 0 3px ${C.primaryGlow}`; }}
              onBlur={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow='none'; }}>
              <option value="">Sélectionner...</option>
              {options.map(opt=><option key={opt} value={opt}>{opt}</option>)}
            </select>
          : <input type={type} name={name} value={value||''} onChange={onChange} style={baseStyle}
              onFocus={e=>{ e.currentTarget.style.borderColor=C.primary+'60'; e.currentTarget.style.boxShadow=`0 0 0 3px ${C.primaryGlow}`; }}
              onBlur={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow='none'; }} />
        }
      </div>
    </div>
  );
}

export default function MonProfil() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [coach,        setCoach]        = useState(null);
  const [seances,      setSeances]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [message,      setMessage]      = useState({ text:'', type:'' });
  const [isEditing,    setIsEditing]    = useState(false);
  const [editForm,     setEditForm]     = useState({});
  const [saving,       setSaving]       = useState(false);
  const [photoFile,    setPhotoFile]    = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const notify = (text, type='success') => { setMessage({text,type}); setTimeout(()=>setMessage({text:'',type:''}),4000); };

  useEffect(()=>{
    const load = async () => {
      setLoading(true);
      try {
        const { data:allCoachs } = await axios.get(`${API}/coachs`);
        const myCoach = allCoachs.find(c => c.email===user.email || (c.nom?.toLowerCase()===user.nom?.toLowerCase() && c.prenom?.toLowerCase()===user.prenom?.toLowerCase()));
        if (!myCoach) { notify('Profil coach introuvable','error'); setLoading(false); return; }
        const coachId = myCoach.id_coach;
        if (user.id_coach!==coachId) localStorage.setItem('user',JSON.stringify({...user,id_coach:coachId}));
        const { data:seancesData } = await axios.get(`${API}/seances`);
        setCoach(myCoach); setEditForm(myCoach);
        setSeances(seancesData.filter(s => Number(s.id_coach)===Number(coachId)));
      } catch { notify('Erreur chargement profil','error'); }
      finally { setLoading(false); }
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // libère l'URL de preview en mémoire quand elle n'est plus utilisée
  useEffect(() => {
    return () => { if (photoPreview) URL.revokeObjectURL(photoPreview); };
  }, [photoPreview]);

  const handleEditChange = (e) => { const {name,value}=e.target; setEditForm(prev=>({...prev,[name]:value})); };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg','image/jpg','image/png','image/webp'];
    if (!allowedTypes.includes(file.type)) { notify('Format image non supporté (jpg, png, webp)','error'); return; }
    if (file.size > 2 * 1024 * 1024) { notify('Image trop lourde (max 2MB)','error'); return; }
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('nom', editForm.nom || '');
      fd.append('prenom', editForm.prenom || '');
      fd.append('email', editForm.email || '');
      fd.append('telephone', editForm.telephone || '');
      fd.append('adresse', editForm.adresse || '');
      fd.append('sexe', editForm.sexe || '');
      fd.append('specialite', editForm.specialite || '');
      fd.append('salaire', editForm.salaire || '');
      fd.append('statut', editForm.statut || 'actif');
      fd.append('date_naissance', editForm.date_naissance ? editForm.date_naissance.slice(0,10) : '');
      if (photoFile) fd.append('photo', photoFile);

      await axios.put(`${API}/coachs/${coach.id_coach}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { data: refreshed } = await axios.get(`${API}/coachs/${coach.id_coach}`);
      setCoach(refreshed);
      setEditForm(refreshed);
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoFile(null);
      setPhotoPreview(null);
      setIsEditing(false);
      notify('Profil mis à jour avec succès');
    } catch (err) {
      console.error('Erreur sauvegarde:', err.response?.data || err.message);
      notify('Erreur lors de la mise à jour', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm(coach);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsEditing(false);
  };

  const today          = new Date().toISOString().slice(0,10);
  const seancesAVenir  = seances.filter(s=>s.date?.slice(0,10)>=today);
  const seancesPassees = seances.filter(s=>s.date?.slice(0,10)<today);

  if (loading) return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh',background:C.bgDark,color:C.textMuted,fontFamily:'Inter, sans-serif' }}>
      <div style={{ textAlign:'center' }}><Icon d={IC.clock} size={48} color={C.textMuted} /><p style={{ marginTop:20 }}>Chargement du profil…</p></div>
    </div>
  );

  if (!coach) return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh',background:C.bgDark,color:C.danger,fontFamily:'Inter, sans-serif' }}>
      <div style={{ textAlign:'center' }}>
        <Icon d={IC.warning} size={48} color={C.danger} />
        <p style={{ fontSize:18,fontWeight:600,marginTop:20 }}>Profil introuvable</p>
        <button onClick={()=>navigate('/coach/dashboard')} style={{ marginTop:24,padding:'12px 24px',background:C.primary,border:'none',borderRadius:12,color:'#fff',fontSize:14,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:8,margin:'24px auto 0' }}>
          <Icon d={IC.back} size={14} color="#fff" /> Retour au dashboard
        </button>
      </div>
    </div>
  );

  const spec=coach.specialite||'', col=SPEC_COLORS[spec]||{bg:C.surfaceAlt,color:C.textMuted,border:C.borderLight,gradient:`linear-gradient(135deg,${C.borderLight},${C.border})`};
  const isActif=coach.statut==='actif';

  return (
    <div style={{ minHeight:'100vh',background:C.bgDark,fontFamily:'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',paddingBottom:60 }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b)',padding:'28px 40px',position:'relative',overflow:'hidden' }}>
        <h1 style={{ fontSize:28,fontWeight:800,color:'#f1f5f9',margin:0,letterSpacing:'-0.5px',display:'flex',alignItems:'center',gap:12 }}>
          <Icon d={IC.user} size={26} color="#a78bfa" /> Mon Profil
        </h1>
        <p style={{ color:'rgba(255,255,255,.5)',marginTop:8,fontSize:14,margin:'8px 0 0' }}>Vos informations personnelles et professionnelles</p>
      </div>

      {/* Toast */}
      {message.text && (
        <div style={{ margin:'20px 40px 0',padding:'14px 20px',borderRadius:12,border:'1px solid',fontSize:14,fontWeight:600,
          background:message.type==='error'?'rgba(239,68,68,0.1)':'rgba(34,197,94,0.1)',
          borderColor:message.type==='error'?'#ef4444':'#22c55e', color:message.type==='error'?'#f87171':'#4ade80',
          display:'flex',alignItems:'center',gap:10 }}>
          <Icon d={message.type==='error'?IC.warning:IC.check} size={16} color={message.type==='error'?'#f87171':'#4ade80'} /> {message.text}
        </div>
      )}

      <div style={{ padding:'28px 40px',display:'grid',gridTemplateColumns:'1fr 2fr',gap:28 }}>

        {/* LEFT */}
        <div>
          <div style={{ background:C.surface,borderRadius:20,border:`1px solid ${C.border}`,padding:'32px 28px',textAlign:'center',boxShadow:'0 4px 20px rgba(0,0,0,0.3)',marginBottom:20 }}>
            <div style={{ marginBottom:20 }}><Avatar coach={coach} size={140} /></div>
            <h2 style={{ fontSize:22,fontWeight:700,color:C.text,margin:'0 0 8px' }}>{coach.prenom} {coach.nom}</h2>
            {spec && (
              <div style={{ marginBottom:12 }}>
                <span style={{ display:'inline-flex',alignItems:'center',gap:6,padding:'6px 16px',borderRadius:20,fontSize:12,fontWeight:700,background:col.bg,color:col.color,border:`1px solid ${col.border}` }}>
                  <Icon d={IC.medal} size={12} color={col.color} /> {spec}
                </span>
              </div>
            )}
            <div style={{ marginBottom:24 }}>
              <span style={{ padding:'6px 16px',borderRadius:20,fontSize:12,fontWeight:700,background:isActif?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)',border:`1px solid ${isActif?'#22c55e':'#ef4444'}`,color:isActif?'#22c55e':'#ef4444' }}>
                {isActif?'● Actif':'● Inactif'}
              </span>
            </div>
            <div style={{ padding:'10px 16px',background:C.surfaceAlt,borderRadius:10,border:`1px solid ${C.border}`,fontSize:13,color:C.textMuted,marginBottom:20,display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
              <Icon d={IC.id} size={14} color={C.textMuted} /> Coach <strong style={{ color:C.textLight }}>#{coach.id_coach}</strong>
            </div>
            <button onClick={()=>setIsEditing(true)} style={{ width:'100%',padding:'12px 20px',background:C.primary,border:'none',borderRadius:12,color:'#fff',fontSize:14,fontWeight:600,cursor:'pointer',transition:'all 0.2s',display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}
              onMouseEnter={e=>{ e.currentTarget.style.background=C.primaryDark; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=C.primary; e.currentTarget.style.transform='none'; }}>
              <Icon d={IC.edit} size={16} color="#fff" /> Modifier mon profil
            </button>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
            <StatCard icon={IC.calendar} value={seances.length}         label="Total séances"   color={C.purple}  />
            <StatCard icon={IC.clock}    value={seancesAVenir.length}   label="À venir"         color={C.info}    />
            <StatCard icon={IC.check}    value={seancesPassees.length}  label="Séances passées" color={C.success} />
            <StatCard icon={IC.dumbbell} value={seancesAVenir.filter(s=>s.date?.slice(0,10)===today).length} label="Aujourd'hui" color={C.warning} />
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {/* Infos personnelles */}
          <div style={{ background:C.surface,borderRadius:20,border:`1px solid ${C.border}`,padding:'28px 32px',marginBottom:24,boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize:18,fontWeight:700,color:C.text,margin:'0 0 20px',display:'flex',alignItems:'center',gap:10 }}>
              <Icon d={IC.list} size={18} color={C.primary} /> Informations personnelles
            </h3>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))',gap:12 }}>
              <InfoRow icon={IC.user}     label="Nom complet"       value={`${coach.prenom} ${coach.nom}`} />
              <InfoRow icon={IC.calendar} label="Date de naissance" value={coach.date_naissance?new Date(coach.date_naissance).toLocaleDateString('fr-FR'):null} />
              <InfoRow icon={IC.gender}   label="Sexe"              value={coach.sexe} />
              <InfoRow icon={IC.mail}     label="Email"             value={coach.email}     color={C.info} />
              <InfoRow icon={IC.phone}    label="Téléphone"         value={coach.telephone} />
              <InfoRow icon={IC.mapPin}   label="Adresse"           value={coach.adresse} />
            </div>
          </div>

          {/* Infos professionnelles */}
          <div style={{ background:C.surface,borderRadius:20,border:`1px solid ${C.border}`,padding:'28px 32px',marginBottom:24,boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize:18,fontWeight:700,color:C.text,margin:'0 0 20px',display:'flex',alignItems:'center',gap:10 }}>
              <Icon d={IC.work} size={18} color={C.success} /> Informations professionnelles
            </h3>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))',gap:12 }}>
              <InfoRow icon={IC.medal}  label="Spécialité" value={coach.specialite}                                            color={col.color} />
              <InfoRow icon={IC.money}  label="Salaire"    value={coach.salaire?`${fmt(coach.salaire)} MAD / mois`:null}       color={C.success} />
              <InfoRow icon={IC.check}  label="Statut"     value={isActif?'Actif':'Inactif'}                                  color={isActif?C.success:C.danger} />
              <InfoRow icon={IC.id}     label="ID Coach"   value={`#${coach.id_coach}`}                                        color={C.textMuted} />
            </div>
          </div>

          {/* Séances */}
          <div style={{ background:C.surface,borderRadius:20,border:`1px solid ${C.border}`,padding:'28px 32px',boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize:18,fontWeight:700,color:C.text,margin:'0 0 20px',display:'flex',alignItems:'center',gap:10 }}>
              <Icon d={IC.calendar} size={18} color={C.purple} /> Mes séances assignées ({seances.length})
            </h3>
            {seances.length===0 ? (
              <div style={{ textAlign:'center',padding:'40px 20px',color:C.textMuted }}>
                <Icon d={IC.inbox} size={40} color={C.textMuted} />
                <p style={{ margin:'12px 0 0',fontSize:14 }}>Aucune séance assignée</p>
              </div>
            ) : (
              <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                {seances.map(s=>{
                  const d=s.date?.slice(0,10), isToday=d===today, isFuture=d>today;
                  const statusCol=isToday?C.warning:isFuture?C.info:C.textMuted;
                  const statusLbl=isToday?"Aujourd'hui":isFuture?'À venir':'Passée';
                  return (
                    <div key={s.id_seance} style={{ display:'flex',alignItems:'center',gap:14,padding:'14px 18px',background:C.surfaceAlt,borderRadius:12,border:`1px solid ${C.border}`,transition:'all 0.2s',cursor:'pointer' }}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.primary+'40'; e.currentTarget.style.transform='translateX(4px)'; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='none'; }}
                      onClick={()=>navigate('/coach/seances')}>
                      <div style={{ width:40,height:40,borderRadius:10,background:col.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                        <Icon d={IC.dumbbell} size={18} color={col.color} />
                      </div>
                      <div style={{ flex:1 }}>
                        <p style={{ margin:'0 0 4px',fontSize:14,color:C.textLight,fontWeight:600 }}>{s.nom_sport}</p>
                        <p style={{ margin:0,fontSize:12,color:C.textMuted,display:'flex',alignItems:'center',gap:6 }}>
                          <Icon d={IC.calendar} size={11} color={C.textMuted} /> {d} à {s.heure}
                          &nbsp;|&nbsp; Capacité: {s.capacite}
                          &nbsp;|&nbsp; <Icon d={IC.stat} size={11} color={C.textMuted} /> {s.niveau||'Tous niveaux'}
                        </p>
                      </div>
                      <span style={{ padding:'4px 12px',borderRadius:20,fontSize:11,fontWeight:700,background:statusCol+'20',color:statusCol,border:`1px solid ${statusCol}40` }}>{statusLbl}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal édition */}
      {isEditing && (
        <div style={{ position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(8px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',overflow:'auto' }}>
          <div style={{ background:C.surface,borderRadius:20,border:`1px solid ${C.border}`,width:'100%',maxWidth:700,maxHeight:'90vh',overflow:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ padding:'24px 32px',borderBottom:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,background:C.surface,zIndex:10 }}>
              <h2 style={{ fontSize:20,fontWeight:700,color:C.text,margin:0,display:'flex',alignItems:'center',gap:10 }}>
                <Icon d={IC.edit} size={18} color={C.primary} /> Modifier mon profil
              </h2>
              <button onClick={handleCancel} style={{ background:'none',border:'none',color:C.textMuted,cursor:'pointer',padding:4,display:'flex',alignItems:'center',justifyContent:'center' }}
                onMouseEnter={e=>e.currentTarget.style.color=C.textLight}
                onMouseLeave={e=>e.currentTarget.style.color=C.textMuted}>
                <Icon d={IC.close} size={22} color="currentColor" />
              </button>
            </div>
            <div style={{ padding:'24px 32px' }}>

              {/* Upload photo */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:28 }}>
                <div style={{ position:'relative', marginBottom:12 }}>
                  <Avatar coach={coach} size={100} previewUrl={photoPreview} />
                  <label htmlFor="photo-upload" style={{ position:'absolute',bottom:-4,right:-4,width:32,height:32,borderRadius:'50%',background:C.primary,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',border:`2px solid ${C.surface}`,boxShadow:'0 2px 8px rgba(0,0,0,0.4)' }}
                    onMouseEnter={e=>e.currentTarget.style.background=C.primaryDark}
                    onMouseLeave={e=>e.currentTarget.style.background=C.primary}>
                    <Icon d={IC.camera} size={16} color="#fff" />
                  </label>
                  <input id="photo-upload" type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handlePhotoChange} style={{ display:'none' }} />
                </div>
                <span style={{ fontSize:12, color:C.textMuted }}>
                  {photoFile ? photoFile.name : "Cliquez sur l'icône pour changer la photo"}
                </span>
                <span style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>JPG, PNG ou WEBP — 2MB max</span>
              </div>

              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 20px' }}>
                <InputField label="Prénom"            name="prenom"          value={editForm.prenom}    onChange={handleEditChange} icon={<Icon d={IC.user} size={16} color={C.textMuted} />}     required />
                <InputField label="Nom"               name="nom"             value={editForm.nom}       onChange={handleEditChange} icon={<Icon d={IC.user} size={16} color={C.textMuted} />}     required />
                <InputField label="Email"             name="email"           value={editForm.email}     onChange={handleEditChange} icon={<Icon d={IC.mail} size={16} color={C.textMuted} />}     type="email" required />
                <InputField label="Téléphone"         name="telephone"       value={editForm.telephone} onChange={handleEditChange} icon={<Icon d={IC.phone} size={16} color={C.textMuted} />} />
                <InputField label="Date de naissance" name="date_naissance"  value={editForm.date_naissance?editForm.date_naissance.slice(0,10):''} onChange={handleEditChange} icon={<Icon d={IC.calendar} size={16} color={C.textMuted} />} type="date" />
                <InputField label="Sexe"              name="sexe"            value={editForm.sexe}      onChange={handleEditChange} icon={<Icon d={IC.gender} size={16} color={C.textMuted} />}  type="select" options={['Homme','Femme']} />
                <InputField label="Adresse"           name="adresse"         value={editForm.adresse}   onChange={handleEditChange} icon={<Icon d={IC.mapPin} size={16} color={C.textMuted} />} />
                <InputField label="Spécialité"        name="specialite"      value={editForm.specialite} onChange={handleEditChange} icon={<Icon d={IC.medal} size={16} color={C.textMuted} />}  type="select" options={Object.keys(SPEC_COLORS)} />
                <InputField label="Salaire (MAD)"     name="salaire"         value={editForm.salaire}   onChange={handleEditChange} icon={<Icon d={IC.money} size={16} color={C.textMuted} />}   type="number" />
              </div>
            </div>
            <div style={{ padding:'20px 32px',borderTop:`1px solid ${C.border}`,display:'flex',justifyContent:'flex-end',gap:12,position:'sticky',bottom:0,background:C.surface,zIndex:10 }}>
              <button onClick={handleCancel} style={{ padding:'10px 20px',background:'transparent',border:`1px solid ${C.border}`,borderRadius:10,color:C.textMuted,fontSize:14,fontWeight:600,cursor:'pointer',transition:'all 0.2s' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.textMuted; e.currentTarget.style.color=C.textLight; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMuted; }}>
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving} style={{ padding:'10px 24px',background:C.primary,border:'none',borderRadius:10,color:'#fff',fontSize:14,fontWeight:600,cursor:saving?'not-allowed':'pointer',opacity:saving?0.7:1,transition:'all 0.2s',display:'flex',alignItems:'center',gap:8 }}
                onMouseEnter={e=>{ if(!saving) e.currentTarget.style.background=C.primaryDark; }}
                onMouseLeave={e=>{ e.currentTarget.style.background=C.primary; }}>
                {saving
                  ? <><span style={{ display:'inline-block',width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />Enregistrement…</>
                  : <><Icon d={IC.save} size={16} color="#fff" /> Enregistrer</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}