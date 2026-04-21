import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMemberById, getAbonnements, getPaiements } from '../services/api';

function ProfilMembre() {
  const { id } = useParams();
  const [membre, setMembre] = useState(null);
  const [abonnements, setAbonnements] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [memRes, aboRes, paiRes] = await Promise.all([
          getMemberById(id),
          getAbonnements(),
          getPaiements()
        ]);
        setMembre(memRes.data);
        setAbonnements(aboRes.data.filter(a => a.id_membre == id));
        setPaiements(paiRes.data.filter(p => p.id_membre == id));
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p>Chargement du profil...</p>
    </div>
  );

  if (!membre) return (
    <div style={styles.errorContainer}>
      <h3>Membre non trouvé</h3>
    </div>
  );

  const initials = `${membre.nom[0]}${membre.prenom[0]}`.toUpperCase();
  const memberSince = new Date(membre.date_inscription).getFullYear();
  const aboActif = abonnements.find(a => new Date(a.date_fin) >= new Date());

  return (
    <div style={styles.page}>
      {/* HEADER BANNER */}
      <div style={styles.banner}>
        <div style={styles.bannerOverlay}></div>
        <div style={styles.bannerContent}>
          {/* Photo */}
          <div style={styles.photoWrapper}>
            <div style={styles.photoContainer}>
              {photo ? (
                <img src={photo} alt="profil" style={styles.photo} />
              ) : (
                <div style={styles.initials}>{initials}</div>
              )}
              <label style={styles.photoEdit} title="Changer la photo">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
                📷
              </label>
            </div>
          </div>

          {/* Nom & Badge */}
          <div style={styles.headerInfo}>
            <h1 style={styles.name}>{membre.prenom} {membre.nom}</h1>
            <span style={{
              ...styles.badge,
              background: aboActif ? '#00c851' : '#ff4444'
            }}>
              {aboActif ? '✓ Abonnement Actif' : '✗ Pas d\'abonnement'}
            </span>
            <p style={styles.memberSince}>Membre depuis {memberSince}</p>
          </div>

          {/* Stats rapides */}
          <div style={styles.quickStats}>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{abonnements.length}</span>
              <span style={styles.statLabel}>Abonnements</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{paiements.length}</span>
              <span style={styles.statLabel}>Paiements</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{membre.type_membre}</span>
              <span style={styles.statLabel}>Type</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={styles.tabsContainer}>
        {['info', 'abonnements', 'paiements'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.tabActive : {})
            }}
          >
            {tab === 'info' ? '👤 Informations' :
             tab === 'abonnements' ? '🏋️ Abonnements' : '💳 Paiements'}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={styles.content}>

        {/* TAB: INFO */}
        {activeTab === 'info' && (
          <div style={styles.infoGrid}>
            {[
              { icon: '👤', label: 'Nom complet', value: `${membre.prenom} ${membre.nom}` },
              { icon: '📧', label: 'Email', value: membre.email },
              { icon: '📞', label: 'Téléphone', value: membre.telephone || '-' },
              { icon: '📍', label: 'Adresse', value: membre.adresse || '-' },
              { icon: '🎂', label: 'Âge', value: `${membre.age} ans` },
              { icon: '📅', label: 'Inscription', value: new Date(membre.date_inscription).toLocaleDateString('fr-FR') },
              { icon: '🏆', label: 'Type de membre', value: membre.type_membre },
              { icon: '🆔', label: 'ID Membre', value: `#${membre.id_personne}` },
            ].map((item, i) => (
              <div key={i} style={styles.infoCard}>
                <span style={styles.infoIcon}>{item.icon}</span>
                <div>
                  <p style={styles.infoLabel}>{item.label}</p>
                  <p style={styles.infoValue}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: ABONNEMENTS */}
        {activeTab === 'abonnements' && (
          <div>
            {abonnements.length === 0 ? (
              <div style={styles.empty}>Aucun abonnement trouvé</div>
            ) : (
              abonnements.map((abo, i) => {
                const isActif = new Date(abo.date_fin) >= new Date();
                return (
                  <div key={i} style={styles.aboCard}>
                    <div style={styles.aboLeft}>
                      <span style={styles.aboIcon}>🏋️</span>
                      <div>
                        <p style={styles.aboType}>{abo.type}</p>
                        <p style={styles.aboDate}>
                          {new Date(abo.date_debut).toLocaleDateString('fr-FR')} →{' '}
                          {new Date(abo.date_fin).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div style={styles.aboRight}>
                      <p style={styles.aboPrix}>{abo.prix} DH</p>
                      <span style={{
                        ...styles.aboStatus,
                        background: isActif ? '#00c85120' : '#ff444420',
                        color: isActif ? '#00c851' : '#ff4444'
                      }}>
                        {isActif ? 'Actif' : 'Expiré'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB: PAIEMENTS */}
        {activeTab === 'paiements' && (
          <div>
            {paiements.length === 0 ? (
              <div style={styles.empty}>Aucun paiement trouvé</div>
            ) : (
              paiements.map((pai, i) => (
                <div key={i} style={styles.paiCard}>
                  <div style={styles.paiLeft}>
                    <span style={styles.paiIcon}>💳</span>
                    <div>
                      <p style={styles.paiMode}>{pai.mode_paiement}</p>
                      <p style={styles.paiDate}>
                        {new Date(pai.date_paiement).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div style={styles.paiRight}>
                    <p style={styles.paiMontant}>{pai.montant} DH</p>
                    <span style={{
                      ...styles.paiStatus,
                      background: pai.statut === 'Payé' ? '#00c85120' : '#ff990020',
                      color: pai.statut === 'Payé' ? '#00c851' : '#ff9900'
                    }}>
                      {pai.statut}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0f1117', color: '#fff', fontFamily: "'Segoe UI', sans-serif" },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#fff' },
  errorContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#fff' },
  banner: { position: 'relative', background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3561 50%, #1a1f2e 100%)', padding: '40px 20px 30px', overflow: 'hidden' },
  bannerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'url("https://www.transparenttextures.com/patterns/dark-matter.png")', opacity: 0.3 },
  bannerContent: { position: 'relative', maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' },
  photoWrapper: { flexShrink: 0 },
  photoContainer: { position: 'relative', width: '110px', height: '110px' },
  photo: { width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #4f6ef7' },
  initials: { width: '110px', height: '110px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 'bold', color: '#fff', border: '4px solid rgba(255,255,255,0.2)' },
  photoEdit: { position: 'absolute', bottom: '5px', right: '5px', background: '#4f6ef7', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px' },
  headerInfo: { flex: 1 },
  name: { fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px', color: '#fff' },
  badge: { display: 'inline-block', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', color: '#fff' },
  memberSince: { color: '#aaa', fontSize: '13px', marginTop: '8px' },
  quickStats: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  statBox: { background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px', textAlign: 'center', minWidth: '80px' },
  statNum: { display: 'block', fontSize: '20px', fontWeight: 'bold', color: '#4f6ef7' },
  statLabel: { display: 'block', fontSize: '11px', color: '#aaa', marginTop: '4px' },
  tabsContainer: { display: 'flex', gap: '0', background: '#1a1f2e', borderBottom: '2px solid #2a2f3e', maxWidth: '900px', margin: '0 auto' },
  tab: { flex: 1, padding: '14px', background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s' },
  tabActive: { color: '#4f6ef7', borderBottom: '3px solid #4f6ef7', background: 'rgba(79,110,247,0.08)' },
  content: { maxWidth: '900px', margin: '20px auto', padding: '0 20px' },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' },
  infoCard: { background: '#1a1f2e', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #2a2f3e' },
  infoIcon: { fontSize: '24px', flexShrink: 0 },
  infoLabel: { color: '#aaa', fontSize: '12px', margin: '0 0 4px' },
  infoValue: { color: '#fff', fontWeight: '600', margin: 0 },
  aboCard: { background: '#1a1f2e', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', border: '1px solid #2a2f3e' },
  aboLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  aboIcon: { fontSize: '28px' },
  aboType: { fontWeight: '600', margin: '0 0 4px', color: '#fff' },
  aboDate: { color: '#aaa', fontSize: '12px', margin: 0 },
  aboRight: { textAlign: 'right' },
  aboPrix: { fontWeight: 'bold', fontSize: '18px', color: '#4f6ef7', margin: '0 0 6px' },
  aboStatus: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  paiCard: { background: '#1a1f2e', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', border: '1px solid #2a2f3e' },
  paiLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  paiIcon: { fontSize: '28px' },
  paiMode: { fontWeight: '600', margin: '0 0 4px', color: '#fff' },
  paiDate: { color: '#aaa', fontSize: '12px', margin: 0 },
  paiRight: { textAlign: 'right' },
  paiMontant: { fontWeight: 'bold', fontSize: '18px', color: '#00c851', margin: '0 0 6px' },
  paiStatus: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#aaa', padding: '40px', background: '#1a1f2e', borderRadius: '12px' },
  spinner: { width: '40px', height: '40px', border: '4px solid #333', borderTop: '4px solid #4f6ef7', borderRadius: '50%', animation: 'spin 1s linear infinite' },
};

export default ProfilMembre;