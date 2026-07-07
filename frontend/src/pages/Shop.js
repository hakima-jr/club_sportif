// src/pages/Shop.js
import React, { useState, useEffect } from 'react';

function Icon({ d, size = 16, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}
const IC = {
  shop:    ['M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z','M3 6h18','M16 10a4 4 0 0 1-8 0'],
  plus:    ['M12 5v14','M5 12h14'],
  close:   ['M18 6L6 18','M6 6l12 12'],
  edit:    ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  trash:   ['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'],
  search:  ['M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12z','M21 21l-4.35-4.35'],
  heart:   'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  check:   'M20 6L9 17l-5-5',
  sort:    ['M8 6h13','M8 12h9','M8 18h5'],
  camera:  ['M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z','M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  warning: ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  tag:     ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z','M7 7h.01'],
};

const C = { bgDark:'#0a0e1a', surface:'#111827', surfaceAlt:'#1a2234', border:'#1f2937', borderLight:'#374151', text:'#f8fafc', textMuted:'#94a3b8', textLight:'#cbd5e1', primary:'#6366f1', success:'#22c55e', danger:'#ef4444', warning:'#f59e0b', info:'#3b82f6' };
const BADGE_COLORS = { 'Nouveau':{ bg:'#1e3a5f', color:'#60a5fa', border:'#2563eb' }, 'Promo':{ bg:'#3b1f1f', color:'#f87171', border:'#ef4444' }, 'Top':{ bg:'#2d1f5e', color:'#a78bfa', border:'#7c3aed' } };
const CAT_COLORS = { 'Vêtements':{ bg:'#1e1b4b', color:'#a78bfa' }, 'Chaussures':{ bg:'#0c1e38', color:'#38bdf8' }, 'Équipement':{ bg:'#1c2e1a', color:'#86efac' }, 'Accessoires':{ bg:'#2d2215', color:'#fbbf24' } };
const CATEGORIES = ['Tous','Vêtements','Chaussures','Équipement','Accessoires'];
const BADGE_OPTIONS = ['','Nouveau','Promo','Top'];
const STORAGE_KEY = 'gym_shop_products_v2';
const emptyForm = { name:'', price:'', category:'', badge:'', image:'', desc:'' };

const defaultProducts = [
  { id:1,  name:'T-Shirt Club Sportif',    price:120,  category:'Vêtements',   badge:'Nouveau', image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', desc:"T-shirt respirant 100% polyester, logo club brodé" },
  { id:2,  name:'Short de Sport',          price:95,   category:'Vêtements',   badge:null,      image:'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=400', desc:"Short léger avec poche latérale" },
  { id:3,  name:'Sweat à Capuche',         price:220,  category:'Vêtements',   badge:'Promo',   image:'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', desc:"Sweat chaud avec capuche, parfait pour l'hiver" },
  { id:4,  name:'Chaussures Running',      price:450,  category:'Chaussures',  badge:'Top',     image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', desc:"Chaussures légères avec amorti optimal" },
  { id:5,  name:'Chaussures Football',     price:380,  category:'Chaussures',  badge:null,      image:'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400', desc:"Crampons professionnels pour terrain naturel" },
  { id:6,  name:'Gants de Boxe',           price:280,  category:'Équipement',  badge:'Top',     image:'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400', desc:"Gants en cuir synthétique 12oz" },
  { id:7,  name:'Tapis de Yoga',           price:150,  category:'Équipement',  badge:null,      image:'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', desc:"Tapis antidérapant 6mm avec sangle de transport" },
  { id:8,  name:'Ballon de Football',      price:180,  category:'Équipement',  badge:null,      image:'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=400', desc:"Ballon taille 5, certifié FIFA" },
  { id:9,  name:'Corde à Sauter Pro',      price:75,   category:'Équipement',  badge:null,      image:'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400', desc:"Corde réglable avec poignées ergonomiques" },
  { id:10, name:'Bouteille Sport 1L',      price:65,   category:'Accessoires', badge:null,      image:'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', desc:"Bouteille isotherme inox, garde froid 24h" },
  { id:11, name:'Sac de Sport 30L',        price:195,  category:'Accessoires', badge:'Nouveau', image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', desc:"Sac imperméable compartiment chaussures séparé" },
  { id:12, name:'Genouillère Compression', price:85,   category:'Accessoires', badge:null,      image:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', desc:"Protection genou néoprène, taille universelle" },
  { id:13, name:'Montre GPS Sport',        price:890,  category:'Accessoires', badge:'Top',     image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', desc:"GPS intégré, fréquence cardiaque, étanche 50m" },
];

export default function Shop() {
  const user    = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin' || user.isAdmin === true;

  const [products,   setProducts]   = useState(() => { try { const s=localStorage.getItem(STORAGE_KEY); if(s) return JSON.parse(s); localStorage.setItem(STORAGE_KEY,JSON.stringify(defaultProducts)); return defaultProducts; } catch { return defaultProducts; } });
  const [category,   setCategory]   = useState('Tous');
  const [search,     setSearch]     = useState('');
  const [sortBy,     setSortBy]     = useState('default');
  const [toast,      setToast]      = useState('');
  const [wished,     setWished]     = useState({});
  const [showModal,  setShowModal]  = useState(false);
  const [editMode,   setEditMode]   = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [form,       setForm]       = useState({ ...emptyForm });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); }, [products]);

  const notify = (msg) => { setToast(msg); setTimeout(()=>setToast(''),2500); };
  const toggleWish = (id) => setWished(prev=>({...prev,[id]:!prev[id]}));

  let filtered = products.filter(p => category==='Tous'||p.category===category).filter(p => p.name.toLowerCase().includes(search.toLowerCase())||p.desc.toLowerCase().includes(search.toLowerCase()));
  if (sortBy==='price-asc')  filtered = [...filtered].sort((a,b)=>a.price-b.price);
  if (sortBy==='price-desc') filtered = [...filtered].sort((a,b)=>b.price-a.price);
  if (sortBy==='name')       filtered = [...filtered].sort((a,b)=>a.name.localeCompare(b.name));

  const validateForm = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Le nom est requis';
    if (!form.price||isNaN(form.price)||Number(form.price)<=0) e.price = 'Prix invalide';
    if (!form.category) e.category = 'Choisir une catégorie';
    if (!form.desc.trim()) e.desc = 'La description est requise';
    setFormErrors(e); return Object.keys(e).length===0;
  };

  const openAdd  = () => { setForm({...emptyForm}); setFormErrors({}); setEditMode(false); setSelectedId(null); setShowModal(true); };
  const openEdit = (p) => { setForm({name:p.name, price:String(p.price), category:p.category, badge:p.badge||'', image:p.image, desc:p.desc}); setFormErrors({}); setEditMode(true); setSelectedId(p.id); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setForm({...emptyForm}); setFormErrors({}); setEditMode(false); setSelectedId(null); };

  const addProduct = () => {
    if (!validateForm()) return;
    const np = { id:Date.now(), name:form.name.trim(), price:Number(form.price), category:form.category, badge:form.badge||null, image:form.image.trim()||'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400', desc:form.desc.trim() };
    setProducts([...products, np]); notify('Produit ajouté avec succès'); closeModal();
  };
  const updateProduct = () => {
    if (!validateForm()) return;
    setProducts(products.map(p => p.id===selectedId?{...p, name:form.name.trim(), price:Number(form.price), category:form.category, badge:form.badge||null, image:form.image.trim()||p.image, desc:form.desc.trim()}:p));
    notify('Produit modifié avec succès'); closeModal();
  };
  const deleteProduct = (id) => { if (window.confirm('Supprimer ce produit ?')) { setProducts(products.filter(p=>p.id!==id)); notify('Produit supprimé'); } };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2*1024*1024) { alert('Image trop grande. Max 2MB.'); return; }
      const r = new FileReader(); r.onloadend=()=>setForm(prev=>({...prev,image:r.result})); r.readAsDataURL(file);
    }
  };

  const inputStyle = { padding:'12px 16px', background:'rgba(15,23,42,0.6)', border:'1px solid rgba(51,65,85,0.5)', borderRadius:12, color:'#f1f5f9', outline:'none', fontSize:14, fontFamily:'inherit', width:'100%', boxSizing:'border-box' };
  const errStyle   = { ...inputStyle, borderColor:'#ef4444', boxShadow:'0 0 0 3px rgba(239,68,68,0.15)' };

  return (
    <div style={{ padding:'32px 40px', fontFamily:'Inter, -apple-system, sans-serif', maxWidth:1400, margin:'0 auto', background:C.bgDark, minHeight:'100vh' }}>

      {/* Toast */}
      {toast && <div style={{ position:'fixed', top:20, right:20, zIndex:9999, background:'rgba(34,197,94,0.15)', border:'1px solid #22c55e', color:'#4ade80', padding:'14px 22px', borderRadius:14, fontWeight:700, fontSize:14, boxShadow:'0 8px 32px rgba(0,0,0,.5)', display:'flex', alignItems:'center', gap:8 }}>
        <Icon d={IC.check} size={16} color="#4ade80" /> {toast}
      </div>}

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontSize:28, fontWeight:800, color:C.text, margin:0, letterSpacing:'-0.5px', display:'flex', alignItems:'center', gap:12 }}>
            <Icon d={IC.shop} size={26} color="#6366f1" /> Boutique Club Sportif
          </h1>
          <p style={{ color:C.textMuted, marginTop:8, fontSize:14 }}>Équipements et vêtements de sport — {filtered.length} produit(s)</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 24px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', borderRadius:14, color:'#fff', fontWeight:600, cursor:'pointer', fontSize:14, boxShadow:'0 4px 14px rgba(99,102,241,0.4)' }}>
            <Icon d={IC.plus} size={16} color="#fff" /> Ajouter un produit
          </button>
        )}
      </div>

      {/* Search & Sort */}
      <div style={{ display:'flex', gap:12, marginBottom:14, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:240 }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }}><Icon d={IC.search} size={15} color="#64748b" /></span>
          <input style={{ width:'100%', padding:'11px 40px', background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, color:C.text, fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'inherit' }}
            placeholder="Rechercher un produit…" value={search} onChange={e=>setSearch(e.target.value)} />
          {search && <button onClick={()=>setSearch('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:C.textMuted, cursor:'pointer' }}><Icon d={IC.close} size={14} color={C.textMuted} /></button>}
        </div>
        <div style={{ position:'relative' }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }}><Icon d={IC.sort} size={14} color="#94a3b8" /></span>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ padding:'11px 16px 11px 34px', background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, color:C.textLight, fontSize:13, outline:'none', cursor:'pointer', fontFamily:'inherit', minWidth:160 }}>
            <option value="default">Trier par…</option><option value="price-asc">Prix croissant ↑</option>
            <option value="price-desc">Prix décroissant ↓</option><option value="name">Nom A→Z</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={()=>setCategory(c)} style={{ padding:'9px 20px', borderRadius:20, cursor:'pointer', fontSize:13, fontWeight:category===c?700:500, fontFamily:'inherit', transition:'all .2s', background:category===c?'linear-gradient(135deg,#4338ca,#6366f1)':C.surface, border:category===c?'none':`1px solid ${C.border}`, color:category===c?'#fff':C.textMuted, boxShadow:category===c?'0 4px 14px rgba(99,102,241,0.4)':'none', display:'flex', alignItems:'center', gap:6 }}>
            {c}
          </button>
        ))}
      </div>

      {/* Admin Modal */}
      {showModal && isAdmin && (
        <div style={{ position:'fixed', inset:0, background:'rgba(2,6,23,0.85)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, padding:20 }} onClick={closeModal}>
          <div style={{ background:'#1e293b', border:'1px solid rgba(51,65,85,0.6)', borderRadius:24, padding:'32px 36px', width:'100%', maxWidth:520, boxShadow:'0 25px 50px -12px rgba(0,0,0,0.5)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
              <h3 style={{ color:'#f8fafc', fontSize:20, margin:0, fontWeight:700, display:'flex', alignItems:'center', gap:10 }}>
                <Icon d={editMode?IC.edit:IC.plus} size={18} color="#6366f1" /> {editMode?'Modifier':'Ajouter'} un produit
              </h3>
              <button onClick={closeModal} style={{ width:34, height:34, borderRadius:10, border:'1px solid rgba(51,65,85,0.5)', background:'rgba(30,41,55,0.6)', color:'#94a3b8', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon d={IC.close} size={16} color="#94a3b8" />
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div style={{ gridColumn:'1/-1', display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>Nom du produit <span style={{ color:'#ef4444' }}>*</span></label>
                <input style={formErrors.name?errStyle:inputStyle} placeholder="nom du produit" value={form.name} onChange={e=>{setForm(p=>({...p,name:e.target.value}));if(formErrors.name)setFormErrors(p=>({...p,name:''}));}} />
                {formErrors.name && <span style={{ color:'#ef4444', fontSize:12 }}>{formErrors.name}</span>}
              </div>
              {[['price','Prix (MAD) *','number','prix','price'],['category','Catégorie *','select','category','category']].map(([k,l,t,ph,errK]) => (
                <div key={k} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>{l}</label>
                  {t==='select' ? (
                    <select style={formErrors[errK]?errStyle:inputStyle} value={form[k]} onChange={e=>{setForm(p=>({...p,[k]:e.target.value}));if(formErrors[errK])setFormErrors(p=>({...p,[errK]:''}));}}>
                      <option value="">-- Choisir --</option>
                      {CATEGORIES.filter(c=>c!=='Tous').map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input type={t} style={formErrors[errK]?errStyle:inputStyle} placeholder={ph} value={form[k]} onChange={e=>{setForm(p=>({...p,[k]:e.target.value}));if(formErrors[errK])setFormErrors(p=>({...p,[errK]:''}));}} />
                  )}
                  {formErrors[errK] && <span style={{ color:'#ef4444', fontSize:12 }}>{formErrors[errK]}</span>}
                </div>
              ))}
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>Badge</label>
                <select style={inputStyle} value={form.badge} onChange={e=>setForm(p=>({...p,badge:e.target.value}))}>
                  {BADGE_OPTIONS.map(b=><option key={b} value={b}>{b||'Aucun'}</option>)}
                </select>
              </div>
              <div style={{ gridColumn:'1/-1', display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>Image</label>
                <div style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', background:'rgba(15,23,42,0.6)', border:'1px dashed rgba(51,65,85,0.8)', borderRadius:12 }}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display:'none' }} id="prodImg" />
                  <label htmlFor="prodImg" style={{ padding:'10px 18px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:10, color:'#fff', fontWeight:600, fontSize:13, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6 }}>
                    <Icon d={IC.camera} size={14} color="#fff" /> Choisir une image
                  </label>
                  <span style={{ color:'#64748b', fontSize:12 }}>JPG, PNG • Max 2MB</span>
                </div>
                {form.image && <div style={{ position:'relative', display:'inline-block', marginTop:8 }}>
                  <img src={form.image} alt="preview" style={{ width:80, height:80, borderRadius:12, objectFit:'cover', border:'2px solid #6366f1' }} />
                  <button onClick={()=>setForm(p=>({...p,image:''}))} style={{ position:'absolute', top:-6, right:-6, width:24, height:24, borderRadius:'50%', background:'#ef4444', color:'#fff', border:'2px solid #1e293b', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon d={IC.close} size={10} color="#fff" />
                  </button>
                </div>}
              </div>
              <div style={{ gridColumn:'1/-1', display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ color:'#94a3b8', fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>Description <span style={{ color:'#ef4444' }}>*</span></label>
                <textarea style={{ ...(formErrors.desc?errStyle:inputStyle), resize:'vertical', minHeight:80 }} placeholder="Description du produit..." value={form.desc}
                  onChange={e=>{setForm(p=>({...p,desc:e.target.value}));if(formErrors.desc)setFormErrors(p=>({...p,desc:''}));}} />
                {formErrors.desc && <span style={{ color:'#ef4444', fontSize:12 }}>{formErrors.desc}</span>}
              </div>
            </div>
            <div style={{ marginTop:24, display:'flex', justifyContent:'flex-end', gap:12 }}>
              <button onClick={closeModal} style={{ padding:'12px 24px', background:'rgba(30,41,55,0.6)', border:'1px solid rgba(51,65,85,0.5)', borderRadius:12, color:'#94a3b8', cursor:'pointer', fontWeight:600, fontSize:14 }}>Annuler</button>
              <button onClick={editMode?updateProduct:addProduct} style={{ padding:'12px 28px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', borderRadius:12, color:'#fff', cursor:'pointer', fontWeight:600, fontSize:14, boxShadow:'0 4px 14px rgba(99,102,241,0.4)', display:'flex', alignItems:'center', gap:8 }}>
                <Icon d={editMode?IC.check:IC.plus} size={16} color="#fff" /> {editMode?'Enregistrer':'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px 20px', background:C.surface, borderRadius:16, border:`1px solid ${C.border}` }}>
          <Icon d={IC.search} size={56} color={C.textMuted} />
          <p style={{ color:C.textMuted, margin:'16px 0 0', fontSize:16 }}>Aucun produit trouvé</p>
          {isAdmin && <button onClick={openAdd} style={{ marginTop:16, padding:'10px 20px', background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:10, color:'#818cf8', cursor:'pointer', fontWeight:600, fontSize:13, display:'inline-flex', alignItems:'center', gap:6 }}>
            <Icon d={IC.plus} size={13} color="#818cf8" /> Ajouter votre premier produit
          </button>}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
          {filtered.map(p => {
            const bc = BADGE_COLORS[p.badge] || {};
            const cc = CAT_COLORS[p.category] || { bg:C.surfaceAlt, color:C.textMuted };
            const isWished = wished[p.id];
            return (
              <div key={p.id} style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, overflow:'hidden', display:'flex', flexDirection:'column', transition:'all .3s ease', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 16px 48px rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor=C.borderLight; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.3)'; e.currentTarget.style.borderColor=C.border; }}>
                <div style={{ position:'relative', overflow:'hidden' }}>
                  <img src={p.image} alt={p.name} style={{ width:'100%', height:200, objectFit:'cover', transition:'transform .3s' }}
                    onMouseEnter={e=>e.currentTarget.style.transform='scale(1.07)'}
                    onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'} />
                  {p.badge && <span style={{ position:'absolute', top:14, left:14, padding:'5px 14px', borderRadius:20, fontSize:11, fontWeight:800, background:bc.bg, color:bc.color, border:`1px solid ${bc.border}`, display:'flex', alignItems:'center', gap:4 }}>
                    <Icon d={IC.tag} size={10} color={bc.color} /> {p.badge}
                  </span>}
                  <button onClick={()=>{ toggleWish(p.id); notify(isWished?'Retiré des favoris':`${p.name} ajouté aux favoris`); }} style={{ position:'absolute', top:12, right:12, width:34, height:34, borderRadius:'50%', background:'rgba(10,14,26,0.7)', border:`1px solid ${C.border}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon d={IC.heart} size={16} color={isWished?'#ef4444':'#94a3b8'} strokeWidth={isWished?0:1.8} />
                  </button>
                  {isAdmin && (
                    <div style={{ position:'absolute', bottom:12, right:12, display:'flex', gap:8 }}>
                      <button onClick={()=>openEdit(p)} style={{ width:32, height:32, borderRadius:8, background:'rgba(30,58,138,0.8)', border:'1px solid rgba(37,99,235,0.5)', color:'#60a5fa', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Icon d={IC.edit} size={13} color="#60a5fa" />
                      </button>
                      <button onClick={()=>deleteProduct(p.id)} style={{ width:32, height:32, borderRadius:8, background:'rgba(153,27,27,0.8)', border:'1px solid rgba(239,68,68,0.5)', color:'#f87171', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Icon d={IC.trash} size={13} color="#f87171" />
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ padding:'18px 20px', display:'flex', flexDirection:'column', gap:10, flex:1 }}>
                  <span style={{ display:'inline-flex', alignSelf:'flex-start', alignItems:'center', gap:4, padding:'4px 12px', borderRadius:20, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:1, background:cc.bg, color:cc.color, border:`1px solid ${cc.color}40` }}>
                    {p.category}
                  </span>
                  <h3 style={{ color:C.text, fontSize:15, fontWeight:700, margin:0, lineHeight:1.3 }}>{p.name}</h3>
                  <p style={{ color:C.textMuted, fontSize:13, lineHeight:1.6, margin:0, flex:1 }}>{p.desc}</p>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:`1px solid ${C.border}` }}>
                    <span style={{ color:'#4ade80', fontSize:20, fontWeight:800 }}>{p.price} <span style={{ fontSize:13, color:C.textMuted }}>MAD</span></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}