// server.js - Backend complet pour la gestion d'un club sportif
// Stack recommandé : Node.js + Express + MySQL

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Fichier de connexion à la base de données (à créer)

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Route de test / bienvenue
app.get('/', (req, res) => {
    res.json({
        message: "Backend Gestion Club Sportif - Opérationnel",
        status: "running",
        date: new Date().toLocaleString()
    });
});

// ─────────────────────────────────────────────────────────────
// 1. Gestion des membres
// ─────────────────────────────────────────────────────────────

// Liste tous les membres
app.get('/api/membres', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                p.id_personne, p.nom, p.prenom, p.age, p.adresse, 
                p.telephone, p.email, m.date_inscription, m.type_membre
            FROM info_personne p
            INNER JOIN Membre m ON p.id_personne = m.id_membre
        `);
        res.json(rows);
    } catch (error) {
        console.error('Erreur liste membres:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Ajouter un nouveau membre
app.post('/api/membres', async (req, res) => {
    const { nom, prenom, age, adresse, telephone, email, date_inscription, type_membre } = req.body;

    try {
        const [personResult] = await db.query(
            'INSERT INTO info_personne (nom, prenom, age, adresse, telephone, email) VALUES (?, ?, ?, ?, ?, ?)',
            [nom, prenom, age, adresse, telephone, email]
        );

        const id = personResult.insertId;

        await db.query(
            'INSERT INTO Membre (id_membre, date_inscription, type_membre) VALUES (?, ?, ?)',
            [id, date_inscription, type_membre]
        );

        res.status(201).json({ message: 'Membre ajouté', id_membre: id });
    } catch (error) {
        console.error('Erreur création membre:', error);
        res.status(500).json({ error: 'Erreur lors de la création' });
    }
});

// Modifier un membre (exemple simple - à compléter selon besoins)
app.put('/api/membres/:id', async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, age, adresse, telephone, email } = req.body;

    try {
        await db.query(
            'UPDATE info_personne SET nom=?, prenom=?, age=?, adresse=?, telephone=?, email=? WHERE id_personne=?',
            [nom, prenom, age, adresse, telephone, email, id]
        );
        res.json({ message: 'Membre modifié' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur modification' });
    }
});

// ─────────────────────────────────────────────────────────────
// 2. Gestion des abonnements
// ─────────────────────────────────────────────────────────────

app.get('/api/abonnements', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Abonnement');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Erreur liste abonnements' });
    }
});

app.post('/api/abonnements', async (req, res) => {
    const { type, date_debut, date_fin, prix, id_membre } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Abonnement (type, date_debut, date_fin, prix, id_membre) VALUES (?, ?, ?, ?, ?)',
            [type, date_debut, date_fin, prix, id_membre]
        );
        res.status(201).json({ message: 'Abonnement créé', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur création abonnement' });
    }
});

// GET : Liste des paiements avec infos membre + abonnement
app.get('/api/paiements', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_paiement,
        p.montant,
        p.date_paiement,
        p.mode_paiement,
        p.statut,
        p.id_abonnement,
        a.type AS type_abonnement,
        CONCAT(m.nom, ' ', m.prenom) AS nom_membre,
        m.id_personne AS id_membre
      FROM Paiement p
      LEFT JOIN Abonnement a ON p.id_abonnement = a.id_abonnement
      LEFT JOIN Membre mem ON a.id_membre = mem.id_membre
      LEFT JOIN info_personne m ON mem.id_membre = m.id_personne
      ORDER BY p.date_paiement DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Erreur GET /api/paiements:', err.message);
    res.status(500).json({ error: 'Erreur chargement paiements', details: err.message });
  }
});

// POST : Ajouter un paiement
app.post('/api/paiements', async (req, res) => {
  const { montant, date_paiement, mode_paiement, statut, id_abonnement } = req.body;

  if (!montant || !date_paiement || !mode_paiement || !statut || !id_abonnement) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO Paiement (montant, date_paiement, mode_paiement, statut, id_abonnement) VALUES (?, ?, ?, ?, ?)',
      [montant, date_paiement, mode_paiement, statut, id_abonnement]
    );
    res.status(201).json({ message: 'Paiement ajouté', id: result.insertId });
  } catch (err) {
    console.error('Erreur POST /api/paiements:', err.message);
    res.status(500).json({ error: 'Erreur ajout paiement', details: err.message });
  }
});

// PUT : Marquer un paiement comme "Payé"
app.put('/api/paiements/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      'UPDATE Paiement SET statut = "Payé" WHERE id_paiement = ?',
      [id]
    );
    res.json({ message: 'Paiement marqué comme Payé' });
  } catch (err) {
    console.error('Erreur PUT /api/paiements:', err.message);
    res.status(500).json({ error: 'Erreur mise à jour statut' });
  }
});


// GET toutes les séances
app.get('/api/seances', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.id_seance,
        s.date,
        s.heure,
        s.capacite,
        COALESCE(sp.nom_sport, 'غير محدد') AS nom_sport,
        COALESCE(CONCAT(p.nom, ' ', p.prenom), 'مدرب غير معروف') AS nom_coach
      FROM seances s
      LEFT JOIN sports sp ON s.id_sport = sp.id_sport
      LEFT JOIN coach c ON s.id_coach = c.id_coach
      LEFT JOIN info_personne p ON c.id_coach = p.id_personne
      ORDER BY s.date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Erreur GET /api/seances:', err.message);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// POST : Ajout simple (avec conversion des nombres)
app.post('/api/seances', async (req, res) => {
  console.log('POST /api/seances - Données reçues :', req.body); // Debug très utile

  const { date, heure, capacite, id_sport, id_coach } = req.body;

  // Vérification rapide
  if (!date || !heure || !capacite || !id_sport || !id_coach) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO seances (date, heure, capacite, id_sport, id_coach) VALUES (?, ?, ?, ?, ?)',
      [date, heure, Number(capacite), Number(id_sport), Number(id_coach)]
    );

    console.log('Séance ajoutée avec ID :', result.insertId);
    res.status(201).json({ message: 'Séance ajoutée avec succès', id: result.insertId });
  } catch (err) {
    console.error('ERREUR POST /api/seances :', err.message);
    console.error('Stack complet :', err.stack);
    res.status(500).json({
      error: 'Erreur lors de l’ajout',
      message: err.message,
      details: 'Causes possibles : foreign key invalide, format date/heure incorrect, ou champs manquants'
    });
  }
});

// ─────────────────────────────────────────────────────────────
// 5. Suivi de présence (inscriptions aux séances)
// ─────────────────────────────────────────────────────────────

app.post('/api/presence', async (req, res) => {
    const { id_membre, id_seance, statut } = req.body; // statut: Inscrit / Présent / Absent
    try {
        const [result] = await db.query(
            'INSERT INTO Inscription (date_inscription, statut, id_membre, id_seance) VALUES (CURDATE(), ?, ?, ?)',
            [statut, id_membre, id_seance]
        );
        res.status(201).json({ message: 'Présence enregistrée', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur enregistrement présence' });
    }
});


// GET : Liste des membres pour inscription/présence
app.get('/api/membres-for-seance', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id_personne, nom, prenom FROM info_personne 
      JOIN Membre ON id_personne = id_membre
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur chargement membres' });
  }
});

// POST : Inscrire ou marquer présence
app.post('/api/presence', async (req, res) => {
  const { id_seance, id_membre, statut } = req.body; // statut: 'Inscrit', 'Présent', 'Absent'
  try {
    // Vérifier si déjà inscrit
    const [existing] = await db.query(
      'SELECT * FROM Inscription WHERE id_seance = ? AND id_membre = ?',
      [id_seance, id_membre]
    );

    if (existing.length > 0) {
      // Mise à jour
      await db.query(
        'UPDATE Inscription SET statut = ? WHERE id_seance = ? AND id_membre = ?',
        [statut, id_seance, id_membre]
      );
    } else {
      // Nouvelle inscription
      await db.query(
        'INSERT INTO Inscription (date_inscription, statut, id_membre, id_seance) VALUES (CURDATE(), ?, ?, ?)',
        [statut, id_membre, id_seance]
      );
    }
    res.json({ message: 'Présence mise à jour' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur mise à jour présence' });
  }
});

// GET : Présence pour une séance spécifique
app.get('/api/presence/:id_seance', async (req, res) => {
  const { id_seance } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        i.id_membre,
        p.nom,
        p.prenom,
        i.statut
      FROM Inscription i
      JOIN info_personne p ON i.id_membre = p.id_personne
      WHERE i.id_seance = ?
    `, [id_seance]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur chargement présence' });
  }
});


// GET /api/rapports – Statistiques globales
app.get('/api/rapports', async (req, res) => {
  try {
    const stats = {};

    // 1. Nombre total de membres
    const [membres] = await db.query('SELECT COUNT(*) AS total FROM Membre');
    stats.total_membres = membres[0].total;

    // 2. Nombre d'abonnements actifs (date_fin >= aujourd'hui)
    const [abosActifs] = await db.query(
      'SELECT COUNT(*) AS total FROM Abonnement WHERE date_fin >= CURDATE()'
    );
    stats.abonnements_actifs = abosActifs[0].total;

    // 3. Revenus totaux (somme des paiements "Payé")
    const [revenus] = await db.query(
      'SELECT COALESCE(SUM(montant), 0) AS total FROM Paiement WHERE statut = "Payé"'
    );
    stats.revenus_totaux = revenus[0].total;

    // 4. Total paiements en attente
    const [enAttente] = await db.query(
      'SELECT COALESCE(SUM(montant), 0) AS total FROM Paiement WHERE statut = "En attente"'
    );
    stats.paiements_en_attente = enAttente[0].total;

    // 5. Nombre total de séances
    const [seances] = await db.query('SELECT COUNT(*) AS total FROM seances');
    stats.total_seances = seances[0].total;

    // 6. Taux de présence moyen (approximatif : % de présents / inscrits)
    const [presence] = await db.query(`
      SELECT 
        COALESCE(
          (SUM(CASE WHEN statut = 'Présent' THEN 1 ELSE 0 END) / 
           NULLIF(SUM(CASE WHEN statut IN ('Présent', 'Absent') THEN 1 ELSE 0 END), 0)
          ) * 100, 
          0
        ) AS taux_presence_moyen
      FROM Inscription
    `);
    stats.taux_presence_moyen = Math.round(presence[0].taux_presence_moyen * 100) / 100;

    res.json(stats);
  } catch (err) {
    console.error('Erreur GET /api/rapports:', err.message);
    res.status(500).json({ error: 'Erreur chargement statistiques', details: err.message });
  }
});

// Routes Sports
app.get('/api/sports', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sports');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur chargement sports' });
  }
});

app.post('/api/sports', async (req, res) => {
  const { nom_sport, categorie } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO sports (nom_sport, categorie) VALUES (?, ?)',
      [nom_sport, categorie]
    );
    res.status(201).json({ id_sport: result.insertId, nom_sport, categorie });
  } catch (err) {
    res.status(500).json({ error: 'Erreur ajout sport' });
  }
});

app.put('/api/sports/:id', async (req, res) => {
  const { nom_sport, categorie } = req.body;
  try {
    await db.query(
      'UPDATE sports SET nom_sport=?, categorie=? WHERE id_sport=?',
      [nom_sport, categorie, req.params.id]
    );
    res.json({ message: 'Sport modifié' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur modification sport' });
  }
});

app.delete('/api/sports/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM sports WHERE id_sport=?', [req.params.id]);
    res.json({ message: 'Sport supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression sport' });
  }
});

// Route membres-simple
app.get('/api/membres-simple', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id_personne, nom, prenom FROM info_personne JOIN Membre ON id_personne = id_membre');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur chargement membres' });
  }
});


// GET membre by ID
app.get('/api/membres/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id_personne, p.nom, p.prenom, p.age, p.adresse, 
             p.telephone, p.email, m.date_inscription, m.type_membre
      FROM info_personne p
      INNER JOIN Membre m ON p.id_personne = m.id_membre
      WHERE p.id_personne = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Membre non trouvé' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
// ─────────────────────────────────────────────────────────────
// Lancement du serveur
// ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log("→ Test: http://localhost:4000/");
    console.log("→ Membres: http://localhost:4000/api/membres");
});
