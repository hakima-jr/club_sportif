// src/pages/ResetPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get('token');

  const [password,   setPassword]   = useState('');
  const [confirm,    setConfirm]    = useState('');
  const [showPwd,    setShowPwd]    = useState(false);
  const [status,     setStatus]     = useState(''); // 'loading'|'success'|'error'
  const [msg,        setMsg]        = useState('');

  if (!token) return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.icon}>❌</div>
        <h2 style={S.title}>Lien invalide</h2>
        <p style={S.sub}>Ce lien de réinitialisation est invalide ou a expiré.</p>
        <button style={S.btn} onClick={()=>navigate('/login')}>Retour à la connexion</button>
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setStatus('error'); setMsg('Les mots de passe ne correspondent pas.'); return; }
    if (password.length < 6)  { setStatus('error'); setMsg('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    setStatus('loading');
    try {
      await axios.post(`${API}/reset-password`, { token, newPassword: password });
      setStatus('success');
      setMsg('Mot de passe modifié avec succès !');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setStatus('error');
      setMsg(err.response?.data?.message || 'Lien expiré. Veuillez refaire la demande.');
    }
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        {status === 'success' ? (<>
          <div style={S.icon}>✅</div>
          <h2 style={{ ...S.title, color:'#15803d' }}>Mot de passe modifié !</h2>
          <p style={S.sub}>Redirection vers la connexion...</p>
        </>) : (<>
          <div style={S.icon}>🔑</div>
          <h2 style={S.title}>Nouveau mot de passe</h2>
          <p style={S.sub}>Choisissez un nouveau mot de passe pour votre compte.</p>

          {status === 'error' && <div style={S.error}>{msg}</div>}

          <form onSubmit={handleSubmit} style={{ width:'100%' }}>
            <div style={S.field}>
              <label style={S.label}>Nouveau mot de passe</label>
              <div style={S.inputWrap}>
                <input type={showPwd?'text':'password'} style={S.input} value={password}
                  onChange={e=>setPassword(e.target.value)} placeholder="Minimum 6 caractères" required/>
                <button type="button" style={S.showBtn} onClick={()=>setShowPwd(p=>!p)}>
                  {showPwd?'CACHER':'VOIR'}
                </button>
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Confirmer le mot de passe</label>
              <input type={showPwd?'text':'password'} style={{ ...S.input, borderColor: confirm&&confirm!==password?'#ef4444':'#e2e8f0' }}
                value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Répétez le mot de passe" required/>
              {confirm && confirm !== password && <span style={{ color:'#ef4444', fontSize:11, marginTop:4 }}>Les mots de passe ne correspondent pas</span>}
            </div>
            <button type="submit" style={{ ...S.btn, opacity:status==='loading'?0.7:1, marginTop:8 }} disabled={status==='loading'}>
              {status==='loading'?'Modification...':'Modifier le mot de passe'}
            </button>
          </form>
        </>)}
      </div>
    </div>
  );
}

const S = {
  page:     { minHeight:'100vh', background:'linear-gradient(135deg,#13485f,#243d4a)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Segoe UI,sans-serif', padding:20 },
  card:     { background:'#fff', borderRadius:16, padding:'40px 36px', width:'100%', maxWidth:380, display:'flex', flexDirection:'column', alignItems:'center', boxShadow:'0 20px 60px rgba(0,0,0,.3)' },
  icon:     { fontSize:40, marginBottom:12 },
  title:    { fontSize:20, fontWeight:700, color:'#13485f', margin:'0 0 8px', textAlign:'center' },
  sub:      { fontSize:13, color:'#64748b', margin:'0 0 20px', textAlign:'center', lineHeight:1.5 },
  error:    { background:'#fee2e2', color:'#dc2626', padding:'10px 14px', borderRadius:8, marginBottom:14, fontSize:12, width:'100%', boxSizing:'border-box' },
  field:    { width:'100%', display:'flex', flexDirection:'column', gap:6, marginBottom:14 },
  label:    { color:'#374151', fontSize:12, fontWeight:600 },
  inputWrap:{ position:'relative', display:'flex', alignItems:'center' },
  input:    { width:'100%', padding:'10px 50px 10px 14px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' },
  showBtn:  { position:'absolute', right:12, background:'none', border:'none', color:'#13485f', fontSize:10, fontWeight:600, cursor:'pointer' },
  btn:      { width:'100%', padding:12, background:'#13485f', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer' },
};