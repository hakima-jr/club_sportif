// src/pages/Paiement.js
import { useState } from "react";
import API from "../api/api";

function Paiement() {
  const [formData, setFormData] = useState({
    email: "", cardNumber: "", cardExpiry: "", cardCVC: "", cardHolder: "", country: "Morocco"
  });
  const [status,  setStatus]  = useState("idle");
  const [focused, setFocused] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const formatCard = (val) => val.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19);
  const formatExpiry = (val) => {
    const v = val.replace(/\D/g,'');
    return v.length >= 3 ? `${v.slice(0,2)} / ${v.slice(2,4)}` : v;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("loading");
    const dateNow = new Date().toISOString().slice(0,10);
    API.post("/paiements", { montant:150, date_paiement:dateNow, mode_paiement:"Carte", statut:"Payé", id_abonnement:2 })
      .then(() => { setStatus("success"); setFormData({ email:"", cardNumber:"", cardExpiry:"", cardCVC:"", cardHolder:"", country:"Morocco" }); })
      .catch(() => setStatus("error"));
  };

  // Card preview
  const displayNum = formData.cardNumber || "•••• •••• •••• ••••";
  const displayName = formData.cardHolder || "VOTRE NOM";
  const displayExp  = formData.cardExpiry  || "MM / YY";

  if (status === "success") return (
    <div style={S.page}>
      <div style={S.successCard}>
        <div style={S.successIcon}>✓</div>
        <h2 style={S.successTitle}>Paiement réussi !</h2>
        <p style={S.successSub}>Votre abonnement a été activé avec succès</p>
        <div style={S.successAmount}>MAD 150.00</div>
        <button onClick={() => setStatus("idle")} style={S.btnSuccess}>Retour</button>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.wrapper}>

        {/* Left — Card preview */}
        <div style={S.leftPanel}>
          <p style={S.planLabel}>Plan mensuel</p>
          <div style={S.amount}>MAD <span style={S.amountNum}>150</span><span style={S.amountSub}>.00/mois</span></div>
          <p style={S.planDesc}>Accès complet à toutes les installations du club</p>

          {/* Card visual */}
          <div style={S.cardVisual}>
            <div style={S.cardTop}>
              <div style={S.chip}>
                <div style={S.chipLine}/>
                <div style={S.chipLine}/>
              </div>
              <span style={S.cardBrand}>VISA</span>
            </div>
            <div style={S.cardNum}>{displayNum}</div>
            <div style={S.cardBottom}>
              <div>
                <div style={S.cardMeta}>Titulaire</div>
                <div style={S.cardMetaVal}>{displayName}</div>
              </div>
              <div>
                <div style={S.cardMeta}>Expiration</div>
                <div style={S.cardMetaVal}>{displayExp}</div>
              </div>
            </div>
          </div>

          <div style={S.secureNote}>🔒 Paiement sécurisé par chiffrement SSL 256-bit</div>
        </div>

        {/* Right — Form */}
        <div style={S.rightPanel}>
          <h2 style={S.formTitle}>Informations de paiement</h2>

          {status === "error" && (
            <div style={S.errorBanner}>❌ Une erreur est survenue. Veuillez réessayer.</div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>

            <div style={S.field}>
              <label style={S.label}>Adresse email</label>
              <input
                type="email" id="email" value={formData.email} onChange={handleChange}
                style={{ ...S.input, ...(focused==='email' ? S.inputFocus : {}) }}
                placeholder="email"
                onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                required
              />
            </div>

            <div style={S.field}>
              <label style={S.label}>Numéro de carte</label>
              <input
                type="text" id="cardNumber"
                value={formData.cardNumber}
                onChange={e => setFormData({...formData, cardNumber: formatCard(e.target.value)})}
                style={{ ...S.input, ...(focused==='cardNumber' ? S.inputFocus : {}), letterSpacing:'2px' }}
                placeholder="1234 5678 9012 3456"
                onFocus={() => setFocused('cardNumber')} onBlur={() => setFocused(null)}
                maxLength={19} required
              />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div style={S.field}>
                <label style={S.label}>Expiration</label>
                <input
                  type="text" id="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={e => setFormData({...formData, cardExpiry: formatExpiry(e.target.value)})}
                  style={{ ...S.input, ...(focused==='cardExpiry' ? S.inputFocus : {}) }}
                  placeholder="MM / YY"
                  onFocus={() => setFocused('cardExpiry')} onBlur={() => setFocused(null)}
                  maxLength={7} required
                />
              </div>
              <div style={S.field}>
                <label style={S.label}>CVC</label>
                <input
                  type="text" id="cardCVC" value={formData.cardCVC} onChange={handleChange}
                  style={{ ...S.input, ...(focused==='cardCVC' ? S.inputFocus : {}) }}
                  placeholder="•••"
                  onFocus={() => setFocused('cardCVC')} onBlur={() => setFocused(null)}
                  maxLength={3} required
                />
              </div>
            </div>

            <div style={S.field}>
              <label style={S.label}>Nom du titulaire</label>
              <input
                type="text" id="cardHolder" value={formData.cardHolder}
                onChange={e => setFormData({...formData, cardHolder: e.target.value.toUpperCase()})}
                style={{ ...S.input, ...(focused==='cardHolder' ? S.inputFocus : {}), textTransform:'uppercase', letterSpacing:'1px' }}
                placeholder="Nom du titulaire"
                onFocus={() => setFocused('cardHolder')} onBlur={() => setFocused(null)}
                required
              />
            </div>

            <button type="submit" style={{ ...S.btnPay, opacity: status==='loading'?0.7:1 }} disabled={status==='loading'}>
              {status === 'loading' ? '⏳ Traitement...' : '💳 Payer MAD 150.00'}
            </button>

          </form>

         <div style={S.payMethods}>
            <img src="/visa.jpeg"       alt="Visa"       style={{ height: 24, objectFit: 'contain' }} />
            <img src="/Mastercard.jpeg" alt="Mastercard" style={{ height: 30, objectFit: 'contain' }} />
            <img src="/amex.jpeg"       alt="Amex"       style={{ height: 24, objectFit: 'contain' }} />
         </div>
        </div>
      </div>
    </div>
  );
}

const S = {
 page: { padding:'32px 40px', fontFamily:'Segoe UI, sans-serif', minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center' },
  wrapper:     { display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, background:'#1a1f2e', borderRadius:24, overflow:'hidden', border:'1px solid #2d3448', width:'100%', maxWidth:900, boxShadow:'0 24px 80px rgba(0,0,0,.4)' },

  // Left panel
  leftPanel:   { background:'linear-gradient(160deg,#4338ca,#6366f1,#8b5cf6)', padding:'48px 40px', display:'flex', flexDirection:'column', gap:0 },
  planLabel:   { color:'rgba(255,255,255,.7)', fontSize:13, fontWeight:600, textTransform:'uppercase', letterSpacing:1, margin:'0 0 8px' },
  amount:      { color:'#fff', fontSize:18, fontWeight:600, margin:'0 0 12px' },
  amountNum:   { fontSize:52, fontWeight:900, letterSpacing:'-2px' },
  amountSub:   { fontSize:16, opacity:.7 },
  planDesc:    { color:'rgba(255,255,255,.65)', fontSize:13, margin:'0 0 32px', lineHeight:1.6 },

  // Card visual
  cardVisual:  { background:'rgba(255,255,255,.15)', backdropFilter:'blur(10px)', borderRadius:16, padding:'24px', marginBottom:24, border:'1px solid rgba(255,255,255,.2)' },
  cardTop:     { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 },
  chip:        { width:36, height:28, background:'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius:5, display:'flex', flexDirection:'column', justifyContent:'center', gap:4, padding:'4px 6px' },
  chipLine:    { height:2, background:'rgba(0,0,0,.3)', borderRadius:1 },
  cardBrand:   { color:'#fff', fontWeight:900, fontSize:20, letterSpacing:2, fontStyle:'italic' },
  cardNum:     { color:'#fff', fontSize:18, letterSpacing:'3px', fontWeight:600, marginBottom:24, fontFamily:'monospace' },
  cardBottom:  { display:'flex', justifyContent:'space-between' },
  cardMeta:    { color:'rgba(255,255,255,.6)', fontSize:10, textTransform:'uppercase', letterSpacing:1, marginBottom:2 },
  cardMetaVal: { color:'#fff', fontSize:13, fontWeight:600, letterSpacing:'1px' },

  secureNote:  { color:'rgba(255,255,255,.6)', fontSize:12, textAlign:'center', marginTop:'auto', paddingTop:16 },

  // Right panel
  rightPanel:  { padding:'48px 40px', background:'#1a1f2e' },
  formTitle:   { fontSize:22, fontWeight:800, color:'#f1f5f9', margin:'0 0 24px', letterSpacing:'-0.5px' },
  errorBanner: { background:'#3b1f1f', border:'1px solid #ef4444', color:'#f87171', padding:'12px 16px', borderRadius:10, fontSize:13, marginBottom:16 },
  field:       { display:'flex', flexDirection:'column', gap:7 },
  label:       { color:'#94a3b8', fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 },
  input:       { padding:'13px 16px', background:'#232938', border:'1px solid #2d3448', borderRadius:10, color:'#e2e8f0', fontSize:14, outline:'none', fontFamily:'Segoe UI, sans-serif', transition:'border .15s' },
  inputFocus:  { borderColor:'#6366f1', boxShadow:'0 0 0 3px rgba(99,102,241,.15)' },
  btnPay:      { padding:'15px', background:'linear-gradient(135deg,#4338ca,#6366f1)', border:'none', borderRadius:12, color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'Segoe UI, sans-serif', marginTop:4, letterSpacing:'0.3px' },
  payMethods:  { display:'flex', gap:10, marginTop:20, justifyContent:'center' },
  payMethod:   { background:'#232938', border:'1px solid #2d3448', color:'#64748b', padding:'6px 14px', borderRadius:8, fontSize:12, fontWeight:700, letterSpacing:1 },

  // Success
  successCard: { background:'#1a1f2e', borderRadius:24, padding:'60px 48px', textAlign:'center', border:'1px solid #2d3448', maxWidth:440, width:'100%', boxShadow:'0 24px 80px rgba(0,0,0,.4)' },
  successIcon: { width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#15803d,#16a34a)', color:'#fff', fontSize:40, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' },
  successTitle:{ fontSize:24, fontWeight:800, color:'#f1f5f9', margin:'0 0 8px' },
  successSub:  { color:'#64748b', fontSize:14, margin:'0 0 24px' },
  successAmount:{ background:'linear-gradient(135deg,#15803d,#16a34a)', color:'#fff', fontSize:22, fontWeight:800, padding:'12px 32px', borderRadius:12, display:'inline-block', marginBottom:28 },
  btnSuccess:  { padding:'12px 32px', background:'#232938', border:'1px solid #2d3448', borderRadius:10, color:'#e2e8f0', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'Segoe UI, sans-serif' },
};

export default Paiement;