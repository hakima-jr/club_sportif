// src/pages/membre/MesPaiements.js
import React, { useEffect, useState } from 'react';
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
  check:   'M20 6L9 17l-5-5',
  clock:   ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 6v6l4 2'],
  money:   ['M12 1v22','M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
  warning: ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  close:   ['M18 6L6 18','M6 6l12 12'],
  lock:    ['M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z','M7 11V7a5 5 0 0 1 10 0v4'],
  list:    ['M8 6h13','M8 12h13','M8 18h13','M3 6h.01','M3 12h.01','M3 18h.01'],
  back:    ['M19 12H5','M12 5l-7 7 7 7'],
};

const C = {
  bgDark:'#0a0e1a', surface:'#111827', surfaceAlt:'#1a2234', border:'#1f2937', borderLight:'#374151',
  text:'#f8fafc', textMuted:'#94a3b8', textLight:'#cbd5e1',
  primary:'#6366f1', success:'#22c55e', danger:'#ef4444', warning:'#f59e0b',
};

export default function MesPaiements() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [paiements, setPaiements] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showPay,   setShowPay]   = useState(false);
  const [payStatus, setPayStatus] = useState('idle');
  const [focused,   setFocused]   = useState(null);
  const [form, setForm] = useState({ email:'', cardNumber:'', cardExpiry:'', cardCVC:'', cardHolder:'' });

  // Normalise une chaîne pour comparaison (minuscule + trim + espaces multiples)
  const norm = (s) => (s || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');

  const fetchPaiements = () => {
    if (!user.id_membre) { setLoading(false); return; }
    axios.get(`${API}/paiements`)
      .then(res => {
        const all = res.data || [];

        // 1) Méthode fiable : filtrage par id_membre si le backend le renvoie
        let mes = all.filter(p => p.id_membre === user.id_membre);

        // 2) Fallback : si l'API ne renvoie pas id_membre, on compare par nom complet
        //    (nom + prenom si disponibles) de façon stricte (égalité, pas "includes")
        if (mes.length === 0 && !all.some(p => 'id_membre' in p)) {
          const userFullName = norm(`${user.nom || ''} ${user.prenom || ''}`.trim() || user.nom);
          mes = all.filter(p => norm(p.nom_membre) === userFullName);
        }

        setPaiements(mes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPaiements();
  }, []);

  const total   = paiements.reduce((s,p)=>s+parseFloat(p.montant||0),0);
  const paye    = paiements.filter(p=>p.statut==='Payé').reduce((s,p)=>s+parseFloat(p.montant||0),0);
  const attente = paiements.filter(p=>p.statut==='En attente').reduce((s,p)=>s+parseFloat(p.montant||0),0);
  const formatCard   = v => v.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19);
  const formatExpiry = v => { const d=v.replace(/\D/g,''); return d.length>=3?`${d.slice(0,2)} / ${d.slice(2,4)}`:d; };

  const handlePay = async (e) => {
    e.preventDefault(); setPayStatus('loading');
    try {
      const dateNow = new Date().toISOString().slice(0,10);
      await axios.post(`${API}/paiements`, {
        montant: attente || 150,
        date_paiement: dateNow,
        mode_paiement: 'Carte',
        statut: 'Payé',
        id_membre: user.id_membre,
        id_abonnement: paiements.find(p=>p.statut==='En attente')?.id_abonnement || 2
      });
      setPayStatus('success');
      fetchPaiements();
    } catch {
      setPayStatus('error');
    }
  };

  const statutStyle = {
    'Payé':      { bg:'rgba(34,197,94,0.12)',  color:'#4ade80', border:'rgba(34,197,94,0.3)'  },
    'En attente':{ bg:'rgba(245,158,11,0.12)', color:'#fbbf24', border:'rgba(245,158,11,0.3)' },
    'Annulé':    { bg:'rgba(239,68,68,0.12)',  color:'#f87171', border:'rgba(239,68,68,0.3)'  },
  };

  const displayNum  = form.cardNumber || '•••• •••• •••• ••••';
  const displayName = form.cardHolder || 'VOTRE NOM';
  const displayExp  = form.cardExpiry  || 'MM / YY';
  const inputStyle  = (id) => ({ padding:'11px 14px', background:C.surfaceAlt, border:`1px solid ${focused===id?C.primary:C.border}`, borderRadius:10, color:C.text, fontSize:14, outline:'none', fontFamily:'inherit', boxShadow:focused===id?'0 0 0 3px rgba(99,102,241,.15)':'none', transition:'all .15s' });

  if (loading) return <div style={{ padding:60, textAlign:'center', color:C.textMuted, fontFamily:'Segoe UI, sans-serif' }}>Chargement…</div>;

  return (
    <div style={{ minHeight:'100vh', background:C.bgDark, fontFamily:'Inter, -apple-system, sans-serif', paddingBottom:60 }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81)', padding:'28px 40px' }}>
        <h1 style={{ fontSize:28, fontWeight:800, color:'#f1f5f9', margin:0, display:'flex', alignItems:'center', gap:12 }}>
          <Icon d={IC.payment} size={26} color="#a78bfa" /> Mes Paiements
        </h1>
        <p style={{ color:'rgba(255,255,255,.5)', marginTop:6, fontSize:14 }}>{paiements.length} transaction(s) enregistrée(s)</p>
      </div>

      <div style={{ padding:'28px 40px' }}>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16, marginBottom:28 }}>
          {[
            { label:'Total payé',    value:`${paye.toFixed(2)} MAD`,    iconKey:'check', grad:'linear-gradient(135deg,#064e3b,#15803d)', color:'#4ade80' },
            { label:'En attente',    value:`${attente.toFixed(2)} MAD`, iconKey:'clock', grad:'linear-gradient(135deg,#78350f,#b45309)', color:'#fbbf24' },
            { label:'Total général', value:`${total.toFixed(2)} MAD`,   iconKey:'money', grad:'linear-gradient(135deg,#2d1f5e,#4c1d95)', color:'#c4b5fd' },
          ].map(s => (
            <div key={s.label} style={{ background:s.grad, borderRadius:16, padding:'22px 20px', textAlign:'center' }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}><Icon d={IC[s.iconKey]} size={28} color={s.color} /></div>
              <div style={{ fontSize:20, fontWeight:800, color:s.color, marginBottom:4 }}>{s.value}</div>
              <div style={{ color:'rgba(255,255,255,.65)', fontSize:12 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Payer maintenant alert */}
        {attente>0 && !showPay && (
          <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:16, padding:'20px 24px', marginBottom:24, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
            <div>
              <p style={{ color:'#fbbf24', fontWeight:700, margin:0, fontSize:15, display:'flex', alignItems:'center', gap:8 }}>
                <Icon d={IC.warning} size={16} color="#fbbf24" /> Paiement en attente
              </p>
              <p style={{ color:C.textMuted, fontSize:13, margin:'4px 0 0' }}>Vous avez {attente.toFixed(2)} MAD à régler</p>
            </div>
            <button onClick={()=>setShowPay(true)} style={{ padding:'11px 28px', background:'linear-gradient(135deg,#4338ca,#6366f1)', border:'none', borderRadius:12, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:8 }}>
              <Icon d={IC.payment} size={16} color="#fff" /> Payer maintenant
            </button>
          </div>
        )}

        {/* Formulaire paiement */}
        {showPay && (
          <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, marginBottom:28, overflow:'hidden', boxShadow:'0 8px 40px rgba(0,0,0,0.4)' }}>
            {payStatus==='success' ? (
              <div style={{ padding:'60px 40px', textAlign:'center' }}>
                <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#15803d,#16a34a)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                  <Icon d={IC.check} size={36} color="#fff" strokeWidth={2.5} />
                </div>
                <h2 style={{ color:C.text, fontSize:22, fontWeight:800, margin:'0 0 8px' }}>Paiement réussi !</h2>
                <p style={{ color:C.textMuted, fontSize:14, margin:'0 0 28px' }}>Votre paiement a été enregistré avec succès</p>
                <button onClick={()=>{ setShowPay(false); setPayStatus('idle'); setForm({email:'',cardNumber:'',cardExpiry:'',cardCVC:'',cardHolder:''}); }}
                  style={{ padding:'12px 32px', background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:12, color:C.textLight, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:8, margin:'0 auto' }}>
                  <Icon d={IC.back} size={14} color={C.textLight} /> Retour aux paiements
                </button>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }}>
                {/* LEFT — Card visual */}
                <div style={{ background:'linear-gradient(160deg,#4338ca,#6366f1,#8b5cf6)', padding:'40px 36px', display:'flex', flexDirection:'column' }}>
                  <p style={{ color:'rgba(255,255,255,.7)', fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:1, margin:'0 0 6px' }}>Montant à régler</p>
                  <div style={{ color:'#fff', fontSize:40, fontWeight:900, letterSpacing:'-2px', margin:'0 0 6px' }}>{attente.toFixed(2)} <span style={{ fontSize:16, opacity:.7 }}>MAD</span></div>
                  <p style={{ color:'rgba(255,255,255,.6)', fontSize:13, margin:'0 0 28px' }}>Règlement de votre solde en attente</p>
                  {/* Card preview */}
                  <div style={{ background:'rgba(255,255,255,.15)', backdropFilter:'blur(10px)', borderRadius:16, padding:24, border:'1px solid rgba(255,255,255,.2)', marginBottom:20 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                      <div style={{ width:36, height:28, background:'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius:5, display:'flex', flexDirection:'column', justifyContent:'center', gap:4, padding:'4px 6px' }}>
                        <div style={{ height:2, background:'rgba(0,0,0,.3)', borderRadius:1 }} /><div style={{ height:2, background:'rgba(0,0,0,.3)', borderRadius:1 }} />
                      </div>
                      <span style={{ color:'#fff', fontWeight:900, fontSize:18, letterSpacing:2, fontStyle:'italic' }}>VISA</span>
                    </div>
                    <div style={{ color:'#fff', fontSize:16, letterSpacing:'3px', fontWeight:600, marginBottom:20, fontFamily:'monospace' }}>{displayNum}</div>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <div><div style={{ color:'rgba(255,255,255,.6)', fontSize:10, textTransform:'uppercase', letterSpacing:1, marginBottom:2 }}>Titulaire</div><div style={{ color:'#fff', fontSize:13, fontWeight:600 }}>{displayName}</div></div>
                      <div><div style={{ color:'rgba(255,255,255,.6)', fontSize:10, textTransform:'uppercase', letterSpacing:1, marginBottom:2 }}>Expiration</div><div style={{ color:'#fff', fontSize:13, fontWeight:600 }}>{displayExp}</div></div>
                    </div>
                  </div>
                  <div style={{ color:'rgba(255,255,255,.6)', fontSize:12, textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                    <Icon d={IC.lock} size={12} color="rgba(255,255,255,.6)" /> Paiement sécurisé SSL 256-bit
                  </div>
                </div>
                {/* RIGHT — Form */}
                <div style={{ padding:'40px 36px', background:C.surface }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                    <h2 style={{ fontSize:20, fontWeight:800, color:C.text, margin:0 }}>Informations de paiement</h2>
                    <button onClick={()=>{ setShowPay(false); setPayStatus('idle'); }} style={{ background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:8, color:C.textMuted, width:32, height:32, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon d={IC.close} size={16} color={C.textMuted} />
                    </button>
                  </div>
                  {payStatus==='error' && (
                    <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#f87171', padding:'12px 16px', borderRadius:10, fontSize:13, marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
                      <Icon d={IC.warning} size={14} color="#f87171" /> Une erreur est survenue. Réessayez.
                    </div>
                  )}
                  <form onSubmit={handlePay} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                    {[
                      { id:'email',      label:'Email',             type:'email', placeholder:'email',      upper:false },
                      { id:'cardHolder', label:'Nom du titulaire',  type:'text',  placeholder:'Nom du titulaire', upper:false},
                      { id:'cardNumber', label:'Numéro de carte',   type:'text',  placeholder:'1234 5678 9012 3456',    mono:true   },
                    ].map(f => (
                      <div key={f.id} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                        <label style={{ color:C.textMuted, fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:.5 }}>{f.label}</label>
                        <input type={f.type} value={form[f.id]} required
                          onChange={e=>{ let v=e.target.value; if(f.id==='cardNumber') v=formatCard(v); if(f.upper) v=v.toUpperCase(); setForm({...form,[f.id]:v}); }}
                          onFocus={()=>setFocused(f.id)} onBlur={()=>setFocused(null)}
                          placeholder={f.placeholder}
                          style={{ ...inputStyle(f.id), fontFamily:f.mono?'monospace':'inherit', textTransform:f.upper?'uppercase':'none' }} />
                      </div>
                    ))}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                      {[
                        { id:'cardExpiry', label:'Expiration', placeholder:'MM / YY', maxLength:7 },
                        { id:'cardCVC',    label:'CVC',        placeholder:'•••',     maxLength:3 },
                      ].map(f => (
                        <div key={f.id} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                          <label style={{ color:C.textMuted, fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:.5 }}>{f.label}</label>
                          <input type="text" value={form[f.id]} required maxLength={f.maxLength}
                            onChange={e=>{ let v=e.target.value; if(f.id==='cardExpiry') v=formatExpiry(v); setForm({...form,[f.id]:v}); }}
                            onFocus={()=>setFocused(f.id)} onBlur={()=>setFocused(null)}
                            placeholder={f.placeholder} style={inputStyle(f.id)} />
                        </div>
                      ))}
                    </div>
                    <button type="submit" disabled={payStatus==='loading'} style={{ padding:'14px', background:'linear-gradient(135deg,#4338ca,#6366f1)', border:'none', borderRadius:12, color:'#fff', fontSize:15, fontWeight:700, cursor:payStatus==='loading'?'not-allowed':'pointer', fontFamily:'inherit', opacity:payStatus==='loading'?.7:1, marginTop:4, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                      <Icon d={payStatus==='loading'?IC.clock:IC.payment} size={16} color="#fff" />
                      {payStatus==='loading'?'Traitement...':`Payer ${attente.toFixed(2)} MAD`}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tableau paiements */}
        <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:C.text, margin:0, display:'flex', alignItems:'center', gap:8 }}>
              <Icon d={IC.list} size={18} color={C.primary} /> Historique des transactions
            </h2>
          </div>
          {paiements.length===0 ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:C.textMuted }}>
              <Icon d={IC.payment} size={40} color={C.textMuted} />
              <p style={{ margin:'12px 0 0' }}>Aucune transaction trouvée</p>
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ background:C.surfaceAlt }}>
                    {['Date','Montant','Mode','Abonnement','Référence','Statut'].map(h => (
                      <th key={h} style={{ padding:'13px 18px', textAlign:'left', color:C.textMuted, fontSize:11, textTransform:'uppercase', fontWeight:600, letterSpacing:.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paiements.map((p,i) => {
                    const st = statutStyle[p.statut] || { bg:C.surfaceAlt, color:C.textMuted, border:C.border };
                    return (
                      <tr key={p.id_paiement} style={{ background:i%2===0?'transparent':C.surfaceAlt+'60' }}>
                        <td style={{ padding:'13px 18px', borderBottom:`1px solid ${C.border}`, color:C.textLight }}>{p.date_paiement?.slice(0,10)}</td>
                        <td style={{ padding:'13px 18px', borderBottom:`1px solid ${C.border}` }}><strong style={{ color:'#4ade80', fontSize:14 }}>{p.montant} MAD</strong></td>
                        <td style={{ padding:'13px 18px', borderBottom:`1px solid ${C.border}`, color:C.textLight }}>{p.mode_paiement}</td>
                        <td style={{ padding:'13px 18px', borderBottom:`1px solid ${C.border}`, color:C.textLight }}>{p.type_abonnement||'—'}</td>
                        <td style={{ padding:'13px 18px', borderBottom:`1px solid ${C.border}`, color:C.textMuted, fontFamily:'monospace', fontSize:12 }}>{p.reference||'—'}</td>
                        <td style={{ padding:'13px 18px', borderBottom:`1px solid ${C.border}` }}>
                          <span style={{ background:st.bg, color:st.color, border:`1px solid ${st.border}`, padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:600 }}>{p.statut}</span>
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
    </div>
  );
}