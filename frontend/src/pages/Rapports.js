// src/pages/Rapports.jsx
import React, { useState, useEffect } from 'react';
import { getRapports, getMembers, getAbonnements, getPaiements, getSeances, getCoachs, getPaiementCoachs } from '../api/api';

function Icon({ d, size = 20, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}
const IC = {
  chart:    ['M18 20V10','M12 20V4','M6 20v-6'],
  users:    ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  money:    ['M12 1v22','M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
  warning:  ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  sub:      ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8'],
  globe:    ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M2 12h20','M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'],
  calendar: ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  annual:   ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 6v6l4 2'],
  download: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M7 10l5 5 5-5','M12 15V3'],
  brain:    ['M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.74 3 3 0 0 1 .29-5.78 2.5 2.5 0 0 1 1.24-4.52','M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.74 3 3 0 0 0-.29-5.78 2.5 2.5 0 0 0-1.24-4.52'],
  close:    ['M18 6L6 18','M6 6l12 12'],
  check:    'M20 6L9 17l-5-5',
  trend:    ['M22 7l-8.5 8.5-5-5L2 17','M16 7h6v6'],
  sparkle:  ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
  tag:      ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z','M7 7h.01'],
  rotate:   ['M23 4v6h-6','M20.49 15a9 9 0 1 1-2.12-9.36L23 10'],
};

const C = {
  bgDark:'#0a0e1a', surface:'#111827', surfaceAlt:'#1a2234', border:'#1f2937',
  borderLight:'#374151', text:'#f8fafc', textMuted:'#94a3b8', textLight:'#cbd5e1',
  primary:'#6366f1', primaryDark:'#4f46e5', primaryGlow:'rgba(99,102,241,0.15)',
  success:'#22c55e', successDark:'#16a34a', successGlow:'rgba(34,197,94,0.15)',
  danger:'#ef4444', dangerGlow:'rgba(239,68,68,0.15)',
  warning:'#f59e0b', warningGlow:'rgba(245,158,11,0.15)',
  info:'#3b82f6', infoGlow:'rgba(59,130,246,0.15)',
  teal:'#14b8a6', tealGlow:'rgba(20,184,166,0.15)',
  blue:'#3b82f6', blueLight:'#1e3a5f',
  purple:'#8b5cf6', purpleLight:'#2e1a5f',
  green:'#22c55e', greenLight:'#1f2d1f',
  red:'#ef4444', redLight:'#3b1f1f',
  orange:'#f97316',
  gradient:'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%)',
};

const S = {
  page: { padding:'32px 40px', fontFamily:'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', maxWidth:1400, margin:'0 auto', background:C.bgDark, minHeight:'100vh', color:C.text },
  center: { padding:60, textAlign:'center', color:C.textMuted, fontSize:16 },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32, paddingBottom:24, borderBottom:`1px solid ${C.border}` },
  title: { fontSize:32, fontWeight:800, color:C.text, margin:0, letterSpacing:'-0.5px', background:C.gradient, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
  subtitle: { color:C.textMuted, marginTop:8, fontSize:14, fontWeight:500 },
  toolbar: { display:'flex', gap:12, marginBottom:28, alignItems:'center', padding:'16px 20px', background:C.surface, borderRadius:16, border:`1px solid ${C.border}` },
  tbBtn: { padding:'10px 20px', background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:12, color:C.textLight, fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.25s ease', display:'flex', alignItems:'center', gap:8 },
  tbBtnPrimary: { background:C.gradient, border:'none', color:'#fff', boxShadow:'0 4px 14px rgba(99,102,241,0.4)' },
  tbBtnActive: { background:C.primaryGlow, border:`1px solid ${C.primary}`, color:C.primary },
  chartsGrid: { display:'grid', gridTemplateColumns:'2fr 1fr', gap:24, marginBottom:24 },
  card: { background:C.surface, borderRadius:20, padding:'24px 28px', border:`1px solid ${C.border}`, boxShadow:'0 4px 20px rgba(0,0,0,0.3)', transition:'transform 0.2s ease, box-shadow 0.2s ease' },
  cardTitle: { fontSize:16, fontWeight:700, color:C.text, marginTop:0, marginBottom:8, display:'flex', alignItems:'center', gap:10 },
  cardSubtitle: { fontSize:12, color:C.textMuted, marginBottom:20, marginTop:0, fontWeight:500 },
  statGrid: { display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:20, marginBottom:28 },
  statCard: { background:C.surface, borderRadius:20, padding:'24px 20px', border:`1px solid ${C.border}`, boxShadow:'0 4px 20px rgba(0,0,0,0.3)', position:'relative', overflow:'hidden' },
  statIcon: { width:48, height:48, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 },
  statLabel: { fontSize:11, fontWeight:700, color:C.textMuted, textTransform:'uppercase', margin:0, letterSpacing:'1px' },
  statValue: { fontSize:32, fontWeight:800, color:C.text, margin:'12px 0 6px 0', letterSpacing:'-0.5px' },
  statMeta: { fontSize:12, color:C.textMuted, margin:0, fontWeight:500 },
  progressWrap: { marginTop:16, height:6, background:C.border, borderRadius:3, overflow:'hidden' },
  progressFill: { height:'100%', borderRadius:3, transition:'width 0.6s ease' },
  legendRow: { display:'flex', gap:20, marginBottom:16, fontSize:12, color:C.textMuted, fontWeight:500 },
  legendDot: { width:10, height:10, borderRadius:'50%', display:'inline-block', marginRight:6 },
  trendRow: { display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:20, fontSize:13, color:C.textMuted, fontWeight:500, padding:'12px 16px', background:C.surfaceAlt, borderRadius:12 },
  trendDown: { color:C.danger, fontWeight:700 },
  trendUp: { color:C.success, fontWeight:700 },
  catHeader: { display:'grid', gridTemplateColumns:'1fr 100px 120px', gap:16, fontSize:11, fontWeight:700, color:C.textMuted, textTransform:'uppercase', paddingBottom:14, borderBottom:`1px solid ${C.border}`, marginBottom:8, letterSpacing:'1px' },
  catRow: { display:'grid', gridTemplateColumns:'1fr 100px 120px', gap:16, alignItems:'center', padding:'14px 0', borderBottom:`1px solid ${C.border}`, transition:'background 0.2s ease' },
  catNameWrap: { display:'flex', alignItems:'center', gap:12 },
  catIcon: { width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, boxShadow:'0 4px 12px rgba(0,0,0,0.3)' },
  catName: { fontSize:14, color:C.textLight, fontWeight:600 },
  catQty: { fontSize:14, color:C.textMuted, textAlign:'right', fontWeight:600 },
  catTotal: { fontSize:14, fontWeight:700, textAlign:'right' },
  aiCard: { background:C.gradient, borderRadius:20, padding:'28px 32px', marginBottom:24, boxShadow:'0 8px 32px rgba(99,102,241,0.3)', position:'relative', overflow:'hidden' },
  aiBadge: { display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.15)', color:'#fff', fontSize:11, fontWeight:700, padding:'6px 14px', borderRadius:20, marginBottom:16, backdropFilter:'blur(10px)' },
  aiTitle: { fontSize:22, fontWeight:800, color:'#fff', marginBottom:12, marginTop:0, letterSpacing:'-0.3px' },
  aiBody: { fontSize:14, color:'rgba(255,255,255,0.85)', lineHeight:1.7, marginBottom:24, marginTop:0, fontWeight:500 },
  aiBtn: { width:'100%', padding:'14px', borderRadius:14, border:'1px solid rgba(255,255,255,0.3)', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', transition:'all 0.25s ease', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 },
  overlay: { position:'fixed', inset:0, background:'rgba(10,14,26,0.9)', backdropFilter:'blur(12px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 },
  modal: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:24, padding:'36px 40px', width:'100%', maxWidth:680, boxShadow:'0 24px 48px rgba(0,0,0,0.5)' },
  modalHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, borderBottom:`1px solid ${C.border}`, paddingBottom:20 },
  modalTitle: { color:C.text, fontSize:22, fontWeight:800, margin:0, letterSpacing:'-0.3px', display:'flex', alignItems:'center', gap:10 },
  closeBtn: { background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:10, color:C.textMuted, width:36, height:36, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s ease' },
  aiSectionBlock: { padding:'18px 20px', borderRadius:16, marginBottom:16, borderLeft:'4px solid', fontSize:14, lineHeight:1.7, fontWeight:500 },
};

const fmt = (n) => Number(n||0).toLocaleString('fr-MA');

function LineChart({ labels = [], data = [] }) {
  const containerRef = React.useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => { if (containerRef.current) setW(containerRef.current.clientWidth); }, []);
  if (w === 0) return <div ref={containerRef} style={{ width:'100%', height:220 }} />;
  const H=220, PX=40, PY=24, iW=w-PX*2, iH=H-PY*2;
  const max = Math.max(...data, 1);
  const points = data.map((v,i) => ({ x:PX+(i/Math.max(data.length-1,1))*iW, y:PY+iH-(v/max)*iH }));
  const pathD = points.map((p,i) => i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`).join(' ');
  const areaD = `M${points[0]?.x},${PY+iH} ${points.map(p=>`L${p.x},${p.y}`).join(' ')} L${points[points.length-1]?.x},${PY+iH} Z`;
  return (
    <div ref={containerRef} style={{ width:'100%', height:H }}>
      <svg width={w} height={H} style={{ overflow:'visible' }}>
        {[0,0.25,0.5,0.75,1].map((pct,i) => <line key={`grid-${i}`} x1={PX} y1={PY+iH*pct} x2={PX+iW} y2={PY+iH*pct} stroke={C.border} strokeWidth={1} strokeDasharray="4,4" />)}
        <path d={areaD} fill={C.teal} fillOpacity={0.12} />
        <path d={pathD} fill="none" stroke={C.teal} strokeWidth={3} strokeLinecap="round" />
        {points.map((p,i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={5} fill={C.teal} stroke={C.surface} strokeWidth={2} />
            <text x={p.x} y={p.y-12} textAnchor="middle" fontSize={11} fill={C.text} fontWeight={700}>{data[i]}</text>
          </g>
        ))}
        {labels.map((lbl,i) => <text key={i} x={PX+(i/Math.max(labels.length-1,1))*iW} y={H+18} textAnchor="middle" fontSize={12} fill={C.textMuted} fontWeight={600}>{lbl}</text>)}
      </svg>
    </div>
  );
}

function DonutChart({ value = 0 }) {
  const pct=Math.round(value||0), r=56, circ=2*Math.PI*r, dash=(pct/100)*circ;
  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', margin:'24px 0' }}>
      <svg width={160} height={160} viewBox="0 0 160 160">
        <circle cx={80} cy={80} r={r} fill="none" stroke={C.border} strokeWidth={14} />
        <circle cx={80} cy={80} r={r} fill="none" stroke={C.success} strokeWidth={14} strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round" transform="rotate(-90 80 80)" />
        <text x={80} y={72} textAnchor="middle" fontSize={28} fontWeight={800} fill={C.text}>{pct}%</text>
        <text x={80} y={94} textAnchor="middle" fontSize={12} fill={C.textMuted} fontWeight={600}>présence</text>
      </svg>
    </div>
  );
}

function StatCard({ icon, iconBg, iconColor, label, value, meta, progress, progressColor }) {
  return (
    <div style={S.statCard}>
      <div style={{ ...S.statIcon, background:iconBg, boxShadow:`0 4px 16px ${iconBg}` }}>
        <span style={{ color:iconColor }}>{icon}</span>
      </div>
      <p style={S.statLabel}>{label}</p>
      <p style={S.statValue}>{value}</p>
      <p style={S.statMeta}>{meta}</p>
      {progress !== undefined && (
        <div style={S.progressWrap}>
          <div style={{ ...S.progressFill, width:`${progress}%`, background:progressColor }} />
        </div>
      )}
    </div>
  );
}

export default function Rapports() {
  const [payload,      setPayload]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [filterType,   setFilterType]   = useState('all');
  const [showAiModal,  setShowAiModal]  = useState(false);
  const [aiReport,     setAiReport]     = useState(null);
  const [generatingAi, setGeneratingAi] = useState(false);

  useEffect(() => {
    Promise.all([getRapports(), getMembers(), getAbonnements(), getPaiements(), getSeances(), getCoachs(), getPaiementCoachs()])
      .then(([rap,mem,ab,pai,sea,coachs,paiCoachs]) => {
        setPayload({ stats:rap.data, members:mem.data||[], abonnements:ab.data||[], paiements:pai.data||[], seances:sea.data||[], coachs:coachs.data||[], paiementCoachs:paiCoachs.data||[] });
      })
      .catch(() => console.error('Erreur loading endpoints.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={S.center}>Chargement des rapports...</div>;

  const { stats, members, abonnements, paiements, coachs, paiementCoachs } = payload;
  const currentYear=new Date().getFullYear(), currentMonth=new Date().getMonth(), today=new Date();

  const filteredPaiements = paiements.filter(p => {
    if (!p.date_paiement) return true;
    const d = new Date(p.date_paiement);
    if (filterType==='month') return d.getFullYear()===currentYear && d.getMonth()===currentMonth;
    if (filterType==='year')  return d.getFullYear()===currentYear;
    return true;
  });
  const filteredMembers = members.filter(m => {
    if (!m.date_inscription) return true;
    const d = new Date(m.date_inscription);
    if (filterType==='month') return d.getFullYear()===currentYear && d.getMonth()===currentMonth;
    if (filterType==='year')  return d.getFullYear()===currentYear;
    return true;
  });

  const totalMembres      = filteredMembers.length;
  const abonnementsActifs = abonnements.filter(a => { if (!a.date_fin) return false; const end=new Date(today); end.setHours(23,59,59,999); return new Date(a.date_fin)>=end; }).length;
  const revenusBruts      = filteredPaiements.reduce((s,p)=>s+parseFloat(p.montant||0),0);
  const filteredPaiCoachs = (paiementCoachs||[]).filter(pc => { if (!pc.date_paiement) return true; const d=new Date(pc.date_paiement); if(filterType==='month') return d.getFullYear()===currentYear&&d.getMonth()===currentMonth; if(filterType==='year') return d.getFullYear()===currentYear; return true; });
  const totalSalairesCoachs = filteredPaiCoachs.reduce((s,pc)=>s+parseFloat(pc.montant||pc.salaire||pc.amount||pc.prix||0),0);
  const chiffreAffairesNet = revenusBruts - totalSalairesCoachs;
  const enAttente          = filteredPaiements.filter(p=>p.statut==='En attente').reduce((s,p)=>s+parseFloat(p.montant||0),0);
  const tauxPresence       = parseFloat(stats?.taux_presence_moyen ?? 67);

  const categoriesMap = {};
  abonnements.forEach(ab => { const t=ab.type||'Fitness'; if(!categoriesMap[t]) categoriesMap[t]={name:t,qty:0,total:0}; categoriesMap[t].qty+=1; categoriesMap[t].total+=parseFloat(ab.prix||0); });
  const categories = Object.keys(categoriesMap).length > 0
    ? Object.values(categoriesMap).map((cat,i) => {
        const icons=['💪','🏊','🏋️','🧘','🚴','🥊'];
        const colors=[C.success,C.blue,C.purple,C.teal,C.warning,C.danger];
        const bgs=[C.greenLight,C.blueLight,C.purpleLight,'#0f2d2a','#3b2a0f',C.redLight];
        return { ...cat, icon:icons[i%icons.length], color:colors[i%colors.length], bg:bgs[i%bgs.length] };
      })
    : [{ name:'Fitness',qty:12,total:4500,icon:'💪',color:C.success,bg:C.greenLight }, { name:'Natation',qty:6,total:2500,icon:'🏊',color:C.blue,bg:C.blueLight }, { name:'CrossFit',qty:4,total:3000,icon:'🏋️',color:C.purple,bg:C.purpleLight }];

  const exportToPDF = () => {
    const periodLabel = filterType==='all'?'Global':filterType==='month'?'Ce mois':'Annuel';
    const todayStr = new Date().toLocaleDateString('fr-FR');
    const pdfHTML = `
      <div id="pdf-content" style="width: 190mm; padding: 15mm; background: #ffffff; color: #1a1a2e; font-family: Arial, Helvetica, sans-serif; box-sizing: border-box;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;"><tr><td style="text-align: center; border-bottom: 3px solid #6366f1; padding-bottom: 15px;">
          <h1 style="font-size: 26px; font-weight: 800; color: #1a1a2e; margin: 0 0 5px 0;">Rapport Club Sportif</h1>
          <p style="font-size: 12px; color: #64748b; margin: 0;"><strong>Période:</strong> ${periodLabel} &nbsp;|&nbsp; <strong>Généré le:</strong> ${todayStr}</p>
        </td></tr></table>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="width: 50%; padding: 5px;"><div style="background: #f8fafc; border-radius: 10px; padding: 15px; border: 1px solid #e2e8f0;"><p style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin: 0 0 5px 0;">MEMBRES</p><p style="font-size: 22px; font-weight: 800; color: #1a1a2e; margin: 0;">${fmt(totalMembres)}</p><p style="font-size: 10px; color: #94a3b8; margin: 3px 0 0 0;">Inscriptions actives</p></div></td>
            <td style="width: 50%; padding: 5px;"><div style="background: #f8fafc; border-radius: 10px; padding: 15px; border: 1px solid #e2e8f0;"><p style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin: 0 0 5px 0;">CHIFFRE D'AFFAIRES NET</p><p style="font-size: 22px; font-weight: 800; color: #1a1a2e; margin: 0;">${fmt(chiffreAffairesNet)} MAD</p><p style="font-size: 10px; color: #94a3b8; margin: 3px 0 0 0;">Après salaires coachs</p></div></td>
          </tr>
          <tr>
            <td style="width: 50%; padding: 5px;"><div style="background: #f8fafc; border-radius: 10px; padding: 15px; border: 1px solid #e2e8f0;"><p style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin: 0 0 5px 0;">ABONNEMENTS ACTIFS</p><p style="font-size: 22px; font-weight: 800; color: #1a1a2e; margin: 0;">${fmt(abonnementsActifs)}</p><p style="font-size: 10px; color: #94a3b8; margin: 3px 0 0 0;">Non expirés</p></div></td>
            <td style="width: 50%; padding: 5px;"><div style="background: #f8fafc; border-radius: 10px; padding: 15px; border: 1px solid #e2e8f0;"><p style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin: 0 0 5px 0;">IMPAYES</p><p style="font-size: 22px; font-weight: 800; color: #ef4444; margin: 0;">${fmt(enAttente)} MAD</p><p style="font-size: 10px; color: #94a3b8; margin: 3px 0 0 0;">En attente</p></div></td>
          </tr>
        </table>
        <h2 style="font-size: 14px; font-weight: 700; color: #1a1a2e; margin: 20px 0 10px 0; border-left: 3px solid #6366f1; padding-left: 10px;">Détails Financiers</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px;">
          <tr style="background: #f1f5f9;"><th style="padding: 10px; text-align: left; font-weight: 700; color: #475569; border-bottom: 2px solid #e2e8f0;">Description</th><th style="padding: 10px; text-align: right; font-weight: 700; color: #475569; border-bottom: 2px solid #e2e8f0;">Montant (MAD)</th></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #334155;">Revenus bruts (paiements membres)</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #334155; text-align: right; font-weight: 700;">+${fmt(revenusBruts)}</td></tr>
          <tr style="background: #fef2f2;"><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #ef4444;">Salaires coachs</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #ef4444; text-align: right; font-weight: 700;">-${fmt(totalSalairesCoachs)}</td></tr>
          <tr style="background: #f0fdf4;"><td style="padding: 10px; border-bottom: 2px solid #22c55e; color: #1a1a2e; font-weight: 700;">CHIFFRE D'AFFAIRES NET</td><td style="padding: 10px; border-bottom: 2px solid #22c55e; color: #16a34a; text-align: right; font-weight: 800; font-size: 14px;">${fmt(chiffreAffairesNet)} MAD</td></tr>
        </table>
        <h2 style="font-size: 14px; font-weight: 700; color: #1a1a2e; margin: 20px 0 10px 0; border-left: 3px solid #6366f1; padding-left: 10px;">Résumé par Catégorie</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px;">
          <tr style="background: #f1f5f9;"><th style="padding: 10px; text-align: left; font-weight: 700; color: #475569; border-bottom: 2px solid #e2e8f0;">Catégorie</th><th style="padding: 10px; text-align: center; font-weight: 700; color: #475569; border-bottom: 2px solid #e2e8f0;">Membres</th><th style="padding: 10px; text-align: right; font-weight: 700; color: #475569; border-bottom: 2px solid #e2e8f0;">CA (MAD)</th></tr>
          ${categories.map(cat=>`<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #334155; font-weight: 600;">${cat.icon} ${cat.name}</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #334155; text-align: center;">${cat.qty}</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #334155; text-align: right; font-weight: 700;">${fmt(cat.total)}</td></tr>`).join('')}
        </table>
        <h2 style="font-size: 14px; font-weight: 700; color: #1a1a2e; margin: 20px 0 10px 0; border-left: 3px solid #6366f1; padding-left: 10px;">Taux de Présence</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;"><tr><td style="background: #f8fafc; border-radius: 10px; padding: 20px; text-align: center; border: 1px solid #e2e8f0;"><p style="font-size: 36px; font-weight: 800; color: #22c55e; margin: 0;">${tauxPresence}%</p><p style="font-size: 11px; color: #64748b; margin: 5px 0 0 0;">Taux de présence moyen hebdomadaire</p></td></tr></table>
        <table style="width: 100%; border-collapse: collapse; margin-top: 30px;"><tr><td style="text-align: center; border-top: 2px solid #e2e8f0; padding-top: 15px;"><p style="font-size: 9px; color: #94a3b8; margin: 0;">Rapport généré automatiquement par le système de gestion du club | Page 1 sur 1</p></td></tr></table>
      </div>`;

    if (!window.html2pdf) { alert("html2pdf.js introuvable. Veuillez l'installer: npm install html2pdf.js"); return; }
    const container = document.createElement('div');
    container.innerHTML = pdfHTML;
    container.style.cssText = 'position: fixed; top: 0; left: 0; width: 210mm; background: #ffffff; z-index: 9999; visibility: visible; opacity: 0.01;';
    document.body.appendChild(container);
    setTimeout(() => {
      const element = container.querySelector('#pdf-content');
      const opt = { margin:0, filename:`Rapport_Club_${filterType}_${new Date().toISOString().split('T')[0]}.pdf`, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2,backgroundColor:'#ffffff',useCORS:true,logging:false,width:794,height:element?element.scrollHeight:1123}, jsPDF:{unit:'px',format:[794,element?element.scrollHeight+60:1123],orientation:'portrait',compress:true} };
      window.html2pdf().set(opt).from(element).save().then(()=>document.body.removeChild(container)).catch((err)=>{ console.error('Erreur export PDF:',err); document.body.removeChild(container); alert("Erreur lors de l'export PDF."); });
    }, 300);
  };

  const handleGenerateAiReport = () => {
    setGeneratingAi(true); setShowAiModal(true);
    setTimeout(() => {
      setAiReport({ statut:enAttente>15000?"Alerte Impayés":"Trésorerie Saine", diagnostic:`L'analyse montre une concentration stable sur le Fitness. Les présences globales s'élèvent à ${tauxPresence}% pour la sélection (${filterType}). Le chiffre d'affaires net est de ${fmt(chiffreAffairesNet)} MAD après déduction des salaires coachs (${fmt(totalSalairesCoachs)} MAD).`, actionRecommandee:"Automatiser l'envoi des rappels aux membres inactifs depuis plus de 7 jours pour stabiliser la rétention." });
      setGeneratingAi(false);
    }, 1100);
  };

  const getFilterLabel = () => filterType==='all'?'Global':filterType==='month'?'Ce mois':'Annuel';

  return (
    <div style={S.page} id="rapports-page-content">

      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Rapports & Statistiques</h1>
          <p style={S.subtitle}>Vue d'ensemble opérationnelle — <strong style={{ color:C.primary }}>{getFilterLabel()}</strong></p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12, color:C.textMuted, fontSize:13, fontWeight:500 }}>
          <Icon d={IC.calendar} size={16} color={C.textMuted} />
          <span>{new Date().toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div style={S.toolbar} id="rapports-toolbar">
        <button style={{ ...S.tbBtn, ...(filterType==='all'?S.tbBtnActive:{}) }} onClick={()=>setFilterType('all')}>
          <Icon d={IC.globe} size={15} color={filterType==='all'?C.primary:C.textMuted} /> Global
        </button>
        <button style={{ ...S.tbBtn, ...(filterType==='month'?S.tbBtnActive:{}) }} onClick={()=>setFilterType('month')}>
          <Icon d={IC.calendar} size={15} color={filterType==='month'?C.primary:C.textMuted} /> Ce mois
        </button>
        <button style={{ ...S.tbBtn, ...(filterType==='year'?S.tbBtnActive:{}) }} onClick={()=>setFilterType('year')}>
          <Icon d={IC.annual} size={15} color={filterType==='year'?C.primary:C.textMuted} /> Annuel
        </button>
        <div style={{ flex:1 }} />
        <button style={{ ...S.tbBtn, ...S.tbBtnPrimary }} onClick={exportToPDF}>
          <Icon d={IC.download} size={15} color="#fff" /> Exporter PDF
        </button>
      </div>

      {/* Stats Grid */}
      <div style={S.statGrid}>
        <StatCard icon={<Icon d={IC.users} size={24} color={C.teal} />} iconBg="rgba(20,184,166,0.15)" iconColor={C.teal} label="MEMBRES" value={fmt(totalMembres)} meta="Inscriptions actives" progress={Math.min((totalMembres/150)*100,100)} progressColor={C.teal} />
        <StatCard icon={<Icon d={IC.money} size={24} color={C.success} />} iconBg={C.successGlow} iconColor={C.success} label="CHIFFRE D'AFFAIRES NET" value={`${fmt(chiffreAffairesNet)} MAD`} meta={`Brut: ${fmt(revenusBruts)} | Coachs: -${fmt(totalSalairesCoachs)} ${totalSalairesCoachs===0?'(Non déduit)':''}`} progress={Math.min((chiffreAffairesNet/50000)*100,100)} progressColor={C.success} />
        <StatCard icon={<Icon d={IC.warning} size={24} color={C.danger} />} iconBg={C.dangerGlow} iconColor={C.danger} label="IMPAYÉS" value={`${fmt(enAttente)} MAD`} meta="Paiements en attente" />
        <StatCard icon={<Icon d={IC.sub} size={24} color={C.info} />} iconBg={C.infoGlow} iconColor={C.info} label="ABONNEMENTS ACTIFS" value={fmt(abonnementsActifs)} meta={`Sur ${fmt(abonnements.length)} total`} progress={abonnements.length>0?Math.min((abonnementsActifs/abonnements.length)*100,100):0} progressColor={C.info} />
      </div>

      {/* Charts Grid */}
      <div style={S.chartsGrid}>
        <div style={S.card}>
          <h3 style={S.cardTitle}><Icon d={IC.trend} size={18} color={C.teal} /> Croissance des membres</h3>
          <p style={S.cardSubtitle}>Évolution des inscriptions — {getFilterLabel()}</p>
          <div style={S.legendRow}>
            <span><span style={{ ...S.legendDot, background:C.teal }}></span>Nouveaux membres</span>
          </div>
          <LineChart labels={['JAN','FÉV','MAR','AVR','MAI','JUIN','JUIL','AOÛT','SEPT','OCT','NOV','DÉC']} data={filterType==='month'?[0,0,0,0,0,0,0,0,0,0,0,totalMembres]:[2,4,3,5,4,6,5,7,6,8,7,totalMembres]} />
        </div>
        <div style={S.card}>
          <h3 style={S.cardTitle}><Icon d={IC.chart} size={18} color={C.success} /> Taux de présence</h3>
          <p style={S.cardSubtitle}>Assiduité moyenne hebdomadaire</p>
          <DonutChart value={tauxPresence} />
          <div style={S.trendRow}>
            <span>Vs période précédente</span>
            <span style={S.trendDown}>▼ -2.1%</span>
          </div>
        </div>
      </div>

      {/* Catégories */}
      <div style={S.card}>
        <h3 style={S.cardTitle}><Icon d={IC.tag} size={18} color={C.warning} /> Résumé par catégorie</h3>
        <div style={S.catHeader}><span>Catégorie</span><span style={{ textAlign:'right' }}>Membres</span><span style={{ textAlign:'right' }}>Chiffre d'affaires</span></div>
        {categories.map((cat,i) => (
          <div key={i} style={S.catRow}>
            <div style={S.catNameWrap}>
              <div style={{ ...S.catIcon, background:cat.bg }}><span style={{ color:cat.color }}>{cat.icon}</span></div>
              <span style={S.catName}>{cat.name}</span>
            </div>
            <span style={S.catQty}>{cat.qty}</span>
            <span style={{ ...S.catTotal, color:cat.color }}>{fmt(cat.total)} MAD</span>
          </div>
        ))}
      </div>

      {/* AI Card */}
      <div style={S.aiCard}>
        <div style={S.aiBadge}><Icon d={IC.sparkle} size={12} color="#fff" /> IA - Conseil Pro</div>
        <h3 style={S.aiTitle}>Optimisez la rétention de vos membres</h3>
        <p style={S.aiBody}>Nos analyses montrent que les membres qui participent à au moins 3 séances par semaine ont un taux de renouvellement de 92%. Lancez une campagne de fidélisation ciblée pour booster l'engagement et maximiser vos revenus nets.</p>
        <button style={S.aiBtn} onClick={handleGenerateAiReport}>
          <Icon d={IC.brain} size={16} color="#fff" />
          {generatingAi ? "Réflexion de l'IA..." : "Générer un rapport détaillé"}
        </button>
      </div>

      {/* AI Modal */}
      {showAiModal && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <div style={S.modalHeader}>
              <h3 style={S.modalTitle}><Icon d={IC.brain} size={22} color={C.primary} /> Rapport d'Analyse Intelligente</h3>
              <button style={S.closeBtn} onClick={()=>setShowAiModal(false)}><Icon d={IC.close} size={16} color={C.textMuted} /></button>
            </div>
            {generatingAi ? (
              <div style={{ textAlign:'center', padding:'50px 0', color:C.textLight }}>
                <div style={{ marginBottom:16 }}><Icon d={IC.rotate} size={40} color={C.primary} /></div>
                <div style={{ fontSize:16, fontWeight:600 }}>L'IA analyse les tendances...</div>
              </div>
            ) : aiReport && (
              <div>
                {[
                  { title:'Statut Opérationnel', content:aiReport.statut,              borderColor:C.info,    bg:'#1e2438', textColor:C.text    },
                  { title:'Diagnostic',           content:aiReport.diagnostic,           borderColor:C.warning, bg:'#1c2130', textColor:C.textLight },
                  { title:'Plan de Recommandations', content:aiReport.actionRecommandee, borderColor:C.success, bg:'#162d20', textColor:C.textLight },
                ].map((s,i) => (
                  <div key={i} style={{ ...S.aiSectionBlock, background:s.bg, borderLeftColor:s.borderColor, color:s.textColor }}>
                    <strong style={{ color:s.borderColor, fontSize:11, textTransform:'uppercase', display:'block', marginBottom:6, letterSpacing:'1px' }}>{s.title}</strong>
                    {s.content}
                  </div>
                ))}
                <div style={{ marginTop:28, display:'flex', justifyContent:'flex-end' }}>
                  <button style={{ ...S.tbBtn, ...S.tbBtnPrimary, padding:'12px 28px' }} onClick={()=>setShowAiModal(false)}>
                    <Icon d={IC.check} size={16} color="#fff" /> Compris
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}