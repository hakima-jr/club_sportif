// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const PHOTOS = {
  gym1: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80',
  gym2: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
  gym3: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800&q=80',
  gym4: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
};

const Icon = ({ d, size = 20, color = 'currentColor', strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

const Icons = {
  dumbbell:   ['M6.5 6.5h11','M6.5 17.5h11','M3 9.5h3v5H3z','M18 9.5h3v5h-3z','M6 12h12'],
  users:      ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M23 21v-2a4 4 0 0 0-3-3.87','M16 3.13a4 4 0 0 1 0 7.75','M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  coach:      ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z','M12 11v4','M10 15h4'],
  equipment:  ['M6.5 6.5h11','M6.5 17.5h11','M3 9.5h3v5H3z','M18 9.5h3v5h-3z','M6 12h12'],
  trophy:     ['M6 9H3V4h3','M18 9h3V4h-3','M6 4h12v8a6 6 0 0 1-12 0V4z','M9 21h6','M12 17v4'],
  star:       'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  rocket:     ['M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z','M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z','M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0','M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5'],
  mapPin:     ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z','M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  phone:      'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.07 6.07l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  mail:       ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6'],
  clock:      ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 6v6l4 2'],
  map:        ['M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z','M8 2v16','M16 6v16'],
  check:      'M20 6L9 17l-5-5',
  barChart:   ['M18 20V10','M12 20V4','M6 20v-6'],
  calendar:   ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  user:       ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  filter:     ['M22 3H2l8 9.46V19l4 2v-8.54L22 3z'],
  chevLeft:   'M15 18l-6-6 6-6',
  chevRight:  'M9 18l6-6-6-6',
  chevDown:   'M6 9l6 6 6-6',
  x:          ['M18 6L6 18','M6 6l12 12'],
  arrowRight: ['M5 12h14','M12 5l7 7-7 7'],
  flame:      ['M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'],
  heart:      ['M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'],
  shield:     ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  activity:   ['M22 12h-4l-3 9L9 3l-3 9H2'],
  menu:       ['M3 12h18','M3 6h18','M3 18h18'],
};

function SvgIcon({ name, size = 20, color = '#f97316', strokeWidth = 1.8 }) {
  const d = Icons[name];
  if (!d) return null;
  return <Icon d={d} size={size} color={color} strokeWidth={strokeWidth} />;
}

const NAV_LINKS = [
  { href: '#accueil',  label: 'Accueil' },
  { href: '#about',    label: 'A propos' },
  { href: '#services', label: 'Services' },
  { href: '#planning', label: 'Programme' },
  { href: '#galerie',  label: 'Galerie' },
  { href: '#location', label: 'Localisation' },
  { href: '#contact',  label: 'Contact' },
];

const STATS = [
  { number: '2000+', label: 'Membres actifs' },
  { number: '25+',   label: 'Coachs experts' },
  { number: '50+',   label: 'Cours / semaine' },
];

const AWARDS = [
  { iconName: 'trophy', title: 'Prix & recompenses',   desc: 'Laureate des Maroc Web Awards 2018' },
  { iconName: 'star',   title: 'Startup coup de coeur', desc: 'SportupSummit 2019 en France' },
  { iconName: 'rocket', title: 'Reconnue par l Etat',  desc: 'Felicitee par le Ministre des Sports' },
];

const SERVICES = [
  { iconName: 'barChart', title: 'Programmes personnalises', desc: 'Des entrainements adaptes a vos objectifs et a votre niveau.' },
  { iconName: 'coach',    title: 'Coachs certifies',         desc: 'Encadrement par des professionnels diplomes d Etat.' },
  { iconName: 'equipment',title: 'Equipements modernes',     desc: 'Des installations et machines de derniere generation.' },
];

const GALLERY_ITEMS = [
  { src: PHOTOS.gym1, alt: 'Salle de sport moderne' },
  { src: PHOTOS.gym2, alt: 'Entrainement en groupe' },
  { src: PHOTOS.gym3, alt: 'Equipements de qualite' },
  { src: PHOTOS.gym4, alt: 'Interieur du club' },
];

const CONTACT_ITEMS = [
  { iconName: 'mail',   label: 'Email',            value: 'FitClub@gmail.com' },
  { iconName: 'phone',  label: 'Telephone',        value: '+212 623 456 789' },
  { iconName: 'phone',  label: 'Fixe',             value: '+212 565 635 982' },
  { iconName: 'mapPin', label: 'Bureau principal', value: 'Avenue Hassan II, Tetouan 93000, Maroc' },
];

const CLUB = {
  name:    'FITCLUB Tetouan',
  address: 'Avenue Hassan II, Tetouan 93000, Maroc',
  phone:   '+212 5 39 456 789',
  email:   'FitClub@gmail.com',
  hours:   'Lun - Sam : 6h - 23h  .  Dim : 8h - 20h',
  mapSrc:  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3327.0!2d-5.3684!3d35.5785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0b4c6b7b7b7b7b%3A0x0!2sAvenue+Hassan+II%2C+T%C3%A9touan!5e0!3m2!1sfr!2sma!4v1700000000000',
  mapsLink:'https://www.google.com/maps/search/FitClub+Hassan+II+Tetouan+Maroc',
};

const niveauStyle = (n) => {
  if (n === 'Debutant')      return { bg: 'rgba(22,163,74,0.08)',  color: '#16a34a', border: '#22c55e' };
  if (n === 'Intermediaire') return { bg: 'rgba(37,99,235,0.08)',  color: '#2563eb', border: '#3b82f6' };
  if (n === 'Avance')        return { bg: 'rgba(220,38,38,0.08)',   color: '#dc2626', border: '#ef4444' };
  return { bg: 'rgba(100,116,139,0.08)', color: '#64748b', border: '#94a3b8' };
};

const publicStyle = (p) => {
  if (p === 'Femmes')  return { bg: 'rgba(190,24,93,0.08)',  color: '#be185d', border: '#ec4899' };
  if (p === 'Hommes')  return { bg: 'rgba(2,132,199,0.08)',  color: '#0284c7', border: '#0ea5e9' };
  if (p === 'Enfants') return { bg: 'rgba(217,119,6,0.08)',  color: '#d97706', border: '#f59e0b' };
  return { bg: 'rgba(124,58,237,0.08)', color: '#7c3aed', border: '#8b5cf6' };
};

function PlanningSection() {
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSport, setFilterSport] = useState('');
  const [filterPublic, setFilterPublic] = useState('');
  const [filterNiveau, setFilterNiveau] = useState('');
  const [sports, setSports] = useState([]);
  const [selectedSeance, setSelectedSeance] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();

  const getWeekDays = (offset = 0) => {
    const days = [];
    const monday = new Date(today);
    const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;
    monday.setDate(today.getDate() - dayOfWeek + offset * 7);
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays(weekOffset);
  const weekStart = weekDays[0].toISOString().split('T')[0];
  const weekEnd   = weekDays[6].toISOString().split('T')[0];

  const JOURS_FR = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
  const JOURS_SHORT = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  const MOIS_FR  = ['Jan','Fev','Mar','Avr','Mai','Juin','Juil','Aout','Sep','Oct','Nov','Dec'];

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [seancesRes, sportsRes] = await Promise.all([
          axios.get(`${API}/seances`),
          axios.get(`${API}/sports`),
        ]);
        setSeances(seancesRes.data || []);
        setSports(sportsRes.data || []);
      } catch { setSeances([]); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const seancesFiltrees = seances.filter(s => {
    const date = s.date?.split('T')[0] || '';
    if (date < weekStart || date > weekEnd) return false;
    if (filterSport  && String(s.id_sport) !== String(filterSport))   return false;
    if (filterPublic && s.public_cible !== filterPublic)               return false;
    if (filterNiveau && s.niveau !== filterNiveau)                     return false;
    return true;
  });

  const seancesByDay = weekDays.map(day => {
    const dateStr = day.toISOString().split('T')[0];
    const list = seancesFiltrees
      .filter(s => (s.date?.split('T')[0] || '') === dateStr)
      .sort((a, b) => (a.heure || '').localeCompare(b.heure || ''));
    return { day, dateStr, list };
  });

  const totalSeances = seancesFiltrees.length;
  const todayStr = today.toISOString().split('T')[0];
  const activeFiltersCount = [filterSport, filterPublic, filterNiveau].filter(Boolean).length;

  const filterBtnStyle = (active) => ({
    padding: '7px 14px',
    border: active ? '1px solid #f97316' : '1px solid #334155',
    borderRadius: 20,
    background: active ? 'rgba(249,115,22,0.15)' : '#1e293b',
    color: active ? '#fb923c' : '#94a3b8',
    fontSize: 12,
    fontWeight: active ? 700 : 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  });

  return (
    <section id="planning" style={{ background: '#0f172a', padding: '80px 0' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', background: '#fff5f0',
            color: '#f97316', borderRadius: 20, fontSize: 12,
            fontWeight: 700, marginBottom: 14,
          }}>
            <SvgIcon name="calendar" size={12} color="#f97316" /> Programme des seances
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            fontWeight: 700, color: '#f8fafc', marginBottom: 12,
          }}>
            Emploi du temps hebdomadaire
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
            Consultez les seances disponibles et inscrivez-vous en ligne
          </p>
        </div>

        <div style={{
          background: '#1e293b', borderRadius: 16, padding: '16px 24px',
          marginBottom: 24, display: 'flex', gap: 16,
          flexWrap: 'wrap', alignItems: 'center',
          border: '1px solid #334155',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
            <SvgIcon name="filter" size={14} color="#f97316" />
            Filtres
            {activeFiltersCount > 0 && (
              <span style={{
                background: '#f97316', color: '#fff', fontSize: 10,
                width: 18, height: 18, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700,
              }}>{activeFiltersCount}</span>
            )}
          </div>

          <select
            value={filterSport}
            onChange={e => setFilterSport(e.target.value)}
            style={{
              padding: '7px 14px', background: '#1e293b',
              border: filterSport ? '1px solid #f97316' : '1px solid #334155',
              borderRadius: 20, color: filterSport ? '#fb923c' : '#94a3b8',
              fontSize: 13, cursor: 'pointer', outline: 'none',
              fontFamily: 'inherit',
            }}
          >
            <option value="">Tous les sports</option>
            {sports.map(s => <option key={s.id_sport} value={s.id_sport}>{s.nom_sport}</option>)}
          </select>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['', 'Mixte', 'Femmes', 'Hommes', 'Enfants'].map(p => (
              <button key={p} style={filterBtnStyle(filterPublic === p)} onClick={() => setFilterPublic(filterPublic === p ? '' : p)}>
                {p || 'Tout public'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['', 'Debutant', 'Intermediaire', 'Avance'].map(n => (
              <button key={n} style={filterBtnStyle(filterNiveau === n)} onClick={() => setFilterNiveau(filterNiveau === n ? '' : n)}>
                {n || 'Tous niveaux'}
              </button>
            ))}
          </div>

          {activeFiltersCount > 0 && (
            <button onClick={() => { setFilterSport(''); setFilterPublic(''); setFilterNiveau(''); }}
              style={{
                padding: '7px 14px', border: '1px solid #7f1d1d',
                borderRadius: 20, background: '#450a0a',
                color: '#f87171', fontSize: 12, cursor: 'pointer',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4,
                transition: 'all 0.2s',
              }}>
              <SvgIcon name="x" size={12} color="#f87171" /> Reinitialiser
            </button>
          )}
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 20,
        }}>
          <button
            onClick={() => setWeekOffset(w => w - 1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', background: '#1e293b',
              border: '1px solid #334155', borderRadius: 10,
              color: '#94a3b8', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 13, transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.color = '#fb923c'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            <SvgIcon name="chevLeft" size={14} color="currentColor" /> Precedente
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 16 }}>
              {weekDays[0].getDate()} {MOIS_FR[weekDays[0].getMonth()]} - {weekDays[6].getDate()} {MOIS_FR[weekDays[6].getMonth()]} {weekDays[6].getFullYear()}
            </div>
            <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>
              {totalSeances} seance{totalSeances > 1 ? 's' : ''} programmee{totalSeances > 1 ? 's' : ''}
            </div>
          </div>

          <button
            onClick={() => setWeekOffset(w => w + 1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', background: '#1e293b',
              border: '1px solid #334155', borderRadius: 10,
              color: '#94a3b8', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 13, transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.color = '#fb923c'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            Suivante <SvgIcon name="chevRight" size={14} color="currentColor" />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
            <SvgIcon name="clock" size={40} color="#475569" />
            <p style={{ marginTop: 16 }}>Chargement du programme...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
            {seancesByDay.map(({ day, dateStr, list }, idx) => {
              const isToday = dateStr === todayStr;
              const isPast  = dateStr < todayStr;

              return (
                <div key={dateStr} style={{ display: 'flex', flexDirection: 'column', minHeight: 360 }}>
                  <div style={{
                    padding: '14px 8px',
                    background: isToday ? '#f97316' : '#1e293b',
                    textAlign: 'center',
                    borderRadius: '12px 12px 0 0',
                    border: isToday ? 'none' : '1px solid #334155',
                    borderBottom: 'none',
                    position: 'relative',
                  }}>
                    {isToday && (
                      <div style={{
                        position: 'absolute', top: 6, right: 8,
                        background: 'rgba(255,255,255,0.25)',
                        color: '#fff', fontSize: 9, fontWeight: 800,
                        padding: '2px 8px', borderRadius: 10,
                        textTransform: 'uppercase',
                      }}>Aujourd hui</div>
                    )}
                    <div style={{
                      fontSize: 11, fontWeight: 700,
                      color: isToday ? 'rgba(255,255,255,0.85)' : '#94a3b8',
                      textTransform: 'uppercase', letterSpacing: 1.5,
                      marginBottom: 4,
                    }}>
                      {JOURS_SHORT[idx]}
                    </div>
                    <div style={{
                      fontSize: 22, fontWeight: 800,
                      color: isToday ? '#fff' : '#f8fafc', lineHeight: 1.1,
                    }}>
                      {day.getDate()}
                    </div>
                    <div style={{
                      fontSize: 10,
                      color: isToday ? 'rgba(255,255,255,0.7)' : '#94a3b8',
                      marginTop: 3,
                    }}>
                      {MOIS_FR[day.getMonth()]}
                    </div>
                  </div>

                  <div style={{
                    flex: 1,
                    background: '#1e293b',
                    borderRadius: '0 0 12px 12px',
                    border: isToday ? '2px solid #f97316' : '1px solid #334155',
                    borderTop: 'none',
                    padding: '10px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    opacity: isPast ? 0.55 : 1,
                    boxShadow: isToday ? '0 4px 12px rgba(249,115,22,0.25)' : 'none',
                  }}>
                    {list.length === 0 ? (
                      <div style={{
                        flex: 1, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        color: '#475569', fontSize: 11, textAlign: 'center',
                        padding: '24px 4px',
                      }}>
                        <SvgIcon name="calendar" size={20} color="#475569" />
                        <span style={{ marginTop: 8 }}>Aucune seance</span>
                      </div>
                    ) : (
                      list.map(s => {
                        const nStyle = niveauStyle(s.niveau);
                        const pStyle = publicStyle(s.public_cible);
                        const heure  = s.heure?.split('-') || ['--:--', '--:--'];
                        const places = s.capacite - (s.placesOccupees || 0);
                        const plein  = places <= 0;
                        const isCardHovered = selectedSeance === s.id_seance;

                        return (
                          <div
                            key={s.id_seance}
                            onClick={() => setSelectedSeance(isCardHovered ? null : s.id_seance)}
                            style={{
                              background: isCardHovered ? '#0f172a' : '#1e293b',
                              borderRadius: 10,
                              padding: '12px 10px',
                              border: `1px solid ${isCardHovered ? nStyle.border + '50' : '#334155'}`,
                              borderLeft: `3px solid ${nStyle.border}`,
                              cursor: 'pointer',
                              transition: 'all 0.25s ease',
                              boxShadow: isCardHovered ? '0 2px 8px rgba(0,0,0,0.25)' : 'none',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = '#0f172a';
                              e.currentTarget.style.borderColor = nStyle.border + '50';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = isCardHovered ? '#0f172a' : '#1e293b';
                              e.currentTarget.style.borderColor = '#334155';
                              e.currentTarget.style.transform = 'none';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                              <SvgIcon name="clock" size={10} color="#94a3b8" />
                              <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>
                                {heure[0]} - {heure[1]}
                              </span>
                            </div>

                            <div style={{
                              fontSize: 12, fontWeight: 700,
                              color: '#f8fafc', marginBottom: 6, lineHeight: 1.25,
                            }}>
                              {s.nom_sport || s.nom || '-'}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                              <SvgIcon name="user" size={10} color="#94a3b8" />
                              <span style={{ fontSize: 10, color: '#94a3b8' }}>
                                {s.nom_coach || 'Coach'}
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                              <span style={{
                                background: nStyle.bg, color: nStyle.color,
                                padding: '2px 7px', borderRadius: 6,
                                fontSize: 9, fontWeight: 600,
                              }}>{s.niveau}</span>
                              <span style={{
                                background: pStyle.bg, color: pStyle.color,
                                padding: '2px 7px', borderRadius: 6,
                                fontSize: 9, fontWeight: 600,
                              }}>{s.public_cible}</span>
                            </div>

                            <div style={{
                              display: 'flex', justifyContent: 'space-between',
                              alignItems: 'center',
                              paddingTop: 8,
                              borderTop: '1px solid #334155',
                            }}>
                              <span style={{
                                fontSize: 9,
                                color: plein ? '#f87171' : '#4ade80',
                                fontWeight: 700,
                              }}>
                                {plein ? 'Complet' : `${places} place${places > 1 ? 's' : ''}`}
                              </span>

                              {!plein && (
                                <Link to="/register" style={{
                                  fontSize: 9, fontWeight: 800,
                                  background: '#f97316',
                                  color: '#fff', padding: '3px 10px',
                                  borderRadius: 6, textDecoration: 'none',
                                  transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#ea580c'}
                                onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
                                >
                                  S inscrire
                                </Link>
                              )}
                            </div>

                            {isCardHovered && s.description && (
                              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                                <p style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                                  {s.description}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16 }}>
            Inscrivez-vous pour acceder a toutes les seances et gerer vos abonnements
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 32px',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            color: '#fff', fontWeight: 700, fontSize: 15,
            borderRadius: 12, textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(249,115,22,0.3)',
            transition: 'all 0.2s',
          }}>
            <SvgIcon name="users" size={16} color="#fff" />
            Rejoindre FITCLUB
          </Link>
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section id="galerie" style={{ background: '#f8fafc', padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', background: '#fff5f0',
            color: '#f97316', borderRadius: 20, fontSize: 12,
            fontWeight: 700, marginBottom: 14,
          }}>
            <SvgIcon name="star" size={12} color="#f97316" /> Notre club
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            fontWeight: 700, color: '#0f172a', marginBottom: 12,
          }}>
            Decouvrez nos installations
          </h2>
          <p style={{ color: '#64748b', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
            Des espaces modernes et equipes pour vous accompagner dans votre parcours sportif
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 20,
        }}>
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                position: 'relative',
                borderRadius: 16,
                overflow: 'hidden',
                aspectRatio: '16/10',
                cursor: 'pointer',
              }}
            >
              <img
                src={item.src}
                alt={item.alt}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  transform: hoveredIdx === idx ? 'scale(1.08)' : 'scale(1)',
                }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: hoveredIdx === idx
                  ? 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)'
                  : 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)',
                transition: 'all 0.3s',
              }} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '24px 20px',
                transform: hoveredIdx === idx ? 'translateY(0)' : 'translateY(8px)',
                opacity: hoveredIdx === idx ? 1 : 0.7,
                transition: 'all 0.3s',
              }}>
                <p style={{
                  color: '#fff', fontSize: 16, fontWeight: 700,
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}>
                  {item.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section style={{
      background: '#0f172a',
      padding: '80px 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -100, right: -100,
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute', bottom: -50, left: -50,
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 56,
          alignItems: 'center',
        }}>
          <div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', background: 'rgba(249,115,22,0.15)',
              color: '#f97316', borderRadius: 20, fontSize: 12,
              fontWeight: 700, marginBottom: 14,
            }}>
              <SvgIcon name="flame" size={12} color="#f97316" /> Rejoignez-nous
            </span>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 700, color: '#f8fafc', marginBottom: 16, lineHeight: 1.2,
            }}>
              Commencez votre transformation aujourd hui
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
              Plus de 2000 membres nous font deja confiance. Accedez a toutes nos seances,
              suivez votre progression et beneficiez de l accompagnement de nos coachs certifies.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {[
                { icon: 'check', text: 'Acces illimite a toutes les seances' },
                { icon: 'check', text: 'Coachs personnels disponibles 7j/7' },
                { icon: 'check', text: 'Equipements modernes et entretenus' },
                { icon: 'check', text: 'Suivi de progression en ligne' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'rgba(34,197,94,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <SvgIcon name="check" size={12} color="#22c55e" strokeWidth={2.5} />
                  </div>
                  <span style={{ color: '#e2e8f0', fontSize: 14 }}>{item.text}</span>
                </div>
              ))}
            </div>

            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: '#fff', fontWeight: 800, fontSize: 15,
              borderRadius: 12, textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(249,115,22,0.35)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(249,115,22,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(249,115,22,0.35)';
            }}
            >
              <SvgIcon name="users" size={18} color="#fff" />
              S inscrire maintenant
            </Link>
          </div>

          <div style={{
            position: 'relative',
            borderRadius: 20,
            overflow: 'hidden',
            aspectRatio: '4/3',
          }}>
            <img
              src={PHOTOS.gym2}
              alt="Entrainement FITCLUB"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(249,115,22,0.1), transparent)',
            }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Navbar({ isLoggedIn, userRole, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{ ...css.nav, ...(scrolled ? css.navScrolled : {}) }}>
      <div style={css.navInner}>
        <Logo />
        <div style={css.navLinks}>
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href} style={css.navLink} className="nav-link">{label}</a>
          ))}
        </div>
        <div style={css.navActions}>
          {isLoggedIn ? (
            <>
              <Link to={userRole === 'admin' ? '/admin/dashboard' : userRole === 'coach' ? '/coach/dashboard' : '/membre/dashboard'} style={css.btnDark}>
                Tableau de bord
              </Link>
              <button onClick={onLogout} style={css.btnRed}>Deconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login"    style={css.btnOutline}>Connexion</Link>
              <Link to="/register" style={css.btnPrimary}>Inscription</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <div style={css.logo}>
      <div style={css.logoIconWrap}>
        <SvgIcon name="dumbbell" size={18} color="#fff" strokeWidth={2} />
      </div>
      <span style={css.logoText}>FITCLUB</span>
    </div>
  );
}

function StatBadge({ number, label }) {
  return (
    <div style={css.stat}>
      <span style={css.statNumber}>{number}</span>
      <span style={css.statLabel}>{label}</span>
    </div>
  );
}

function ServiceCard({ iconName, title, desc }) {
  return (
    <div style={css.serviceCard} className="service-card">
      <div style={css.serviceIconWrap}>
        <SvgIcon name={iconName} size={28} color="#f97316" strokeWidth={1.8} />
      </div>
      <h3 style={css.serviceTitle}>{title}</h3>
      <p style={css.serviceDesc}>{desc}</p>
    </div>
  );
}

function AwardItem({ iconName, title, desc }) {
  return (
    <div style={css.award}>
      <div style={css.awardIconWrap}>
        <SvgIcon name={iconName} size={20} color="#f97316" strokeWidth={1.8} />
      </div>
      <div>
        <h4 style={css.awardTitle}>{title}</h4>
        <p style={css.awardDesc}>{desc}</p>
      </div>
    </div>
  );
}

function LocationSection() {
  return (
    <section id="location" style={css.locSection}>
      <div style={css.locMapOuter}>
        <iframe title="FITCLUB Tetouan" src={CLUB.mapSrc} style={css.locMapFrame} loading="lazy" allowFullScreen="" referrerPolicy="no-referrer-when-downgrade" />
        <div style={css.locMapTint} />
      </div>
      <div style={css.locCard}>
        <div style={css.locCardInner}>
          <div style={css.locCardLeft}>
            <span style={css.locBadge}><SvgIcon name="mapPin" size={12} color="#f97316" /> Notre adresse</span>
            <h2 style={css.locTitle}>{CLUB.name}</h2>
            <p style={css.locAddress}>{CLUB.address}</p>
            <a href={CLUB.mapsLink} target="_blank" rel="noopener noreferrer" style={css.mapsBtn}>
              <SvgIcon name="map" size={14} color="#fff" /> Ouvrir dans Maps
            </a>
          </div>
          <div style={css.locDivider} />
          <div style={css.locMeta}>
            <LocItem iconName="phone"  label="Telephone" value={CLUB.phone} />
            <LocItem iconName="mail"   label="Email"     value={CLUB.email} />
            <LocItem iconName="clock"  label="Horaires"  value={CLUB.hours} />
          </div>
        </div>
      </div>
    </section>
  );
}

function LocItem({ iconName, label, value }) {
  return (
    <div style={css.locItem}>
      <div style={css.locItemIconWrap}><SvgIcon name={iconName} size={16} color="#f97316" /></div>
      <div>
        <div style={css.locItemLabel}>{label}</div>
        <div style={css.locItemValue}>{value}</div>
      </div>
    </div>
  );
}

function SectionHeader({ badge, title, light }) {
  return (
    <>
      <span style={{ ...css.badge, ...(light ? css.badgeLight : {}) }}>{badge}</span>
      <h2 style={{ ...css.sectionTitle, ...(light ? { color: '#fff' } : {}) }}>{title}</h2>
    </>
  );
}

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole,   setUserRole]   = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user  = JSON.parse(localStorage.getItem('user') || '{}');
    setIsLoggedIn(!!token);
    setUserRole(user.role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div style={css.page}>
      <GlobalStyles />
      <Navbar isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout} />

      <section id="accueil" style={css.hero}>
        <div style={css.heroOverlay} />
        <div style={css.heroContent}>
          <h1 style={css.heroTitle}>Depassez vos <span style={css.heroAccent}>limites</span></h1>
          <p style={css.heroSub}>Rejoignez la meilleure plateforme de clubs sportifs au Maroc. Des coaches certifies, des equipements modernes et une communaute passionnee.</p>
          <div style={css.heroButtons}>
            <Link to="/register" style={css.btnPrimary}>Commencer -</Link>
            <a href="#about" style={css.btnGhost}>En savoir plus</a>
          </div>
          <div style={css.stats}>
            {STATS.map(s => <StatBadge key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      <section id="about" style={{ ...css.section, background: '#f8fafc' }}>
        <div style={css.container}>
          <div style={css.aboutGrid}>
            <div>
              <SectionHeader badge="A propos" title="La plateforme N1 des clubs de sport au Maroc" />
              <p style={css.bodyText}>Depuis 2017, FITCLUB est la plateforme leader qui encourage la pratique sportive au Maroc, en referencant les clubs et salles les plus proches de chez vous.</p>
              <div style={css.awards}>
                {AWARDS.map(a => <AwardItem key={a.title} {...a} />)}
              </div>
            </div>
            <div style={css.aboutImageBox}>
              <SvgIcon name="dumbbell" size={100} color="rgba(255,255,255,0.99)" strokeWidth={1.2} />
            </div>
          </div>
        </div>
      </section>

      <section id="services" style={{ ...css.section, background: '#fff' }}>
        <div style={css.container}>
          <div style={{ textAlign: 'center' }}>
            <SectionHeader badge="Nos services" title="Ce que nous offrons" />
          </div>
          <div style={css.servicesGrid}>
            {SERVICES.map(s => <ServiceCard key={s.title} {...s} />)}
          </div>
        </div>
      </section>

      <PlanningSection />

      <GallerySection />

      <CTASection />

      <LocationSection />

      <section id="contact" style={{ ...css.section, background: '#fff' }}>
        <div style={css.container}>
          <div style={{ textAlign: 'center' }}>
            <SectionHeader badge="Contact" title="Pret a commencer ?" />
          </div>
          <div style={css.contactGrid}>
            <div style={css.contactInfo}>
              {CONTACT_ITEMS.map(({ iconName, label, value }) => (
                <div key={label} style={css.contactItem}>
                  <div style={css.contactIconWrap}><SvgIcon name={iconName} size={18} color="#f97316" /></div>
                  <div>
                    <h4 style={css.contactLabel}>{label}</h4>
                    <p style={css.contactValue}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <footer style={css.footer}>
        <div style={css.container}>
          <div style={css.footerGrid}>
            <div>
              <Logo />
              <p style={css.footerTagline}>La plateforme N1 des clubs et salles de sport au Maroc.</p>
            </div>
            <FooterLinks title="Navigation" links={NAV_LINKS.map(n => ({ href: n.href, label: n.label }))} />
            <FooterLinks title="Legal" links={[{ href: '#', label: 'CGU' },{ href: '#', label: 'CGV' },{ href: '#', label: 'Confidentialite' }]} />
          </div>
          <p style={css.copyright}>2024 FITCLUB . Tous droits reserves . Edite par DEVAGA SARL</p>
        </div>
      </footer>
    </div>
  );
};

function ContactForm() {
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };
  if (sent) return (
    <div style={css.successBox}>
      <div style={{ ...css.contactIconWrap, width: 52, height: 52 }}>
        <SvgIcon name="check" size={26} color="#16a34a" strokeWidth={2.5} />
      </div>
      <h3 style={{ color: '#166534' }}>Message envoye !</h3>
      <p style={{ color: '#166534', fontSize: 14 }}>Nous vous repondrons dans les plus brefs delais.</p>
    </div>
  );
  return (
    <form onSubmit={handleSubmit} style={css.form}>
      <input type="text"  placeholder="Votre nom"     required style={css.formInput} className="form-input" />
      <input type="email" placeholder="Votre email"   required style={css.formInput} className="form-input" />
      <textarea           placeholder="Votre message" required rows={4} style={{ ...css.formInput, resize: 'vertical' }} className="form-input" />
      <button type="submit" style={css.btnPrimary} className="btn-submit">Envoyer -</button>
    </form>
  );
}

function FooterLinks({ title, links }) {
  return (
    <div style={css.footerCol}>
      <h4 style={css.footerColTitle}>{title}</h4>
      {links.map(({ href, label }) => (
        <a key={label} href={href} style={css.footerLink}>{label}</a>
      ))}
    </div>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { font-family: 'Segoe UI', Roboto, sans-serif; }
      .nav-link { text-decoration: none; color: #334155; font-weight: 500; font-size: 15px; position: relative; transition: color .2s; }
      .nav-link::after { content: ''; position: absolute; left: 0; bottom: -4px; width: 0; height: 2px; background: #f97316; transition: width .3s; }
      .nav-link:hover { color: #f97316; }
      .nav-link:hover::after { width: 100%; }
      .service-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,.1); border-color: #f97316; }
      .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(249,115,22,.45); }
      .form-input:focus { outline: none; border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,.15); }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    `}</style>
  );
}

const ORANGE = '#f97316';
const DARK   = '#0f172a';

const css = {
  page: { minHeight: '100vh', background: '#fff', color: DARK },
  nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '14px 0', background: 'rgba(255,255,255,.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,.06)', transition: 'box-shadow .3s' },
  navScrolled: { boxShadow: '0 4px 24px rgba(0,0,0,.08)' },
  navInner: { maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navLinks: { display: 'flex', gap: 28 },
  navActions: { display: 'flex', gap: 10, alignItems: 'center' },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoIconWrap: { width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${ORANGE}, #ea580c)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px -4px rgba(249,115,22,.6)' },
  logoText: { fontSize: 20, fontWeight: 800, letterSpacing: 1.5, background: `linear-gradient(135deg, ${ORANGE}, #ea580c)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  btnPrimary: { padding: '10px 22px', background: `linear-gradient(135deg, ${ORANGE}, #ea580c)`, color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 10, border: 'none', cursor: 'pointer', textDecoration: 'none', display: 'inline-block', transition: 'all .2s' },
  btnOutline: { padding: '10px 22px', border: `1.5px solid ${ORANGE}`, color: ORANGE, fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none', display: 'inline-block', transition: 'all .2s', background: 'transparent' },
  btnGhost: { padding: '12px 28px', border: '2px solid rgba(255,255,255,.8)', color: '#fff', fontWeight: 600, fontSize: 15, borderRadius: 12, textDecoration: 'none', display: 'inline-block', transition: 'all .2s' },
  btnDark: { padding: '10px 22px', background: DARK, color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none', display: 'inline-block' },
  btnRed: { padding: '10px 22px', background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 10, border: 'none', cursor: 'pointer' },
  hero: { height: '100vh', position: 'relative', backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,23,42,.85), rgba(15,23,42,.65))' },
  heroContent: { position: 'relative', zIndex: 2, maxWidth: 720, padding: '0 24px', textAlign: 'center', animation: 'fadeUp .8s ease both' },
  heroTitle: { fontSize: 'clamp(38px, 5.5vw, 68px)', fontWeight: 800, color: '#fff', lineHeight: 1.08, marginBottom: 20 },
  heroAccent: { background: 'linear-gradient(90deg, #f97316, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroSub: { fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,.88)', lineHeight: 1.65, marginBottom: 36 },
  heroButtons: { display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 56 },
  stats: { display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap' },
  stat: { textAlign: 'center' },
  statNumber: { display: 'block', fontSize: 34, fontWeight: 800, color: ORANGE },
  statLabel:  { fontSize: 13, color: 'rgba(255,255,255,.7)' },
  section: { padding: '90px 0' },
  container: { maxWidth: 1200, margin: '0 auto', padding: '0 24px' },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: '#fff5f0', color: ORANGE, borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 14 },
  badgeLight: { background: 'rgba(249,115,22,.15)', color: '#fb923c' },
  sectionTitle: { fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, color: DARK, marginBottom: 44 },
  aboutGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' },
  bodyText: { fontSize: 16, color: '#475569', lineHeight: 1.7, marginBottom: 32 },
  awards: { display: 'flex', flexDirection: 'column', gap: 22 },
  award: { display: 'flex', gap: 14, alignItems: 'flex-start' },
  awardIconWrap: { width: 42, height: 42, borderRadius: 10, flexShrink: 0, background: 'rgba(249,115,22,.1)', border: '1px solid rgba(249,115,22,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  awardTitle: { fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 3 },
  awardDesc:  { fontSize: 13, color: '#64748b' },
  aboutImageBox: { height: 400, borderRadius: 20, background: `linear-gradient(135deg, ${ORANGE}, #ea580c)`, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 },
  serviceCard: { padding: 30, textAlign: 'center', borderRadius: 16, border: '1px solid #e2e8f0', transition: 'all .3s', background: '#fff' },
  serviceIconWrap: { width: 60, height: 60, borderRadius: 16, margin: '0 auto 16px', background: 'rgba(249,115,22,.08)', border: '1px solid rgba(249,115,22,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  serviceTitle: { fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 10 },
  serviceDesc:  { fontSize: 14, color: '#64748b', lineHeight: 1.6 },
  locSection: { position: 'relative', height: 540 },
  locMapOuter: { position: 'absolute', inset: 0 },
  locMapFrame: { width: '100%', height: '100%', border: 'none', display: 'block' },
  locMapTint: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,.18) 0%, transparent 50%)', pointerEvents: 'none' },
  locCard: { position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '0 24px 0' },
  locCardInner: { width: '100%', maxWidth: 1200, background: '#0f172a', borderRadius: '20px 20px 0 0', padding: '32px 48px', display: 'flex', alignItems: 'center', gap: 48 },
  locCardLeft: { flex: '0 0 auto' },
  locBadge: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: ORANGE, background: 'rgba(249,115,22,.12)', padding: '4px 12px', borderRadius: 20, marginBottom: 10, letterSpacing: .5 },
  locTitle: { fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: -.5 },
  locAddress: { fontSize: 14, color: '#94a3b8', marginBottom: 14 },
  mapsBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: `linear-gradient(135deg, ${ORANGE}, #ea580c)`, color: '#fff', fontWeight: 700, fontSize: 13, borderRadius: 8, textDecoration: 'none', transition: 'all .2s' },
  locDivider: { width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,.08)', flexShrink: 0 },
  locMeta: { flex: 1, display: 'flex', gap: 40, flexWrap: 'wrap' },
  locItem: { display: 'flex', gap: 12, alignItems: 'flex-start' },
  locItemIconWrap: { width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: 'rgba(249,115,22,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  locItemLabel: { fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: .8, marginBottom: 3 },
  locItemValue: { fontSize: 14, color: '#e2e8f0', lineHeight: 1.5 },
  contactGrid: { display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 56, alignItems: 'start' },
  contactInfo: { display: 'flex', flexDirection: 'column', gap: 24 },
  contactItem: { display: 'flex', gap: 16, alignItems: 'center' },
  contactIconWrap: { width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: 'rgba(249,115,22,.08)', border: '1px solid rgba(249,115,22,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  contactLabel: { fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 2 },
  contactValue: { fontSize: 14, color: '#475569' },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  formInput: { padding: '12px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, transition: 'all .2s', background: '#f8fafc', fontFamily: 'inherit', width: '100%' },
  successBox: { textAlign: 'center', padding: 32, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 },
  footer: { padding: '60px 0 28px', background: DARK, color: '#fff' },
  footerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 48, marginBottom: 48 },
  footerTagline: { fontSize: 13, color: '#94a3b8', marginTop: 12, lineHeight: 1.6 },
  footerCol: { display: 'flex', flexDirection: 'column', gap: 10 },
  footerColTitle: { fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 },
  footerLink: { fontSize: 13, color: '#64748b', textDecoration: 'none', transition: 'color .2s' },
  copyright: { textAlign: 'center', paddingTop: 24, borderTop: '1px solid #1e293b', color: '#475569', fontSize: 12 },
};

export default HomePage;