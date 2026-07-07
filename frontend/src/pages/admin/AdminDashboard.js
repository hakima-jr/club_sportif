// src/pages/admin/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';

// ─── SVG Icon System ──────────────────────────────────────────────────────────
function Icon({ d, size = 20, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}

const IC = {
  dashboard: ['M3 3h7v7H3z','M14 3h7v7h-7z','M3 14h7v7H3z','M14 14h7v7h-7z'],
  users:     ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z','M23 21v-2a4 4 0 0 0-3-3.87','M16 3.13a4 4 0 0 1 0 7.75'],
  sub:       ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8','M10 9H8'],
  money:     ['M12 1v22','M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
  warning:   ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  dumbbell:  ['M6.5 6.5h11','M6.5 17.5h11','M3 9.5h3v5H3z','M18 9.5h3v5h-3z','M6 12h12'],
  chart:     ['M18 20V10','M12 20V4','M6 20v-6'],
  calendar:  ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  coach:     ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z','M12 11v4','M10 15h4'],
  staff:     ['M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z','M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'],
  payment:   ['M1 10h22','M2 5h20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z'],
  shop:      ['M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z','M3 6h18','M16 10a4 4 0 0 1-8 0'],
  plus:      ['M12 5v14','M5 12h14'],
  schedule:  ['M8 6h13','M8 12h13','M8 18h13','M3 6h.01','M3 12h.01','M3 18h.01'],
  bell:      ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 0 1-3.46 0'],
  arrow:     'M5 12h14M12 5l7 7-7 7',
};

const C = {
  bgDark:'#0a0e1a', surface:'#111827', surfaceAlt:'#1a2234', border:'#1f2937',
  text:'#f8fafc', textMuted:'#94a3b8', textLight:'#cbd5e1',
  primary:'#6366f1', success:'#22c55e', danger:'#ef4444',
  warning:'#f59e0b', info:'#3b82f6', orange:'#f97316', purple:'#8b5cf6', teal:'#14b8a6',
  primaryGlow:'rgba(99,102,241,0.15)', successGlow:'rgba(34,197,94,0.15)',
  dangerGlow:'rgba(239,68,68,0.15)', warningGlow:'rgba(245,158,11,0.15)',
  infoGlow:'rgba(59,130,246,0.15)',
};

const fmt = (n) => Number(n || 0).toLocaleString('fr-MA');

const kpiCards = [
  { key:'total_membres',        label:'Membres',     sublabel:'Inscrits',   iconKey:'users',    color:C.primary, bg:C.primaryGlow, to:'/members',      format:(v)=>fmt(v) },
  { key:'abonnements_actifs',   label:'Abonnements', sublabel:'Actifs',     iconKey:'sub',      color:C.info,    bg:C.infoGlow,    to:'/abonnements',  format:(v)=>fmt(v) },
  { key:'revenus_totaux',       label:'Revenus',     sublabel:'Ce mois',    iconKey:'money',    color:C.success, bg:C.successGlow, to:'/paiements',    format:(v)=>`${fmt(v)} MAD` },
  { key:'paiements_en_attente', label:'Impayés',     sublabel:'En attente', iconKey:'warning',  color:C.danger,  bg:C.dangerGlow,  to:'/paiements',    format:(v)=>`${fmt(v)} MAD` },
  { key:'total_seances',        label:'Séances',     sublabel:'Planifiées', iconKey:'dumbbell', color:C.purple,  bg:'rgba(139,92,246,0.15)', to:'/seances', format:(v)=>fmt(v) },
  { key:'taux_presence_moyen',  label:'Présence',    sublabel:'Moyenne',    iconKey:'chart',    color:C.orange,  bg:'rgba(249,115,22,0.15)', to:'/presence',format:(v)=>`${v}%` },
];

const quickActions = [
  { to:'/members',      iconKey:'plus',    label:'Nouveau membre',  desc:'Ajouter un membre',    color:C.primary },
  { to:'/admin/coachs', iconKey:'coach',   label:'Gérer coachs',    desc:'Équipe & profils',     color:C.info    },
  { to:'/admin/staff',  iconKey:'staff',   label:'Gérer staff',     desc:'Personnel du club',    color:C.purple  },
  { to:'/seances',      iconKey:'calendar',label:'Planifier',       desc:'Nouvelle séance',      color:C.success },
  { to:'/abonnements',  iconKey:'sub',     label:'Abonnements',     desc:'Gérer les forfaits',   color:C.teal    },
  { to:'/paiements',    iconKey:'payment', label:'Paiements',       desc:'Encaissements',        color:C.warning },
  { to:'/rapports',     iconKey:'chart',   label:'Rapports',        desc:'Stats & analyses',     color:C.danger  },
  { to:'/shop',         iconKey:'shop',    label:'Boutique',        desc:'Produits & ventes',    color:C.orange  },
];

function KpiCard({ data, value, trend }) {
  return (
    <Link to={data.to} style={{ textDecoration:'none' }}>
      <div style={{ background:C.surface, borderRadius:20, padding:'24px 22px', border:`1px solid ${C.border}`,
        cursor:'pointer', position:'relative', overflow:'hidden', transition:'all 0.3s ease',
        boxShadow:'0 4px 20px rgba(0,0,0,0.3)', height:'100%', boxSizing:'border-box' }}
        onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 12px 40px ${data.bg}`; e.currentTarget.style.borderColor=data.color+'40'; }}
        onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.3)'; e.currentTarget.style.borderColor=C.border; }}
      >
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${data.color}, ${data.color}80)`, borderRadius:'20px 20px 0 0' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:data.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon d={IC[data.iconKey]} size={22} color={data.color} />
          </div>
          {trend && (
            <span style={{ fontSize:11, fontWeight:700, color:trend>0?C.success:C.danger,
              background:trend>0?C.successGlow:C.dangerGlow, padding:'4px 8px', borderRadius:6 }}>
              {trend>0?'↗':'↘'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <div style={{ fontSize:28, fontWeight:800, color:C.text, marginBottom:4, letterSpacing:'-0.5px' }}>
          {data.format(value)}
        </div>
        <div style={{ fontSize:13, color:C.textLight, fontWeight:600, marginBottom:2 }}>{data.label}</div>
        <div style={{ fontSize:11, color:C.textMuted }}>{data.sublabel}</div>
        <div style={{ position:'absolute', bottom:20, right:20, color:data.color, fontSize:20, opacity:0.3 }}>→</div>
      </div>
    </Link>
  );
}

function ActionCard({ action }) {
  return (
    <Link to={action.to} style={{ textDecoration:'none' }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, background:C.surface,
        borderRadius:14, padding:'16px 20px', border:`1px solid ${C.border}`,
        cursor:'pointer', transition:'all 0.25s ease', boxShadow:'0 2px 10px rgba(0,0,0,0.2)' }}
        onMouseEnter={e=>{ e.currentTarget.style.transform='translateX(4px)'; e.currentTarget.style.borderColor=action.color+'30'; e.currentTarget.style.boxShadow=`0 4px 20px ${action.color}15`; }}
        onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,0.2)'; }}
      >
        <div style={{ width:40, height:40, borderRadius:10, background:action.color+'15',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon d={IC[action.iconKey]} size={20} color={action.color} />
        </div>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:C.textLight, marginBottom:2 }}>{action.label}</div>
          <div style={{ fontSize:12, color:C.textMuted }}>{action.desc}</div>
        </div>
        <div style={{ marginLeft:'auto', color:action.color, opacity:0.4 }}>
          <Icon d={IC.arrow} size={18} color={action.color} />
        </div>
      </div>
    </Link>
  );
}

function RecentActivity({ stats }) {
  const activities = [
    { iconKey:'users',   text:`${stats?.nouveaux_membres||0} nouveaux membres ce mois`,  color:C.primary },
    { iconKey:'money',   text:`${fmt(stats?.revenus_ce_mois||0)} MAD encaissés`,          color:C.success },
    { iconKey:'warning', text:`${stats?.paiements_en_attente||0} paiements en attente`,  color:C.danger  },
    { iconKey:'dumbbell',text:`${stats?.seances_ce_mois||0} séances planifiées`,          color:C.purple  },
  ];
  return (
    <div style={{ background:C.surface, borderRadius:20, padding:'28px 32px', border:`1px solid ${C.border}`, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
      <h2 style={{ fontSize:18, fontWeight:700, color:C.text, margin:'0 0 20px', display:'flex', alignItems:'center', gap:10 }}>
        <Icon d={IC.bell} size={20} color={C.warning} /> Activité Récente
      </h2>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {activities.map((act, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
            background:C.surfaceAlt, borderRadius:12, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:18, width:36, height:36, borderRadius:10, background:act.color+'15',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon d={IC[act.iconKey]} size={18} color={act.color} />
            </div>
            <span style={{ fontSize:13, color:C.textLight, fontWeight:500 }}>{act.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    axios.get(`${API}/rapports`)
      .then(r => setStats(r.data))
      .catch(() => setError('Impossible de charger les statistiques.'))
      .finally(() => setLoading(false));
  }, []);

  const trends = { total_membres:12, abonnements_actifs:5, revenus_totaux:-8, paiements_en_attente:15, total_seances:20, taux_presence_moyen:3 };

  return (
    <div style={{ padding:'32px 40px', fontFamily:'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      maxWidth:1400, margin:'0 auto', background:C.bgDark, minHeight:'100vh' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontSize:32, fontWeight:800, margin:0, color:C.text, letterSpacing:'-0.5px', display:'flex', alignItems:'center', gap:12 }}>
            <Icon d={IC.chart} size={32} color={C.primary} /> Tableau de bord
          </h1>
          <p style={{ color:C.textMuted, marginTop:8, fontSize:15 }}>
            Bienvenue, <strong style={{ color:C.textLight }}>{user.prenom} {user.nom}</strong>
            <span style={{ marginLeft:12, fontSize:13, opacity:0.7 }}>
              {new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
            </span>
          </p>
        </div>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.textMuted,
          padding:'10px 20px', borderRadius:12, fontSize:13, fontWeight:500, display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:C.success, display:'inline-block' }} />
          Système opérationnel
        </div>
      </div>

      {error && (
        <div style={{ background:C.dangerGlow, border:`1px solid ${C.danger}40`, color:C.danger,
          padding:'14px 20px', borderRadius:12, marginBottom:24, fontSize:14, fontWeight:500,
          display:'flex', alignItems:'center', gap:10 }}>
          <Icon d={IC.warning} size={18} color={C.danger} /> {error}
        </div>
      )}

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'80px 0', color:C.textMuted, fontSize:16 }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ marginBottom:20 }}><Icon d={IC.schedule} size={48} color={C.textMuted} /></div>
            Chargement des statistiques…
          </div>
        </div>
      ) : stats && (
        <>
          {/* KPI Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20, marginBottom:28 }}>
            {kpiCards.map(card => (
              <KpiCard key={card.key} data={card} value={stats[card.key]} trend={trends[card.key]} />
            ))}
          </div>

          {/* Main Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:24, marginBottom:28 }}>
            <div style={{ background:C.surface, borderRadius:20, padding:'28px 32px', border:`1px solid ${C.border}`, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:C.text, margin:'0 0 20px', display:'flex', alignItems:'center', gap:10 }}>
                <Icon d={IC.plus} size={20} color={C.primary} /> Actions rapides
              </h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:12 }}>
                {quickActions.map(action => <ActionCard key={action.to} action={action} />)}
              </div>
            </div>
            <RecentActivity stats={stats} />
          </div>

          {/* Performance */}
          <div style={{ background:C.surface, borderRadius:20, padding:'28px 32px', border:`1px solid ${C.border}`, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:C.text, margin:'0 0 20px', display:'flex', alignItems:'center', gap:10 }}>
              <Icon d={IC.chart} size={20} color={C.success} /> Performance du club
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20 }}>
              {[
                { label:'Membres actifs',        value:stats?.total_membres||0,    total:200,  color:C.primary },
                { label:'Taux de renouvellement',value:stats?.taux_renouvellement||75, total:100, color:C.success },
                { label:'Objectif revenus',       value:Math.min((stats?.revenus_totaux||0)/50000*100,100), total:100, color:C.warning },
              ].map((item, i) => (
                <div key={i} style={{ background:C.surfaceAlt, borderRadius:14, padding:'20px 24px', border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:13, color:C.textMuted, marginBottom:12, fontWeight:600 }}>{item.label}</div>
                  <div style={{ fontSize:28, fontWeight:800, color:item.color, marginBottom:12 }}>
                    {typeof item.value==='number'?fmt(item.value):item.value}
                    <span style={{ fontSize:14, color:C.textMuted, marginLeft:4 }}>/ {fmt(item.total)}</span>
                  </div>
                  <div style={{ height:6, background:C.border, borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${Math.min((item.value/item.total)*100,100)}%`,
                      background:item.color, borderRadius:3, transition:'width 0.6s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}