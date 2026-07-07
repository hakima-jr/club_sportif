// src/pages/admin/coachs/ProfilCoach.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const C = { bgDark:'#0a0e1a', surface:'#111827', surfaceAlt:'#1a2234', border:'#1f2937', borderLight:'#374151', text:'#f8fafc', textMuted:'#94a3b8', textLight:'#cbd5e1', primary:'#6366f1', success:'#22c55e', danger:'#ef4444', warning:'#f59e0b', info:'#3b82f6', purple:'#8b5cf6', orange:'#f97316' };
const SPEC_COLORS = {
  Musculation:{bg:'#1e1b4b',color:'#a78bfa',border:'#4338ca',gradient:'linear-gradient(135deg,#4338ca,#6366f1)'},
  Cardio:{bg:'#1f2937',color:'#60a5fa',border:'#2563eb',gradient:'linear-gradient(135deg,#2563eb,#3b82f6)'},
  Yoga:{bg:'#132624',color:'#34d399',border:'#059669',gradient:'linear-gradient(135deg,#059669,#10b981)'},
  Boxe:{bg:'#3b1f1f',color:'#f87171',border:'#ef4444',gradient:'linear-gradient(135deg,#ef4444,#f87171)'},
  Natation:{bg:'#0c1e38',color:'#38bdf8',border:'#0284c7',gradient:'linear-gradient(135deg,#0284c7,#0ea5e9)'},
  Zumba:{bg:'#2e1a3a',color:'#e879f9',border:'#a21caf',gradient:'linear-gradient(135deg,#a21caf,#d946ef)'},
  Fitness:{bg:'#1c2e1a',color:'#86efac',border:'#16a34a',gradient:'linear-gradient(135deg,#16a34a,#22c55e)'},
  'Arts martiaux':{bg:'#2d2215',color:'#fbbf24',border:'#d97706',gradient:'linear-gradient(135deg,#d97706,#f59e0b)'},
};
const fmt = (n) => Number(n||0).toLocaleString('fr-MA');

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
  warning:  ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  mail:     ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6'],
  phone:    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.07 6.07l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  mapPin:   ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z','M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  calendar: ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  money:    ['M12 1v22','M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
  medal:    ['M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z','M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  chart:    ['M18 20V10','M12 20V4','M6 20v-6'],
  gender:   ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z'],
  id:       ['M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z'],
  list:     ['M8 6h13','M8 12h13','M8 18h13','M3 6h.01','M3 12h.01','M3 18h.01'],
  dumbbell: ['M6.5 6.5h11','M6.5 17.5h11','M3 9.5h3v5H3z','M18 9.5h3v5h-3z','M6 12h12'],
  inbox:    ['M22 12h-6l-2 3h-4l-2-3H2','M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
  clock:    ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 6v6l4 2'],
};

function Avatar({ coach, size = 120 }) {
  const initials = `${coach.nom?.[0]||''}${coach.prenom?.[0]||''}`.toUpperCase();
  const hue = ((coach.nom||'A').charCodeAt(0)*37)%360;
  if (coach.photo) return <img src={`${API}/uploads/${coach.photo}`} alt="profil" style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', border:`4px solid ${C.borderLight}`, flexShrink:0, boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }} />;
  return <div style={{ width:size, height:size, borderRadius:'50%', flexShrink:0, background:`hsl(${hue},55%,22%)`, border:`4px solid hsl(${hue},55%,40%)`, display:'flex', alignItems:'center', justifyContent:'center', color:`hsl(${hue},60%,78%)`, fontWeight:700, fontSize:size*0.4, userSelect:'none', boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>{initials}</div>;
}

function InfoRow({ iconKey, label, value, color = C.textLight }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'14px 18px', background:C.surfaceAlt, borderRadius:12, border:`1px solid ${C.border}`, transition:'all 0.2s', cursor:'default' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.borderLight; e.currentTarget.style.transform='translateX(4px)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='none'; }}>
      <div style={{ width:36, height:36, borderRadius:10, background:'rgba(99,102,241,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon d={IC[iconKey]} size={16} color={C.primary} />
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
    <div style={{ background:C.surfaceAlt, borderRadius:14, padding:'20px 24px', border:`1px solid ${C.border}`, textAlign:'center', transition:'all 0.2s' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=color+'40'; e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='none'; }}>
      <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}><Icon d={IC[iconKey]} size={28} color={color} /></div>
      <div style={{ fontSize:24, fontWeight:800, color, marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:12, color:C.textMuted, fontWeight:500 }}>{label}</div>
    </div>
  );
}

export default function ProfilCoach() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [coach,   setCoach]   = useState(null);
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text:'', type:'' });

  const notify = (text, type='success') => { setMessage({text,type}); setTimeout(()=>setMessage({text:'',type:''}),4000); };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const coachRes   = await axios.get(`${API}/coachs/${id}`);
        const seancesRes = await axios.get(`${API}/seances`);
        setCoach(coachRes.data);
        setSeances((seancesRes.data||[]).filter(s=>Number(s.id_coach)===Number(id)));
      } catch { notify('Erreur chargement profil','error'); }
      finally  { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:C.bgDark, color:C.textMuted, fontFamily:'Inter, sans-serif' }}>
      <div style={{ textAlign:'center' }}><Icon d={IC.clock} size={48} color={C.textMuted} /><p style={{ marginTop:20 }}>Chargement du profil…</p></div>
    </div>
  );

  if (!coach) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:C.bgDark, color:C.danger, fontFamily:'Inter, sans-serif' }}>
      <div style={{ textAlign:'center' }}>
        <Icon d={IC.warning} size={48} color={C.danger} />
        <p style={{ fontSize:18, fontWeight:600, marginTop:20 }}>Coach introuvable</p>
        <button onClick={()=>navigate('/admin/coachs')} style={{ marginTop:24, padding:'12px 24px', background:C.primary, border:'none', borderRadius:12, color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8, margin:'24px auto 0' }}>
          <Icon d={IC.back} size={14} color="#fff" /> Retour aux coachs
        </button>
      </div>
    </div>
  );

  const spec    = coach.specialite||'';
  const col     = SPEC_COLORS[spec] || { bg:C.surfaceAlt, color:C.textMuted, border:C.borderLight, gradient:`linear-gradient(135deg,${C.borderLight},${C.border})` };
  const isActif = coach.statut === 'actif';

  return (
    <div style={{ minHeight:'100vh', background:C.bgDark, fontFamily:'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', paddingBottom:60 }}>

      <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b)', padding:'28px 40px' }}>
        <button onClick={()=>navigate('/admin/coachs')} style={{ background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', borderRadius:10, color:'rgba(255,255,255,.8)', fontSize:13, padding:'8px 18px', cursor:'pointer', marginBottom:16, fontFamily:'inherit', fontWeight:500, display:'flex', alignItems:'center', gap:8 }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.2)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.1)'}>
          <Icon d={IC.back} size={14} color="rgba(255,255,255,.8)" /> Retour aux coachs
        </button>
        <h1 style={{ fontSize:28, fontWeight:800, color:'#f1f5f9', margin:0, letterSpacing:'-0.5px', display:'flex', alignItems:'center', gap:12 }}>
          <Icon d={IC.user} size={26} color="#a78bfa" /> Profil du Coach
        </h1>
        <p style={{ color:'rgba(255,255,255,.5)', marginTop:8, fontSize:14 }}>Informations détaillées de l'entraîneur</p>
      </div>

      {message.text && (
        <div style={{ margin:'20px 40px 0', padding:'14px 20px', borderRadius:12, border:'1px solid', fontSize:14, fontWeight:600, display:'flex', alignItems:'center', gap:10,
          background:message.type==='error'?'rgba(239,68,68,0.1)':'rgba(34,197,94,0.1)',
          borderColor:message.type==='error'?'#ef4444':'#22c55e', color:message.type==='error'?'#f87171':'#4ade80' }}>
          <Icon d={message.type==='error'?IC.warning:IC.check} size={16} color={message.type==='error'?'#f87171':'#4ade80'} /> {message.text}
        </div>
      )}

      <div style={{ padding:'28px 40px', display:'grid', gridTemplateColumns:'1fr 2fr', gap:28 }}>

        {/* Left — Profile Card */}
        <div>
          <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, padding:'32px 28px', textAlign:'center', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
            <div style={{ marginBottom:20 }}><Avatar coach={coach} size={140} /></div>
            <h2 style={{ fontSize:22, fontWeight:700, color:C.text, margin:'0 0 8px' }}>{coach.prenom} {coach.nom}</h2>
            {spec && (
              <div style={{ marginBottom:16 }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 16px', borderRadius:20, fontSize:12, fontWeight:700, background:col.bg, color:col.color, border:`1px solid ${col.border}` }}>
                  <Icon d={IC.medal} size={12} color={col.color} /> {spec}
                </span>
              </div>
            )}
            <div style={{ marginBottom:24 }}>
              <span style={{ padding:'6px 16px', borderRadius:20, fontSize:12, fontWeight:700, background:isActif?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)', border:`1px solid ${isActif?'#22c55e':'#ef4444'}`, color:isActif?'#22c55e':'#ef4444' }}>
                {isActif ? '● Actif' : '● Inactif'}
              </span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <button onClick={()=>navigate(`/admin/coachs/modifier/${id}`)} style={{ padding:'12px 24px', background:'linear-gradient(135deg,#4338ca,#6366f1)', border:'none', borderRadius:12, color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
                onMouseEnter={e=>e.currentTarget.style.boxShadow='0 4px 14px rgba(99,102,241,0.4)'}
                onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
                <Icon d={IC.edit} size={16} color="#fff" /> Modifier le profil
              </button>
              <button onClick={()=>navigate('/admin/coachs')} style={{ padding:'12px 24px', background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:12, color:C.textMuted, fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.borderLight; e.currentTarget.style.color=C.textLight; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMuted; }}>
                <Icon d={IC.back} size={14} color="currentColor" /> Retour à la liste
              </button>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:20 }}>
            <StatCard iconKey="dumbbell" value={seances.length}              label="Séances"      color={C.purple} />
            <StatCard iconKey="money"    value={`${fmt(coach.salaire)} MAD`} label="Salaire/mois" color={C.success} />
          </div>
        </div>

        {/* Right — Details */}
        <div>
          <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, padding:'28px 32px', marginBottom:24, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize:18, fontWeight:700, color:C.text, margin:'0 0 20px', display:'flex', alignItems:'center', gap:10 }}>
              <Icon d={IC.list} size={18} color={C.primary} /> Informations personnelles
            </h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:12 }}>
              <InfoRow iconKey="user"     label="Nom complet"       value={`${coach.prenom} ${coach.nom}`} />
              <InfoRow iconKey="calendar" label="Date de naissance" value={coach.date_naissance?new Date(coach.date_naissance).toLocaleDateString('fr-FR'):null} />
              <InfoRow iconKey="gender"   label="Sexe"              value={coach.sexe} />
              <InfoRow iconKey="mail"     label="Email"             value={coach.email} color={C.info} />
              <InfoRow iconKey="phone"    label="Téléphone"         value={coach.telephone} />
              <InfoRow iconKey="mapPin"   label="Adresse"           value={coach.adresse} />
            </div>
          </div>

          <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, padding:'28px 32px', marginBottom:24, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize:18, fontWeight:700, color:C.text, margin:'0 0 20px', display:'flex', alignItems:'center', gap:10 }}>
              <Icon d={IC.chart} size={18} color={C.success} /> Informations professionnelles
            </h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:12 }}>
              <InfoRow iconKey="medal"  label="Spécialité" value={coach.specialite} color={col.color} />
              <InfoRow iconKey="money"  label="Salaire"    value={`${fmt(coach.salaire)} MAD / mois`} color={C.success} />
              <InfoRow iconKey="check"  label="Statut"     value={isActif?'Actif':'Inactif'} color={isActif?C.success:C.danger} />
              <InfoRow iconKey="id"     label="ID Coach"   value={`#${coach.id_coach}`} color={C.textMuted} />
            </div>
          </div>

          <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, padding:'28px 32px', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize:18, fontWeight:700, color:C.text, margin:'0 0 20px', display:'flex', alignItems:'center', gap:10 }}>
              <Icon d={IC.calendar} size={18} color={C.purple} /> Séances assignées ({seances.length})
            </h3>
            {seances.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px 20px', color:C.textMuted }}>
                <Icon d={IC.inbox} size={40} color={C.textMuted} />
                <p style={{ margin:'12px 0 0', fontSize:14 }}>Aucune séance assignée</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {seances.map((s, i) => (
                  <div key={s.id_seance} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', background:C.surfaceAlt, borderRadius:12, border:`1px solid ${C.border}`, transition:'all 0.2s', cursor:'pointer' }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.primary+'40'; e.currentTarget.style.transform='translateX(4px)'; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='none'; }}
                    onClick={()=>navigate('/seances')}>
                    <div style={{ width:40, height:40, borderRadius:10, background:col.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Icon d={IC.dumbbell} size={18} color={col.color} />
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ margin:'0 0 4px', fontSize:14, color:C.textLight, fontWeight:600 }}>{s.nom_sport}</p>
                      <p style={{ margin:0, fontSize:12, color:C.textMuted, display:'flex', alignItems:'center', gap:6 }}>
                        <Icon d={IC.calendar} size={11} color={C.textMuted} /> {s.date?.slice(0,10)} à {s.heure}
                        &nbsp;|&nbsp; Cap: {s.capacite} &nbsp;|&nbsp; {s.niveau||'Tous niveaux'}
                      </p>
                    </div>
                    <Icon d={IC.back} size={18} color={C.primary} style={{ transform:'rotate(180deg)' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}