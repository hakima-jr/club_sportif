// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',  // ← ton backend doit tourner sur ce port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonctions pour les membres (déjà existantes probablement)
export const getMembers = () => API.get('/membres');
export const addMember = (data) => API.post('/membres', data);

// Fonctions pour les abonnements (ajoutées maintenant)
export const getAbonnements = () => API.get('/abonnements');
export const addAbonnement = (data) => API.post('/abonnements', data);

export const getSeances = () => API.get('/seances');
export const addSeance = (data) => API.post('/seances', data);


export const getMembersSimple = () => API.get('/membres-simple');
export const getPresenceForSeance = (id_seance) => API.get(`/presence/${id_seance}`);
export const markPresence = (data) => API.post('/presence', data);

export const getPaiements = () => API.get('/paiements');
export const addPaiement = (data) => API.post('/paiements', data);
export const markPaiementPaye = (id) => API.put(`/paiements/${id}`);

export const getRapports = () => API.get('/rapports');


export default API; 
export const getMemberById = (id) => API.get('/membres/' + id);
