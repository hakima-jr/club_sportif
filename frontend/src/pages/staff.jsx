import React, { useState } from "react";
 import styles from"../styles/Staff.module.css"; 
import { Search, Plus, Trash2, Edit, Calendar, X } from "lucide-react";

const initialStaff = [
  { id: 1, nom: "Benali", prenom: "Ahmed", role: "Entraîneur", tel: "0611111111", email: "ahmed@mail.com", sexe: "Homme", image: "" },
  { id: 2, nom: "Amrani", prenom: "Sara", role: "Coach Assistant", tel: "0622222222", email: "sara@mail.com", sexe: "Femme", image: "" },
  { id: 3, nom: "Tazi", prenom: "Youssef", role: "Réceptionniste", tel: "0633333333", email: "youssef@mail.com", sexe: "Homme", image: "" },
  { id: 4, nom: "Lahlou", prenom: "Nadia", role: "Femme de ménage", tel: "0644444444", email: "nadia@mail.com", sexe: "Femme", image: "" },
  { id: 5, nom: "Rami", prenom: "Karim", role: "Responsable salle", tel: "0655555555", email: "karim@mail.com", sexe: "Homme", image: "" },
  { id: 6, nom: "Zahra", prenom: "Imane", role: "Nutritionniste", tel: "0666666666", email: "imane@mail.com", sexe: "Femme", image: "" },
];

function Staff() {
  const [staff, setStaff] = useState(initialStaff);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    nom: "", prenom: "", role: "", tel: "", email: "", sexe: "", image: ""
  });

  const filtered = staff.filter(s =>
    s.nom.toLowerCase().includes(search.toLowerCase()) ||
    s.prenom.toLowerCase().includes(search.toLowerCase())
  );

  // ADD
  const addStaff = () => {
    setStaff([...staff, { ...form, id: Date.now() }]);
    resetForm();
  };

  // DELETE
  const deleteStaff = (id) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  // EDIT
  const openEdit = (s) => {
    setEditMode(true);
    setSelected(s.id);
    setForm(s);
    setShowForm(true);
  };

  const updateStaff = () => {
    setStaff(staff.map(s => s.id === selected ? form : s));
    resetForm();
  };

  const resetForm = () => {
    setForm({ nom: "", prenom: "", role: "", tel: "", email: "", sexe: "", image: "" });
    setShowForm(false);
    setEditMode(false);
  };

  // IMAGE PREVIEW
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: URL.createObjectURL(file) });
    }
  };

  return (
    <div className={styles.container}>

      {/* TOP */}
      <div className={styles["staff-top"]}>
        <button className={styles["add-btn"]} onClick={() => setShowForm(true)}>
          <Plus size={16}/> Nouveau Staff
        </button>

        <div className={styles["search-box"]}>
          <Search size={16}/>
          <input placeholder="Rechercher..." onChange={(e)=>setSearch(e.target.value)}/>
        </div>
      </div>

      {/* TABLE */}
      <div className={styles["table-container"]}>
        <table>
          <thead>
            <tr>
              <th>Img</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Fonction</th>
              <th>Tél</th>
              <th>Email</th>
              <th>Sexe</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>
                  {s.image ? <img src={s.image} alt="" className={styles.avatar}/> : "—"}
                </td>
                <td>{s.nom}</td>
                <td>{s.prenom}</td>
                <td>{s.role}</td>
                <td>{s.tel}</td>
                <td>{s.email}</td>
                <td>{s.sexe}</td>

                <td className={styles.actions}>
                  <button onClick={() => openEdit(s)}><Edit size={16}/></button>
                  <button onClick={() => deleteStaff(s.id)}><Trash2 size={16}/></button>
                  <button><Calendar size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className={styles.modal}>
          <div className={styles.box}>
            <div className={styles["modal-header"]}>
              <h3>{editMode ? "Modifier" : "Ajouter"} Staff</h3>
              <X onClick={resetForm}/>
            </div>

            <input placeholder="Nom" value={form.nom} onChange={(e)=>setForm({...form, nom:e.target.value})}/>
            <input placeholder="Prénom" value={form.prenom} onChange={(e)=>setForm({...form, prenom:e.target.value})}/>
            <input placeholder="Fonction" value={form.role} onChange={(e)=>setForm({...form, role:e.target.value})}/>
            <input placeholder="Téléphone" value={form.tel} onChange={(e)=>setForm({...form, tel:e.target.value})}/>
            <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})}/>

            <select value={form.sexe} onChange={(e)=>setForm({...form, sexe:e.target.value})}>
              <option value="">Sexe</option>
              <option>Homme</option>
              <option>Femme</option>
            </select>

            <input type="file" onChange={handleImage}/>

            {form.image && <img src={form.image} className={styles.preview} alt="preview"/>}

            <button className={styles["save-btn"]} onClick={editMode ? updateStaff : addStaff}>
              {editMode ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Staff;