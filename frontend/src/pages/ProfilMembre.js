// src/pages/ProfilMembre.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMemberById, getAbonnements, getPaiementsByMembre, updateMember } from '../api/api';

const C = { bgDark:'#0a0e1a', surface:'#111827', surfaceAlt:'#1a2234', border:'#1f2937', borderLight:'#374151', text:'#f8fafc', textMuted:'#94a3b8', textLight:'#cbd5e1', primary:'#6366f1', success:'#22c55e', danger:'#ef4444', warning:'#f59e0b', info:'#3b82f6', purple:'#8b5cf6', orange:'#f97316', cyan:'#06b6d4' };

function Icon({ d, size = 18, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}
const IC = {
  back:     ['M19 12H5','M12 5l-7 7 7 7'],
  user:     ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  edit:     ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  check:    'M20 6L9 17l-5-5',
  close:    ['M18 6L6 18','M6 6l12 12'],
  warning:  ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  mail:     ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6'],
  phone:    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.07 6.07l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  mapPin:   ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z','M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  calendar: ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  weight:   ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M8 12h8','M12 8v8'],
  ruler:    ['M5 3l14 14','M5 3h4','M5 3v4','M19 17h-4','M19 17v-4'],
  target:   ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z','M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z','M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
  trophy:   ['M6 9H3V4h3','M18 9h3V4h-3','M6 4h12v8a6 6 0 0 1-12 0V4z','M9 21h6','M12 17v4'],
  id:       ['M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z'],
  gender:   ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z'],
  camera:   ['M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2 2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z','M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  payment:  ['M1 10h22','M2 5h20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z'],
  sub:      ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6'],
  save:     ['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z','M17 21v-8H7v8','M7 3v5h8'],
  note:     ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8','M10 9H8'],
  clock:    ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 6v6l4 2'],
  inbox:    ['M22 12h-6l-2 3h-4l-2-3H2','M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
};

const calculateAge = (d) => { if (!d) return null; const b=new Date(d), t=new Date(), a=t.getFullYear()-b.getFullYear(); return (t.getMonth()-b.getMonth()<0||(t.getMonth()-b.getMonth()===0&&t.getDate()<b.getDate()))?a-1:a; };
const calculateBMI = (p,t) => { if (!p||!t||t===0) return null; return (p/(t/100)**2).toFixed(1); };
const getBMICategory = (bmi) => { if (!bmi) return ''; const v=parseFloat(bmi); if(v<18.5) return {label:'Insuffisance pondérale',color:'#f59e0b'}; if(v<25) return {label:'Poids normal',color:'#22c55e'}; if(v<30) return {label:'Surpoids',color:'#f97316'}; return {label:'Obésité',color:'#ef4444'}; };

function InfoRow({ iconKey, label, value, color = '#cbd5e1' }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'14px 18px', background:'#1a2234', borderRadius:12, border:'1px solid #1f2937', transition:'all 0.2s', cursor:'default' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor='#374151'; e.currentTarget.style.transform='translateX(4px)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor='#1f2937'; e.currentTarget.style.transform='none'; }}>
      <div style={{ width:34, height:34, borderRadius:10, background:'rgba(99,102,241,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon d={IC[iconKey]} size={15} color={C.primary} />
      </div>
      <div style={{ flex:1 }}>
        <p style={{ margin:'0 0 4px', fontSize:11, color:C.textMuted, fontWeight:600, textTransform:'uppercase', letterSpacing:0.8 }}>{label}</p>
        <p style={{ margin:0, fontSize:15, color, fontWeight:500, wordBreak:'break-word' }}>{value||'—'}</p>
      </div>
    </div>
  );
}

function StatCard({ iconKey, value, label, color }) {
  return (
    <div style={{ background:'#0f1117', borderRadius:14, padding:'20px 24px', border:'1px solid #1f2937', textAlign:'center', transition:'all 0.2s' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=color+'40'; e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor='#1f2937'; e.currentTarget.style.transform='none'; }}>
      <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}><Icon d={IC[iconKey]} size={28} color={color} /></div>
      <div style={{ fontSize:20, fontWeight:800, color, marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:12, color:C.textMuted, fontWeight:500 }}>{label}</div>
    </div>
  );
}

function EmptyState({ iconKey, text }) {
  return (
    <div style={{ textAlign:'center', padding:'60px 20px', background:C.surface, borderRadius:16, border:`1px solid ${C.border}` }}>
      <Icon d={IC[iconKey]} size={48} color={C.textMuted} />
      <p style={{ color:C.textMuted, margin:'16px 0 0', fontSize:16 }}>{text}</p>
    </div>
  );
}

export default function ProfilMembre() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [membre,      setMembre]      = useState(null);
  const [abonnements, setAbonnements] = useState([]);
  const [paiements,   setPaiements]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [photo,       setPhoto]       = useState(null);
  const [activeTab,   setActiveTab]   = useState('info');
  const [message,     setMessage]     = useState({ text:'', type:'' });
  const [isEditing,   setIsEditing]   = useState(false);
  const [editData,    setEditData]    = useState({});

  const notify = (text, type='success') => { setMessage({text,type}); setTimeout(()=>setMessage({text:'',type:''}),3000); };

  useEffect(() => {
    setLoading(true);
    // Hna ila makanch l-id f url (bhal ila l-membre deخل l /profil dyalo ddirect), n-akhdo id dyal m l-localStorage
    const currentUserId = id || JSON.parse(localStorage.getItem('user') || '{}').id_membre || JSON.parse(localStorage.getItem('user') || '{}').id_personne || JSON.parse(localStorage.getItem('user') || '{}').id;
    
    if (!currentUserId) {
      notify('ID Introuvable', 'error');
      setLoading(false);
      return;
    }

    Promise.all([getMemberById(currentUserId), getAbonnements(), getPaiementsByMembre(currentUserId)])
      .then(([memRes, aboRes, paiRes]) => {
        const d = { 
          ...memRes.data, 
          poids:memRes.data.poids||'', 
          taille:memRes.data.taille||'', 
          objectif:memRes.data.objectif||'', 
          notes:memRes.data.notes||'',
          date_naissance:memRes.data.date_naissance?.slice(0,10)||'' 
        };
        setMembre(d); setEditData(d);
        setAbonnements(aboRes.data.filter(a => String(a.id_membre) === String(currentUserId)));
        setPaiements(paiRes.data||[]);
        const saved = localStorage.getItem(`member_photo_${currentUserId}`);
        if (saved) setPhoto(saved);
      })
      .catch(()=>notify('Erreur chargement profil','error'))
      .finally(()=>setLoading(false));
  }, [id]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const currentUserId = id || membre?.id_personne || membre?.id;
    if (file && currentUserId) { 
      const r=new FileReader(); 
      r.onloadend=()=>{ 
        setPhoto(r.result); 
        localStorage.setItem(`member_photo_${currentUserId}`, r.result); 
        window.dispatchEvent(new Event('user-profile-updated')); // n-fiyqo Layout bach t-chof sora jdida
        notify('Photo mise à jour'); 
      }; 
      r.readAsDataURL(file); 
    }
  };

  const handleSaveProfile = async () => {
    try {
      const currentUserId = id || membre?.id_personne || membre?.id;
      const payload = { 
        ...editData, 
        poids: editData.poids ? parseFloat(editData.poids) : null, 
        taille: editData.taille ? parseInt(editData.taille) : null,
        date_naissance: editData.date_naissance ? editData.date_naissance.slice(0,10) : null
      };
      await updateMember(currentUserId, payload);
      const refreshed = await getMemberById(currentUserId);
      const d = { ...refreshed.data, poids:refreshed.data.poids||'', taille:refreshed.data.taille||'', objectif:refreshed.data.objectif||'', notes:refreshed.data.notes||'', date_naissance:refreshed.data.date_naissance?.slice(0,10)||'' };
      
      setMembre(d); 
      setEditData(d); 
      setIsEditing(false); 
      notify('Profil mis à jour');

      // T-gadd l-ism dyal l-user li mconnecti direct f l-localStorage f blasa wahda
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, prenom: d.prenom, nom: d.nom, email: d.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Hna kantsifto l-Event bach Layout i-gadd l-ism dik ssa3a
      window.dispatchEvent(new Event('user-profile-updated'));
      
    } catch { notify('Erreur lors de la mise à jour','error'); }
  };

  if (loading) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', color:C.textMuted, fontFamily:'Inter, sans-serif', background:C.bgDark }}>
      <Icon d={IC.clock} size={48} color={C.textMuted} /><p style={{ marginTop:20 }}>Chargement du profil…</p>
    </div>
  );

  if (!membre) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', color:C.danger, fontFamily:'Inter, sans-serif', background:C.bgDark }}>
      <Icon d={IC.warning} size={48} color={C.danger} />
      <p style={{ fontSize:18, fontWeight:600, marginTop:20 }}>Membre non trouvé</p>
    </div>
  );

  const initials    = `${membre.nom?.[0]||''}${membre.prenom?.[0]||''}`.toUpperCase();
  const age         = calculateAge(membre.date_naissance);
  const bmi         = calculateBMI(membre.poids, membre.taille);
  const bmiCategory = getBMICategory(bmi);
  const aboActif    = abonnements.find(a=>new Date(a.date_fin)>=new Date());
  const memberSince = new Date(membre.date_inscription || Date.now()).getFullYear();

  const tabs = [
    { key:'info',        label:'Informations', iconKey:'user' },
    { key:'abonnements', label:'Abonnements',  iconKey:'sub'  },
    { key:'paiements',   label:'Paiements',    iconKey:'payment' },
  ];

  const inputStyle = { width:'100%', padding:'10px 14px', background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:10, color:C.textLight, fontSize:14, outline:'none', boxSizing:'border-box' };

  return (
    <div style={{ fontFamily:'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight:'100vh', background:C.bgDark, paddingBottom: 40 }}>

      {message.text && (
        <div style={{ position:'fixed', top:20, right:20, padding:'14px 20px', borderRadius:12, border:'1px solid', fontSize:14, fontWeight:600, zIndex:9999, display:'flex', alignItems:'center', gap:10,
          background:message.type==='error'?'rgba(239,68,68,0.1)':'rgba(34,197,94,0.1)',
          borderColor:message.type==='error'?'#ef4444':'#22c55e', color:message.type==='error'?'#f87171':'#4ade80' }}>
          <Icon d={message.type==='error'?IC.warning:IC.check} size={14} color={message.type==='error'?'#f87171':'#4ade80'} /> {message.text}
        </div>
      )}

      {/* Hero Banner */}
      <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b)', padding:'40px 40px 32px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', gap:32, flexWrap:'wrap' }}>
          {/* Avatar */}
          <div style={{ position:'relative', width:120, height:120, flexShrink:0 }}>
            {photo ? (
              <img src={photo} alt="profil" style={{ width:120, height:120, borderRadius:'50%', objectFit:'cover', border:'4px solid #6366f1', boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }} />
            ) : (
              <div style={{ width:120, height:120, borderRadius:'50%', background:'linear-gradient(135deg,#4338ca,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:42, fontWeight:700, color:'#fff', border:'4px solid rgba(255,255,255,.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>{initials}</div>
            )}
            <label style={{ position:'absolute', bottom:2, right:2, background:C.primary, borderRadius:'50%', width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }} title="Changer la photo">
              <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display:'none' }} />
              <Icon d={IC.camera} size={16} color="#fff" />
            </label>
          </div>
          {/* Info */}
          <div style={{ flex:1, minWidth:200 }}>
            <h1 style={{ fontSize:28, fontWeight:800, margin:'0 0 10px', color:'#fff', letterSpacing:'-0.5px' }}>{membre.prenom} {membre.nom}</h1>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:8 }}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 16px', borderRadius:20, fontSize:13, fontWeight:600, background:aboActif?'rgba(34,197,94,0.2)':'rgba(239,68,68,0.2)', border:`1px solid ${aboActif?'#22c55e':'#ef4444'}`, color:aboActif?'#4ade80':'#f87171' }}>
                <Icon d={aboActif?IC.check:IC.close} size={12} color={aboActif?'#4ade80':'#f87171'} />
                {aboActif ? 'Abonnement Actif' : "Pas d'abonnement"}
              </span>
              {age && <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 16px', borderRadius:20, fontSize:13, fontWeight:600, background:'rgba(59,130,246,0.2)', border:'1px solid #3b82f6', color:'#60a5fa' }}>
                <Icon d={IC.calendar} size={12} color="#60a5fa" /> {age} ans
              </span>}
            </div>
            <p style={{ color:'rgba(255,255,255,.5)', fontSize:13, marginTop:8 }}>Membre depuis {memberSince} | ID: #{membre.id_personne || membre.id}</p>
          </div>
          
          <div style={{ display:'flex', gap:10 }}>
            {isEditing && (
              <button onClick={handleSaveProfile} style={{ padding:'12px 24px', background:'linear-gradient(135deg,#15803d,#16a34a)', border:'none', borderRadius:12, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:8 }}>
                <Icon d={IC.save} size={16} color="#fff" /> Enregistrer
              </button>
            )}
            <button onClick={() => { if(isEditing){ setEditData({...membre}); } setIsEditing(!isEditing); }} style={{ padding:'12px 24px', background:isEditing?'rgba(239,68,68,0.2)':'rgba(99,102,241,0.2)', border:`1px solid ${isEditing?'#ef4444':'#6366f1'}`, borderRadius:12, color:isEditing?'#f87171':'#a5b4fc', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:8 }}>
              <Icon d={isEditing?IC.close:IC.edit} size={16} color={isEditing?'#f87171':'#a5b4fc'} />
              {isEditing ? 'Annuler' : 'Modifier le profil'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'0 40px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', gap:4 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={()=>setActiveTab(t.key)} style={{ padding:'16px 24px', background:'transparent', border:'none', color:activeTab===t.key?C.primary:C.textMuted, cursor:'pointer', fontSize:14, fontWeight:600, fontFamily:'inherit', borderBottom:`3px solid ${activeTab===t.key?C.primary:'transparent'}`, transition:'all 0.15s', display:'flex', alignItems:'center', gap:8 }}>
              <Icon d={IC[t.iconKey]} size={16} color={activeTab===t.key?C.primary:C.textMuted} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:1200, margin:'28px auto', padding:'0 40px' }}>

        {/* INFO TAB */}
        {activeTab === 'info' && (
          <div>
            {/* Physical Stats */}
            <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, padding:'28px 32px', marginBottom:24, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
              <h3 style={{ fontSize:18, fontWeight:700, color:C.text, margin:'0 0 20px', display:'flex', alignItems:'center', gap:10 }}>
                <Icon d={IC.weight} size={18} color={C.warning} /> Données Physiques
              </h3>
              {isEditing ? (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:16 }}>
                  {[['poids','Poids (kg)','number','70'],['taille','Taille (cm)','number','175']].map(([k,l,t,ph]) => (
                    <div key={k}><label style={{ color:C.textMuted, fontSize:12, fontWeight:600, marginBottom:8, display:'block' }}>{l}</label>
                      <input type={t} value={editData[k]||''} style={inputStyle} placeholder={`Ex: ${ph}`} onChange={e=>setEditData({...editData,[k]:e.target.value})} />
                    </div>
                  ))}
                  <div><label style={{ color:C.textMuted, fontSize:12, fontWeight:600, marginBottom:8, display:'block' }}>Objectif</label>
                    <select value={editData.objectif||''} style={inputStyle} onChange={e=>setEditData({...editData,objectif:e.target.value})}>
                      <option value="">-- Sélectionner --</option>
                      <option value="Perte de poids">Perte de poids</option><option value="Prise de masse">Prise de masse</option>
                      <option value="Maintien">Maintien</option><option value="Performance">Performance</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:16 }}>
                  <StatCard iconKey="weight" value={`${membre.poids||'—'} kg`}  label="Poids"    color={C.warning} />
                  <StatCard iconKey="ruler"  value={`${membre.taille||'—'} cm`} label="Taille"   color={C.info}    />
                  <StatCard iconKey="target" value={bmi||'—'}                   label="IMC"      color={bmiCategory?.color||C.textMuted} />
                  <StatCard iconKey="trophy" value={membre.objectif||'—'}       label="Objectif" color={C.success}  />
                </div>
              )}
            </div>

            {/* Personal Info */}
            <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, padding:'28px 32px', marginBottom:24, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
              <h3 style={{ fontSize:18, fontWeight:700, color:C.text, margin:'0 0 20px', display:'flex', alignItems:'center', gap:10 }}>
                <Icon d={IC.note} size={18} color={C.primary} /> Informations Personnelles
              </h3>
              {isEditing ? (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16 }}>
                  {[['nom','Nom','text'],['prenom','Prénom','text'],['email','Email','email'],['telephone','Téléphone','text'],['adresse','Adresse','text']].map(([k,l,t]) => (
                    <div key={k}><label style={{ color:C.textMuted, fontSize:12, fontWeight:600, marginBottom:8, display:'block' }}>{l}</label>
                      <input type={t} value={editData[k]||''} style={inputStyle} onChange={e=>setEditData({...editData,[k]:e.target.value})} />
                    </div>
                  ))}
                  <div><label style={{ color:C.textMuted, fontSize:12, fontWeight:600, marginBottom:8, display:'block' }}>Date de naissance</label>
                    <input type="date" value={editData.date_naissance||''} style={inputStyle} onChange={e=>setEditData({...editData,date_naissance:e.target.value})} />
                  </div>
                  <div><label style={{ color:C.textMuted, fontSize:12, fontWeight:600, marginBottom:8, display:'block' }}>Sexe</label>
                    <select value={editData.sexe||''} style={inputStyle} onChange={e=>setEditData({...editData,sexe:e.target.value})}>
                      <option value="">-- Sélectionner --</option><option value="Homme">Homme</option><option value="Femme">Femme</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:16 }}>
                  <InfoRow iconKey="user"     label="Nom complet"       value={`${membre.prenom} ${membre.nom}`} />
                  <InfoRow iconKey="mail"     label="Email"             value={membre.email} color={C.info} />
                  <InfoRow iconKey="phone"    label="Téléphone"         value={membre.telephone||'—'} />
                  <InfoRow iconKey="mapPin"   label="Adresse"           value={membre.adresse||'—'} />
                  <InfoRow iconKey="calendar" label="Date naissance"    value={membre.date_naissance?new Date(membre.date_naissance).toLocaleDateString('fr-FR'):'—'} />
                  <InfoRow iconKey="gender"   label="Sexe"              value={membre.sexe||'—'} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABONNEMENTS TAB */}
        {activeTab === 'abonnements' && (
          abonnements.length === 0 ? <EmptyState iconKey="inbox" text="Aucun abonnement trouvé" /> : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {abonnements.map((abo, i) => {
                const isActif = new Date(abo.date_fin) >= new Date();
                return (
                  <div key={i} style={{ background:C.surface, borderRadius:16, padding:'24px 28px', display:'flex', justifyContent:'space-between', alignItems:'center', border:`1px solid ${C.border}` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:18 }}>
                      <div style={{ width:52, height:52, borderRadius:14, background:isActif?'linear-gradient(135deg,#15803d,#16a34a)':'linear-gradient(135deg,#7f1d1d,#dc2626)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Icon d={IC.sub} size={24} color="#fff" />
                      </div>
                      <div>
                        <p style={{ margin:'0 0 6px', fontSize:17, color:C.text, fontWeight:700 }}>{abo.type}</p>
                        <p style={{ margin:0, fontSize:13, color:C.textMuted }}>
                          {new Date(abo.date_debut).toLocaleDateString('fr-FR')} → {new Date(abo.date_fin).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <p style={{ margin:'0 0 8px', fontSize:22, fontWeight:800, color:C.primary }}>{abo.prix} MAD</p>
                      <span style={{ padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:700, background:isActif?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)', color:isActif?'#22c55e':'#ef4444' }}>
                        {isActif?'● Actif':'● Expiré'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* PAIEMENTS TAB */}
        {activeTab === 'paiements' && (
          paiements.length === 0 ? <EmptyState iconKey="inbox" text="Aucun paiement trouvé" /> : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {paiements.map((pai, i) => (
                <div key={i} style={{ background:C.surface, borderRadius:16, padding:'24px 28px', display:'flex', justifyContent:'space-between', alignItems:'center', border:`1px solid ${C.border}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:18 }}>
                    <div style={{ width:52, height:52, borderRadius:14, background:pai.statut==='Payé'?'linear-gradient(135deg,#15803d,#16a34a)':'linear-gradient(135deg,#7c2d12,#dc2626)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon d={IC.payment} size={24} color="#fff" />
                    </div>
                    <div>
                      <p style={{ margin:'0 0 6px', fontSize:17, color:C.text, fontWeight:700 }}>{pai.mode_paiement}</p>
                      <p style={{ margin:0, fontSize:13, color:C.textMuted }}>{new Date(pai.date_paiement).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ margin:'0 0 8px', fontSize:22, fontWeight:800, color:C.success }}>{pai.montant} MAD</p>
                    <span style={{ padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:700, background:'rgba(34,197,94,0.15)', color:'#22c55e' }}>
                      {pai.statut}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}