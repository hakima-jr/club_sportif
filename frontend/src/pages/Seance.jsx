import { useState, useEffect } from "react";
import API from "../api/api";
import "../styles/interface_Seance.css";

function Seance() {
  const [seances, setSeances] = useState([]);
  const [sports, setSports] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    sport: "",
    jour: "",
    debut: "",
    fin: "",
    capaciteMax: "",
    niveau: "Débutant"
  });

  // 1. Fetch Sports
  useEffect(() => {
    API.get("/sports")
      .then(res => setSports(res.data))
      .catch(err => console.error("Erreur sports:", err));
  }, []);

  // 2. Fetch Séances
  useEffect(() => {
    API.get("/seances")
      .then(res => {
        const data = res.data.map(s => {
          // تفادي مشكل split إلا كان heure خاوي
          const heureParts = s.heure ? s.heure.split("-") : ["00:00", "00:00"];
          return {
            id: s.id_seance,
            nom: s.nom,
            sport: s.id_sport,
            jour: s.date ? s.date.split("T")[0] : "", // تنظيف صيغة التاريخ
            debut: heureParts[0] || "00:00",
            fin: heureParts[1] || "00:00",
            capaciteMax: s.capacite,
            placesOccupees: s.placesOccupees || 0,
            niveau: s.niveau || "Débutant"
          };
        });
        setSeances(data);
      })
      .catch(err => console.error("Erreur séances:", err));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: id === "sport" || id === "capaciteMax" ? Number(value) : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.fin <= formData.debut) {
      alert("L'heure de fin doit être après l'heure de début !");
      return;
    }

    const payload = {
      nom: formData.nom,
      date: formData.jour,
      heure: `${formData.debut}-${formData.fin}`,
      capacite: formData.capaciteMax,
      id_sport: formData.sport,
      id_coach: 1, // تأكد أن هاد الـ ID موجود فـ جدول coach فـ MySQL
      niveau: formData.niveau
    };

    API.post("/seances", payload)
      .then(res => {
        const newSeance = { 
          id: res.data.id, 
          ...formData, 
          placesOccupees: 0 
        };
        setSeances([...seances, newSeance]);
        setFormData({ nom: "", sport: "", jour: "", debut: "", fin: "", capaciteMax: "", niveau: "Débutant" });
        alert("Séance ajoutée ! ✅");
      })
      .catch(err => {
        console.error(err);
        alert("Erreur 500: Vérifiez que id_sport et id_coach existent dans la DB");
      });
  };

  const inscrire = (id) => {
    setSeances(seances.map(s =>
      s.id === id && s.placesOccupees < s.capaciteMax
        ? { ...s, placesOccupees: s.placesOccupees + 1 }
        : s
    ));
  };

  const supprimer = (id) => {
    if (window.confirm("Voulez-vous supprimer cette séance ?")) {
      API.delete(`/seances/${id}`)
        .then(() => {
          setSeances(seances.filter(s => s.id !== id));
        })
        .catch(err => alert("Erreur lors de la suppression"));
    }
  };

  return (
    <div className="container">
      <h1>Gestion des Séances</h1>

      <form onSubmit={handleSubmit} className="form-seance">
        <input id="nom" value={formData.nom} onChange={handleChange} placeholder="Nom de la séance" required />

        <select id="sport" value={formData.sport} onChange={handleChange} required>
          <option value="">-- Choisir un sport --</option>
          {sports.map(s => (
            <option key={s.id_sport} value={s.id_sport}>{s.nom_sport}</option>
          ))}
        </select>

        <div className="time-group">
          <input type="date" id="jour" value={formData.jour} onChange={handleChange} required />
          <input type="time" id="debut" value={formData.debut} onChange={handleChange} required />
          <input type="time" id="fin" value={formData.fin} onChange={handleChange} required />
        </div>

        <select id="niveau" value={formData.niveau} onChange={handleChange}>
          <option value="Débutant">Débutant</option>
          <option value="Intermédiaire">Intermédiaire</option>
          <option value="Avancé">Avancé</option>
        </select>

        <input type="number" id="capaciteMax" value={formData.capaciteMax} onChange={handleChange} placeholder="Capacité maximale" required />

        <button type="submit" className="btn-add">Ajouter la Séance</button>
      </form>

      <table className="seance-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Sport</th>
            <th>Jour</th>
            <th>Heure</th>
            <th>Niveau</th>
            <th>Places</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {seances.map(s => (
            <tr key={s.id}>
              <td>{s.nom}</td>
              <td>{sports.find(sp => sp.id_sport === s.sport)?.nom_sport || "—"}</td>
              <td>{s.jour}</td>
              <td>{s.debut} - {s.fin}</td>
              <td>{s.niveau}</td>
              <td>{s.placesOccupees}/{s.capaciteMax}</td>
              <td>
                <button className="btn-inscrire" onClick={() => inscrire(s.id)} disabled={s.placesOccupees >= s.capaciteMax}>
                  S'inscrire
                </button>
                <button className="btn-delete" onClick={() => supprimer(s.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Seance;