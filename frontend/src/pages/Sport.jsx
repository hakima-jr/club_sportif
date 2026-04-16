import { useState, useEffect } from "react";
import API from "../api/api";
import "../styles/interface_sport.css";

function Sport() {
  const [sports, setSports] = useState([]);
  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState("Individuel");
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    API.get("/sports").then(res => setSports(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId === null) {
      API.post("/sports", { nom_sport: nom, categorie }).then(res => {
        setSports([...sports, res.data]);
      });
    } else {
      API.put(`/sports/${editId}`, { nom_sport: nom, categorie }).then(() => {
        setSports(sports.map(s => s.id_sport === editId ? { ...s, nom_sport: nom, categorie } : s));
      });
    }
    setNom(""); setCategorie("Individuel"); setEditId(null); setShowForm(false);
  };

  const editSport = (s) => { setNom(s.nom_sport); setCategorie(s.categorie); setEditId(s.id_sport); setShowForm(true); };
  const deleteSport = (id) => { API.delete(`/sports/${id}`); setSports(sports.filter(s => s.id_sport !== id)); };

  return (
    <div className="container">
      <h1>Gestion des Sports</h1>
      <button onClick={() => setShowForm(true)}>➕ Ajouter Sport</button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input placeholder="Nom du sport" value={nom} onChange={e => setNom(e.target.value)} required />
          <select value={categorie} onChange={e => setCategorie(e.target.value)}>
            <option value="Individuel">Individuel</option>
            <option value="Équipe">Équipe</option>
          </select>
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={() => setShowForm(false)}>Annuler</button>
        </form>
      )}

      <table>
        <thead>
          <tr><th>ID</th><th>Nom</th><th>Catégorie</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {sports.map(s => (
            <tr key={s.id_sport}>
              <td>{s.id_sport}</td>
              <td>{s.nom_sport}</td>
              <td>{s.categorie}</td>
              <td>
                <button onClick={() => editSport(s)}>✏️</button>
                <button onClick={() => deleteSport(s.id_sport)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Sport;
