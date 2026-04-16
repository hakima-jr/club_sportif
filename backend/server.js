import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ====== Database connection using POOL ======
const db = mysql.createPool({
  host: 'db', // تأكدي بلي مايناش localhost هنا، خاص تكون db
  user: 'root',
  password: 'root_password',
  database: 'projectmaj_db',
  port: 3306
});
// باش نتأكدو باللي الـ Pool خدام
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Failed to connect to DB:", err.message);
    return;
  }
  console.log("DB connected via Pool ✅");
  connection.release();
});
// ====== Routes ======

// Sports
app.get("/sports", (req, res) => {
  db.query("SELECT * FROM sports", (err, results) => {
    if (err) {
      console.error("❌ MySQL Error:", err); // هادي غاتطبع الخطأ كامل فـ Terminal
      return res.status(500).json({ error: err.message }); // هادي غاتصيفط غي الرسالة لـ React
    }
    res.json(results);
  });
});


app.post("/sports", (req, res) => {
  const { nom_sport, categorie } = req.body;
  db.query("INSERT INTO sports (nom_sport, categorie) VALUES (?, ?)", [nom_sport, categorie], (err, result) => {
    if (err) {
      console.error("❌ MySQL Error:", err); // هادي غاتطبع الخطأ كامل فـ Terminal
      return res.status(500).json({ error: err.message }); // هادي غاتصيفط غي الرسالة لـ React
    }
    // ✅ هنا تم التصحيح: استعملنا result ماشي results
    res.json({ id_sport: result.insertId, nom_sport, categorie });
  });
});

app.put("/sports/:id", (req, res) => {
  const { id } = req.params;
  const { nom_sport, categorie } = req.body;
  db.query("UPDATE sports SET nom_sport=?, categorie=? WHERE id_sport=?", [nom_sport, categorie, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.sendStatus(200);
  });
});

app.delete("/sports/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM sports WHERE id_sport=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.sendStatus(200);
  });
});

// Seances (Version Corrigée)
app.get("/seances", (req, res) => {
  // كاين "seance" فـ الديتابيس ماشي "seances"
  db.query("SELECT * FROM seances", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/seances", (req, res) => {
  const { nom, date, heure, capacite, id_sport, id_coach, niveau } = req.body;
  // تأكد باللي زدتي "nom" و "niveau" فـ phpMyAdmin أولا
  db.query(
    "INSERT INTO seances (nom, date, heure, capacite, id_sport, id_coach, niveau) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [nom, date, heure, capacite, id_sport, id_coach, niveau],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId });
    }
  );
});

app.delete("/seances/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM seances WHERE id_seance=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(200);
  });
});

// Paiements
app.post("/paiements", (req, res) => {
  const { montant, date_paiement, mode_paiement, statut, id_abonnement } = req.body;

  // 1. أمر لتعطيل الرقابة
  db.query("SET FOREIGN_KEY_CHECKS = 0", (err) => {
    if (err) return res.status(500).json(err);

    // 2. إدخال البيانات (تأكد من اسم الجدول 'paiement' بدون s)
    const sql = "INSERT INTO paiement (montant, date_paiement, mode_paiement, statut, id_abonnement) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [montant, date_paiement, mode_paiement, statut, id_abonnement], (err, result) => {
      // 3. إعادة تفعيل الرقابة مباشرة بعد المحاولة
      db.query("SET FOREIGN_KEY_CHECKS = 1");

      if (err) {
        console.error("❌ Erreur MySQL:", err.message);
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ message: "Paiement réussi !", id: result.insertId });
    });
  });
});
// ====== Start server ======
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));