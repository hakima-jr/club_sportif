// src/pages/Abonnements.js
import React, { useState, useEffect, useRef } from 'react';
import { getAbonnements, addAbonnement, getMembers, updateAbonnement, deleteAbonnement } from '../api/api';

function Icon({ d, size = 14, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}
const IC = {
  sub:     ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8','M10 9H8'],
  plus:    ['M12 5v14','M5 12h14'],
  close:   ['M18 6L6 18','M6 6l12 12'],
  search:  ['M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12z','M21 21l-4.35-4.35'],
  edit:    ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  trash:   ['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'],
  check:   'M20 6L9 17l-5-5',
  warning: ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  reset:   ['M1 4v6h6','M23 20v-6h-6','M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15'],
  save:    ['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z','M17 21v-8H7v8','M7 3v5h8'],
  calendar:['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
};

function Abonnements() {
  const today = new Date().toISOString().split('T')[0];
  const EMPTY_FORM = { type: '', date_debut: today, date_fin: '', prix: '', id_membre: '' };

  const [abonnements,  setAbonnements]  = useState([]);
  const [membres,      setMembres]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showForm,     setShowForm]     = useState(false);
  const [editAbo,      setEditAbo]      = useState(null);
  const [toast,        setToast]        = useState({ text: '', type: '' });
  const [memberSearch, setMemberSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [dateError,    setDateError]    = useState('');
  const [search,       setSearch]       = useState('');
  const [filterMois,   setFilterMois]   = useState('');
  const [filterAnnee,  setFilterAnnee]  = useState('');
  const [formData,     setFormData]     = useState({ ...EMPTY_FORM });
  const dropRef = useRef();

  const notify = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: '', type: '' }), 3000);
  };

  const fetchAll = async () => {
    try {
      const [a, m] = await Promise.all([getAbonnements(), getMembers()]);
      setAbonnements(a.data || []);
      setMembres(m.data || []);
    } catch { notify('Erreur chargement des données', 'error'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => {
    const handle = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleCancel = () => { setFormData({ ...EMPTY_FORM }); setMemberSearch(''); setDateError(''); setShowDropdown(false); };
  const handleClose  = () => { handleCancel(); setShowForm(false); };
  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet abonnement ?')) return;
    try { await deleteAbonnement(id); notify('Abonnement supprimé'); fetchAll(); }
    catch { notify('Erreur suppression', 'error'); }
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try { await updateAbonnement(editAbo.id_abonnement, editAbo); notify('Abonnement modifié'); setEditAbo(null); fetchAll(); }
    catch { notify('Erreur modification', 'error'); }
  };
  const filteredMembres = membres.filter(m => `${m.nom} ${m.prenom}`.toLowerCase().includes(memberSearch.toLowerCase()));
  const selectMembre = (m) => { setFormData({ ...formData, id_membre: m.id_personne }); setMemberSearch(`${m.nom} ${m.prenom}`); setShowDropdown(false); };
  const handleDateFin = (val) => { setDateError(val && formData.date_debut && val <= formData.date_debut ? 'La date de fin doit être après la date de début' : ''); setFormData({ ...formData, date_fin: val }); };
  const handleDateDebut = (val) => { setDateError(formData.date_fin && formData.date_fin <= val ? 'La date de fin doit être après la date de début' : ''); setFormData({ ...formData, date_debut: val }); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dateError) return;
    if (formData.date_fin <= formData.date_debut) { setDateError('La date de fin doit être après la date de début'); return; }
    try { await addAbonnement(formData); notify('Abonnement ajouté avec succès'); handleCancel(); fetchAll(); }
    catch { notify("Erreur lors de l'ajout", 'error'); }
  };
  const nextDay = (d) => { const dt = new Date(d); dt.setDate(dt.getDate() + 1); return dt.toISOString().split('T')[0]; };
  const formatDate = (d) => d ? d.split('T')[0] : '—';
  const annees = [...new Set(abonnements.map(a => a.date_debut ? new Date(a.date_debut).getFullYear() : null).filter(Boolean))].sort((a, b) => b - a);
  const mois = [
    { val: '1', label: 'Janvier' }, { val: '2', label: 'Février' }, { val: '3', label: 'Mars' }, { val: '4', label: 'Avril' },
    { val: '5', label: 'Mai' }, { val: '6', label: 'Juin' }, { val: '7', label: 'Juillet' }, { val: '8', label: 'Août' },
    { val: '9', label: 'Septembre' }, { val: '10', label: 'Octobre' }, { val: '11', label: 'Novembre' }, { val: '12', label: 'Décembre' },
  ];
  const displayed = abonnements.filter(a => {
    const matchSearch = !search || (a.nom_membre || '').toLowerCase().includes(search.toLowerCase());
    const date = a.date_debut ? new Date(a.date_debut) : null;
    const matchMois  = !filterMois  || (date && String(date.getMonth() + 1) === filterMois);
    const matchAnnee = !filterAnnee || (date && String(date.getFullYear()) === filterAnnee);
    return matchSearch && matchMois && matchAnnee;
  });

  if (loading) return <div style={S.center}>Chargement...</div>;

  return (
    <div style={S.page}>

      {/* Toast */}
      {toast.text && (
        <div style={{ ...S.toast, background: toast.type === 'error' ? '#3b1f1f' : '#14532d', borderColor: toast.type === 'error' ? '#ef4444' : '#16a34a', color: toast.type === 'error' ? '#f87171' : '#4ade80', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon d={toast.type === 'error' ? IC.warning : IC.check} size={14} color={toast.type === 'error' ? '#f87171' : '#4ade80'} />
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>
            <Icon d={IC.sub} size={24} color="#0891b2" style={{ marginRight: 10 }} /> Gestion des Abonnements
          </h1>
          <p style={S.subtitle}>{abonnements.length} abonnement(s) enregistré(s)</p>
        </div>
        <button style={showForm ? S.btnClose : S.btnPrimary} onClick={() => { if (showForm) { handleClose(); } else { handleCancel(); setShowForm(true); } }}>
          {showForm
            ? <><Icon d={IC.close} size={14} color="#94a3b8" /> Fermer le formulaire</>
            : <><Icon d={IC.plus} size={14} color="#fff" /> Nouvel abonnement</>
          }
        </button>
      </div>

      {/* Filtres */}
      <div style={S.filtersRow}>
        <div style={S.searchWrap}>
          <span style={S.searchIcon}><Icon d={IC.search} size={15} color="#64748b" /></span>
          <input type="text" style={S.searchInput} placeholder="Rechercher par nom du membre..."
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button style={S.clearBtn} onClick={() => setSearch('')}><Icon d={IC.close} size={13} color="#64748b" /></button>}
        </div>
        <select style={S.filterSelect} value={filterMois} onChange={e => setFilterMois(e.target.value)}>
          <option value="">Tous les mois</option>
          {mois.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
        </select>
        <select style={S.filterSelect} value={filterAnnee} onChange={e => setFilterAnnee(e.target.value)}>
          <option value="">Toutes les années</option>
          {annees.map(a => <option key={a} value={String(a)}>{a}</option>)}
        </select>
        {(search || filterMois || filterAnnee) && (
          <button style={S.resetBtn} onClick={() => { setSearch(''); setFilterMois(''); setFilterAnnee(''); }}>
            <Icon d={IC.reset} size={13} color="#f87171" /> Réinitialiser
          </button>
        )}
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <div style={S.card}>
          <form onSubmit={handleSubmit}>
            <div style={S.row3}>
              <div style={S.field}>
                <label style={S.label}>Type *</label>
                <select style={S.input} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} required>
                  <option value="">-- Choisir un type --</option>
                  <option value="Mensuel">Mensuel</option><option value="Trimestriel">Trimestriel</option>
                  <option value="Semestriel">Semestriel</option><option value="Annuel">Annuel</option>
                </select>
              </div>

              <div style={{ ...S.field, position: 'relative' }} ref={dropRef}>
                <label style={S.label}>Membre *</label>
                <div style={S.searchMemberWrap}>
                  <span style={S.searchMemberIcon}><Icon d={IC.search} size={14} color="#64748b" /></span>
                  <input style={{ ...S.input, paddingLeft: 34 }} placeholder="Taper le nom du membre..."
                    value={memberSearch}
                    onChange={e => { setMemberSearch(e.target.value); setShowDropdown(true); setFormData({ ...formData, id_membre: '' }); }}
                    onFocus={() => setShowDropdown(true)} />
                  {memberSearch && (
                    <button type="button" style={S.clearMember} onClick={() => { setMemberSearch(''); setFormData({ ...formData, id_membre: '' }); }}>
                      <Icon d={IC.close} size={13} color="#64748b" />
                    </button>
                  )}
                </div>
                {showDropdown && memberSearch && (
                  <div style={S.dropdown}>
                    {filteredMembres.length === 0
                      ? <div style={S.dropEmpty}>Aucun membre trouvé</div>
                      : filteredMembres.slice(0, 8).map(m => (
                        <div key={m.id_personne} style={S.dropItem}
                          onClick={() => selectMembre(m)}
                          onMouseEnter={e => e.currentTarget.style.background = '#2d3448'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <div style={S.dropAvatar}>{m.prenom?.[0]}{m.nom?.[0]}</div>
                          <div>
                            <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{m.nom} {m.prenom}</div>
                            <div style={{ color: '#64748b', fontSize: 11 }}>{m.email}</div>
                          </div>
                          {formData.id_membre === m.id_personne && <Icon d={IC.check} size={14} color="#4ade80" style={{ marginLeft: 'auto' }} />}
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>

              <div style={S.field}>
                <label style={S.label}>Date début *</label>
                <input type="date" style={S.input} value={formData.date_debut} min={today} onChange={e => handleDateDebut(e.target.value)} required />
              </div>
            </div>

            <div style={{ ...S.row3, marginTop: 14 }}>
              <div style={S.field}>
                <label style={S.label}>Date fin *</label>
                <input type="date" style={{ ...S.input, borderColor: dateError ? '#ef4444' : '#2d3448' }}
                  value={formData.date_fin} min={formData.date_debut ? nextDay(formData.date_debut) : today}
                  onChange={e => handleDateFin(e.target.value)} required />
                {dateError && <span style={S.dateError}><Icon d={IC.warning} size={12} color="#f87171" /> {dateError}</span>}
              </div>
              <div style={S.field}>
                <label style={S.label}>Prix (DH) *</label>
                <input type="number" style={S.input} step="0.01" min="0" value={formData.prix} onChange={e => setFormData({ ...formData, prix: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" style={S.btnCancel} onClick={handleCancel}>Annuler</button>
                <button type="submit" style={{ ...S.btnSubmit, opacity: (dateError || !formData.id_membre) ? 0.6 : 1 }} disabled={!!dateError || !formData.id_membre}>
                  <Icon d={IC.save} size={14} color="#fff" /> Enregistrer
                </button>
              </div>
            </div>

            {formData.id_membre && (
              <div style={S.selectedMembre}>
                <Icon d={IC.check} size={14} color="#4ade80" /> Membre sélectionné : <strong style={{ color: '#4ade80' }}>{memberSearch}</strong>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Modal modification */}
      {editAbo && (
        <div style={S.overlay} onClick={() => setEditAbo(null)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <h3 style={S.modalTitle}><Icon d={IC.edit} size={18} color="#6366f1" /> Modifier l'abonnement</h3>
              <button style={S.closeBtn} onClick={() => setEditAbo(null)}><Icon d={IC.close} size={16} color="#94a3b8" /></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={S.field}>
                  <label style={S.label}>Type</label>
                  <select style={S.input} value={editAbo.type || ''} onChange={e => setEditAbo({ ...editAbo, type: e.target.value })} required>
                    <option value="Mensuel">Mensuel</option><option value="Trimestriel">Trimestriel</option>
                    <option value="Semestriel">Semestriel</option><option value="Annuel">Annuel</option>
                  </select>
                </div>
                <div style={S.field}>
                  <label style={S.label}>Prix (DH)</label>
                  <input type="number" style={S.input} value={editAbo.prix || ''} onChange={e => setEditAbo({ ...editAbo, prix: e.target.value })} required />
                </div>
                <div style={S.field}>
                  <label style={S.label}>Date début</label>
                  <input type="date" style={S.input} value={editAbo.date_debut?.slice(0, 10) || ''} onChange={e => setEditAbo({ ...editAbo, date_debut: e.target.value })} required />
                </div>
                <div style={S.field}>
                  <label style={S.label}>Date fin</label>
                  <input type="date" style={S.input} value={editAbo.date_fin?.slice(0, 10) || ''} min={editAbo.date_debut ? nextDay(editAbo.date_debut) : ''} onChange={e => setEditAbo({ ...editAbo, date_fin: e.target.value })} required />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" style={S.btnCancel} onClick={() => setEditAbo(null)}>Annuler</button>
                <button type="submit" style={S.btnSubmit}><Icon d={IC.save} size={14} color="#fff" /> Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <p style={S.count}>{displayed.length} résultat(s)</p>

      {/* Table */}
      {displayed.length === 0 ? (
        <div style={S.empty}>
          <Icon d={IC.search} size={36} color="#64748b" />
          <p style={{ color: '#64748b', margin: '8px 0 0' }}>Aucun abonnement trouvé</p>
        </div>
      ) : (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr style={S.thead}>
                {['ID', 'Type', 'Début', 'Fin', 'Prix', 'Membre', 'Statut', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {displayed.map((a, i) => {
                const isActif = new Date(a.date_fin) >= new Date();
                return (
                  <tr key={a.id_abonnement} style={{ background: i % 2 === 0 ? 'transparent' : '#1e2537' }}>
                    <td style={S.td}><span style={S.idBadge}>#{a.id_abonnement}</span></td>
                    <td style={S.td}><span style={S.typeBadge}>{a.type}</span></td>
                    <td style={S.td}>{formatDate(a.date_debut)}</td>
                    <td style={S.td}>{formatDate(a.date_fin)}</td>
                    <td style={S.td}><strong style={{ color: '#4ade80' }}>{a.prix} DH</strong></td>
                    <td style={S.td}>{a.nom_membre || `Membre #${a.id_membre}`}</td>
                    <td style={S.td}>
                      <span style={{ background: isActif ? '#14532d' : '#3b1f1f', color: isActif ? '#4ade80' : '#f87171', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                        {isActif ? 'Actif' : 'Expiré'}
                      </span>
                    </td>
                    <td style={S.td}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => { setEditAbo(a); setShowForm(false); }} style={S.editBtn}>
                          <Icon d={IC.edit} size={12} color="#4ade80" /> Modifier
                        </button>
                        <button onClick={() => handleDelete(a.id_abonnement)} style={S.deleteBtn}>
                          <Icon d={IC.trash} size={12} color="#f87171" /> Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const S = {
  page:             { padding: '32px 40px', fontFamily: 'Segoe UI, sans-serif', maxWidth: 1200, margin: '0 auto' },
  center:           { padding: 60, textAlign: 'center', color: '#94a3b8' },
  toast:            { position: 'fixed', top: 20, right: 20, padding: '12px 20px', borderRadius: 10, border: '1px solid', fontWeight: 600, fontSize: 14, zIndex: 9999 },
  header:           { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title:            { fontSize: 26, fontWeight: 800, color: '#f1f5f9', margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: 10 },
  subtitle:         { color: '#64748b', marginTop: 4, fontSize: 13 },
  btnPrimary:       { padding: '10px 22px', background: 'linear-gradient(135deg,#0369a1,#0891b2)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Segoe UI, sans-serif', display: 'flex', alignItems: 'center', gap: 8 },
  btnClose:         { padding: '10px 22px', background: '#232938', border: '1px solid #2d3448', borderRadius: 10, color: '#94a3b8', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Segoe UI, sans-serif', display: 'flex', alignItems: 'center', gap: 8 },
  filtersRow:       { display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' },
  searchWrap:       { position: 'relative', display: 'flex', alignItems: 'center', flex: 1, minWidth: 220 },
  searchIcon:       { position: 'absolute', left: 14, pointerEvents: 'none' },
  searchInput:      { width: '100%', padding: '10px 36px', background: '#1a1f2e', border: '1px solid #2d3448', borderRadius: 12, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'Segoe UI, sans-serif' },
  clearBtn:         { position: 'absolute', right: 12, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' },
  filterSelect:     { padding: '10px 14px', background: '#1a1f2e', border: '1px solid #2d3448', borderRadius: 12, color: '#e2e8f0', fontSize: 13, outline: 'none', cursor: 'pointer', fontFamily: 'Segoe UI, sans-serif' },
  resetBtn:         { padding: '10px 16px', background: '#3b1f1f', border: '1px solid #ef4444', borderRadius: 10, color: '#f87171', fontSize: 13, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 },
  card:             { background: '#1a1f2e', borderRadius: 16, padding: '24px 28px', marginBottom: 20, border: '1px solid #2d3448' },
  row3:             { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'end' },
  field:            { display: 'flex', flexDirection: 'column', gap: 6 },
  label:            { color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 },
  input:            { padding: '10px 14px', background: '#232938', border: '1px solid #2d3448', borderRadius: 8, color: '#e2e8f0', fontSize: 14, outline: 'none', fontFamily: 'Segoe UI, sans-serif', width: '100%', boxSizing: 'border-box' },
  searchMemberWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  searchMemberIcon: { position: 'absolute', left: 10, pointerEvents: 'none' },
  clearMember:      { position: 'absolute', right: 10, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' },
  dropdown:         { position: 'absolute', top: '100%', left: 0, right: 0, background: '#1a1f2e', border: '1px solid #2d3448', borderRadius: 10, zIndex: 100, maxHeight: 240, overflowY: 'auto', marginTop: 4, boxShadow: '0 8px 32px rgba(0,0,0,.4)' },
  dropItem:         { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', transition: 'background .1s' },
  dropAvatar:       { width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#4338ca,#6366f1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 },
  dropEmpty:        { padding: '14px', color: '#64748b', textAlign: 'center', fontSize: 13 },
  dateError:        { color: '#f87171', fontSize: 12, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 },
  selectedMembre:   { marginTop: 14, padding: '10px 14px', background: '#14532d20', border: '1px solid #16a34a40', borderRadius: 8, color: '#94a3b8', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 },
  btnSubmit:        { padding: '10px 28px', background: 'linear-gradient(135deg,#0369a1,#0891b2)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 },
  btnCancel:        { padding: '10px 20px', background: '#232938', border: '1px solid #2d3448', borderRadius: 10, color: '#94a3b8', fontSize: 14, cursor: 'pointer', fontFamily: 'Segoe UI, sans-serif', whiteSpace: 'nowrap' },
  count:            { color: '#64748b', fontSize: 12, marginBottom: 14 },
  empty:            { textAlign: 'center', padding: '48px 0', background: '#1a1f2e', borderRadius: 16, border: '1px solid #2d3448', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  tableWrap:        { background: '#1a1f2e', borderRadius: 16, border: '1px solid #2d3448', overflow: 'hidden' },
  table:            { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  thead:            { background: '#232938' },
  th:               { padding: '13px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  td:               { padding: '12px 16px', borderBottom: '1px solid #1e2435', color: '#cbd5e1' },
  idBadge:          { color: '#64748b', fontSize: 12 },
  typeBadge:        { background: '#0c3044', color: '#38bdf8', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  editBtn:          { padding: '5px 10px', background: '#1f2d1f', border: '1px solid #16a34a', borderRadius: 7, color: '#4ade80', fontSize: 12, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 },
  deleteBtn:        { padding: '5px 10px', background: '#3b1f1f', border: '1px solid #ef4444', borderRadius: 7, color: '#f87171', fontSize: 12, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 },
  overlay:          { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(4px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal:            { background: '#1a1f2e', border: '1px solid #2d3448', borderRadius: 20, padding: 32, width: '100%', maxWidth: 520 },
  modalHeader:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle:       { color: '#f1f5f9', fontSize: 18, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 },
  closeBtn:         { background: '#232938', border: '1px solid #2d3448', borderRadius: 8, color: '#94a3b8', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};

export default Abonnements;