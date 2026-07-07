import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Interceptor bach t'zid l-token f koul requête
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

// ─── Membres ───────────────────────────────────────────────
export const getMembers    = ()         => API.get('/membres');
export const getMemberById = (id)       => API.get(`/membres/${id}`);
export const addMember     = (data)     => API.post('/membres', data);
export const updateMember  = (id, data) => API.put(`/membres/${id}`, data);
export const deleteMember  = (id)       => API.delete(`/membres/${id}`);

// ─── Abonnements ───────────────────────────────────────────
export const getAbonnements   = ()         => API.get('/abonnements');
export const addAbonnement    = (data)     => API.post('/abonnements', data);
export const updateAbonnement = (id, data) => API.put(`/abonnements/${id}`, data);
export const deleteAbonnement = (id)       => API.delete(`/abonnements/${id}`);

// ─── Séances ───────────────────────────────────────────────
export const getSeances   = ()         => API.get('/seances');
export const addSeance    = (data)     => API.post('/seances', data);
export const deleteSeance = (id)       => API.delete(`/seances/${id}`);
export const getMembresBySeance = (id) => API.get(`/seances/${id}/membres`);

// ─── Sports & Coachs ───────────────────────────────────────
export const getSports = () => API.get('/sports');
export const getCoachs = () => API.get('/coachs');
export const getPaiementCoachs = () => API.get('/paiement-coachs');

// ─── Paiements & Rapports ──────────────────────────────────
export const getPaiements           = () => API.get('/paiements');
export const getPaiementsByMembre   = (id) => API.get(`/paiements-par-membre/${id}`);
export const getPaiementsByAbonnement = (id) => API.get(`/paiements-par-abonnement/${id}`);
export const addPaiement            = (data) => API.post('/paiements', data);
export const validerPaiement        = (id) => API.put(`/paiements/${id}`);
export const updatePaiement         = (id, data) => API.put(`/paiements/update/${id}`, data);
export const deletePaiement         = (id) => API.delete(`/paiements/${id}`);
export const getRapports            = () => API.get('/rapports');

// ⭐ NOUVEAU : Admin Profile ────────────────────────────────
export const getAdminProfil   = () => API.get('/admin/profil');
export const updateAdminProfil = (data) => API.put('/admin/profil', data);
export const changeAdminPassword = (data) => API.put('/admin/password', data);
export const getAdminStats    = () => API.get('/admin/stats');
export const getAdminActivite = () => API.get('/admin/activite');