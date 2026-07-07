require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const jwt         = require('jsonwebtoken');
const nodemailer  = require('nodemailer');
const crypto      = require('crypto');
const multer      = require('multer');
const path        = require('path');
const db          = require('./config/db');

const app        = express();
const SECRET_KEY = "club_sportif_secret_2025";
const resetTokens = new Map();

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────────────────
// MULTER — Upload photos coachs
// ─────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, `coach_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  },
});

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─────────────────────────────────────────────────────────────
// Route de test
// ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: "Backend Gestion Club Sportif - Opérationnel", status: "running", date: new Date().toLocaleString() });
});

// ─────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query(
      `SELECT 
         u.id_utilisateur,
         u.nom,
         u.prenom,
         u.email,
         u.role,
         u.id_membre,
         c.id_coach
       FROM Utilisateur u
       LEFT JOIN info_personne ip ON ip.email = u.email
       LEFT JOIN coach c          ON c.id_coach = ip.id_personne
       WHERE u.email = ? AND u.password = ? AND u.actif = true`,
      [email, password]
    );

    if (users.length === 0)
      return res.status(401).json({ success: false, message: "Email ou mot de passe incorrect" });

    const user  = users[0];
    const token = jwt.sign(
      { id: user.id_utilisateur, email: user.email, role: user.role, nom: user.nom, prenom: user.prenom },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      role: user.role,
      user: {
        id:        user.id_utilisateur,
        nom:       user.nom,
        prenom:    user.prenom,
        email:     user.email,
        role:      user.role,
        id_coach:  user.id_coach  || null,
        id_membre: user.id_membre || null,
      },
      message: "Connexion réussie"
    });
  } catch (err) {
    console.error("Erreur login:", err.message);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

app.post('/api/register', async (req, res) => {
  const { nom, prenom, email, password, role, telephone, id_membre } = req.body;

  if (!nom || !prenom || !email || !password || !role)
    return res.status(400).json({ success: false, message: "Tous les champs obligatoires sont requis" });

  try {
    const [existing] = await db.query('SELECT id_utilisateur FROM Utilisateur WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(400).json({ success: false, message: "Cet email est déjà utilisé" });

    if (id_membre) {
      const [existingMember] = await db.query('SELECT id_utilisateur FROM Utilisateur WHERE id_membre = ?', [id_membre]);
      if (existingMember.length > 0)
        return res.status(400).json({ success: false, message: "Ce membre a déjà un compte utilisateur" });
      const [memberExists] = await db.query('SELECT id_membre FROM Membre WHERE id_membre = ?', [id_membre]);
      if (memberExists.length === 0)
        return res.status(400).json({ success: false, message: "Le membre sélectionné n'existe pas" });
    }

    const telValue      = telephone && telephone.trim() !== '' ? telephone.trim() : null;
    const idMembreValue = id_membre ? parseInt(id_membre) : null;

    const [result] = await db.query(
      'INSERT INTO Utilisateur (nom, prenom, email, password, role, telephone, id_membre) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nom, prenom, email, password, role, telValue, idMembreValue]
    );
    res.status(201).json({ success: true, message: "Compte créé avec succès", id: result.insertId });

  } catch (err) {
    console.error("❌ Erreur register:", err.message);
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ success: false, message: "Cet email ou ce membre a déjà un compte" });
    res.status(500).json({ success: false, message: "Erreur lors de la création du compte" });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email requis' });
  try {
    const [users] = await db.query(
      'SELECT id_utilisateur, nom, prenom FROM Utilisateur WHERE email = ? AND actif = true', [email]
    );
    if (users.length === 0)
      return res.json({ success: true, message: 'Si cet email existe, un lien a été envoyé.' });

    const user  = users[0];
    const token = crypto.randomBytes(32).toString('hex');
    resetTokens.set(token, { email, expires: Date.now() + 15 * 60 * 1000 });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    await transporter.sendMail({
      from: `"Club Sportif" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔑 Réinitialisation de votre mot de passe',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <div style="background:#13485f;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:20px;">🏋️ Club Sportif</h1>
          </div>
          <div style="background:#f8fafc;padding:28px;border-radius:0 0 12px 12px;">
            <h2 style="color:#1e293b;">Bonjour ${user.prenom} ${user.nom},</h2>
            <p style="color:#64748b;">Cliquez sur le bouton pour réinitialiser votre mot de passe :</p>
            <div style="text-align:center;margin:24px 0;">
              <a href="${resetLink}" style="background:#13485f;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            <p style="color:#94a3b8;font-size:12px;">⏱ Ce lien expire dans <strong>15 minutes</strong>.</p>
          </div>
        </div>`,
    });
    res.json({ success: true, message: 'Lien envoyé.' });
  } catch (err) {
    console.error('Erreur forgot-password:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ message: 'Token et mot de passe requis' });
  const data = resetTokens.get(token);
  if (!data) return res.status(400).json({ message: 'Lien invalide ou déjà utilisé' });
  if (Date.now() > data.expires) {
    resetTokens.delete(token);
    return res.status(400).json({ message: 'Lien expiré. Veuillez refaire la demande.' });
  }
  try {
    await db.query('UPDATE Utilisateur SET password = ? WHERE email = ?', [newPassword, data.email]);
    resetTokens.delete(token);
    res.json({ success: true, message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    console.error('Erreur reset-password:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Accès refusé - Token manquant" });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalide" });
    req.user = user; next();
  });
};

// ─────────────────────────────────────────────────────────────
// 👤 ADMIN PROFILE — ROUTES ✅ CORRIGÉES
// ─────────────────────────────────────────────────────────────

// GET — Profil de l'admin connecté
app.get('/api/admin/profil', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        u.id_utilisateur,
        u.id_utilisateur AS id_admin,
        u.nom,
        u.prenom,
        u.email,
        u.telephone,
        u.role,
        u.photo,
        ip.adresse,
        ip.date_naissance,
        ip.sexe
      FROM Utilisateur u
      LEFT JOIN info_personne ip ON ip.email = u.email
      WHERE u.id_utilisateur = ?`,
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json({ success: true, profil: rows[0] });
  } catch (err) {
    console.error("❌ Erreur GET admin profil:", err); // log complet (stack + code SQL exact)
    res.status(500).json({ error: 'Erreur chargement profil', details: err.message });
  }
});

// PUT — Modifier le profil
app.put('/api/admin/profil', authenticateToken, upload.single('photo'), async (req, res) => {
  const { nom, prenom, email, telephone, adresse, sexe, date_naissance } = req.body;

  if (!nom || !prenom || !email) {
    return res.status(400).json({ error: 'Nom, prénom et email sont obligatoires' });
  }

  try {
    if (req.file) {
      // Une nouvelle photo a été envoyée avec le formulaire : on la sauvegarde aussi
      await db.query(
        'UPDATE Utilisateur SET nom = ?, prenom = ?, email = ?, telephone = ?, photo = ? WHERE id_utilisateur = ?',
        [nom, prenom, email, telephone || null, req.file.filename, req.user.id]
      );
    } else {
      await db.query(
        'UPDATE Utilisateur SET nom = ?, prenom = ?, email = ?, telephone = ? WHERE id_utilisateur = ?',
        [nom, prenom, email, telephone || null, req.user.id]
      );
    }

    // ✅ info_personne : on vérifie si une ligne existe déjà pour cet admin (via l'ancien email du token)
    // Si elle n'existe pas (cas d'un admin qui n'a jamais eu de ligne info_personne), on la CRÉE
    // au lieu de faire un UPDATE silencieux qui ne touche 0 ligne.
    const [existing] = await db.query(
      'SELECT id_personne FROM info_personne WHERE email = ?',
      [req.user.email]
    );

    if (existing.length > 0) {
      await db.query(
        'UPDATE info_personne SET nom = ?, prenom = ?, email = ?, telephone = ?, adresse = ?, sexe = ?, date_naissance = ? WHERE email = ?',
        [nom, prenom, email, telephone || null, adresse || null, sexe || null, date_naissance || null, req.user.email]
      );
    } else {
      await db.query(
        'INSERT INTO info_personne (nom, prenom, email, telephone, adresse, sexe, date_naissance) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nom, prenom, email, telephone || null, adresse || null, sexe || null, date_naissance || null]
      );
    }

    res.json({ success: true, message: 'Profil mis à jour' });
  } catch (err) {
    console.error("❌ Erreur PUT admin profil:", err);
    res.status(500).json({ error: 'Erreur mise à jour profil', details: err.message });
  }
});


// PUT — Changer le mot de passe
app.put('/api/admin/password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const [rows] = await db.query(
      'SELECT password FROM Utilisateur WHERE id_utilisateur = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    if (rows[0].password !== currentPassword) {
      return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
    }

    await db.query(
      'UPDATE Utilisateur SET password = ? WHERE id_utilisateur = ?',
      [newPassword, req.user.id]
    );
    res.json({ success: true, message: 'Mot de passe modifié avec succès' });
  } catch (err) {
    console.error("❌ Erreur PUT admin password:", err);
    res.status(500).json({ error: 'Erreur modification mot de passe', details: err.message });
  }
});

// GET — Stats pour le dashboard admin
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const [[{ total: totalMembers }]] = await db.query('SELECT COUNT(*) AS total FROM Membre');
    const [[{ total: totalCoaches }]] = await db.query('SELECT COUNT(*) AS total FROM coach');
    const [[{ total: totalSessions }]] = await db.query('SELECT COUNT(*) AS total FROM seances WHERE date >= CURDATE()');
    const [[{ total: revenus }]] = await db.query('SELECT COALESCE(SUM(montant),0) AS total FROM Paiement WHERE statut="Payé" AND YEAR(date_paiement) = YEAR(CURDATE())');

    res.json({
      success: true,
      stats: {
        totalMembers,
        totalCoaches,
        totalSessions,
        revenue: revenus + ' DH',
      }
    });
  } catch (err) {
    console.error("❌ Erreur GET admin stats:", err);
    res.status(500).json({ error: 'Erreur chargement stats', details: err.message });
  }
});

// GET — Activité récente (log simplifié)
app.get('/api/admin/activite', authenticateToken, async (req, res) => {
  try {
    const [inscriptions] = await db.query(
      `SELECT CONCAT('Nouveau membre inscrit : ', p.nom, ' ', p.prenom) AS text, 
              m.date_inscription AS time
       FROM Membre m
       JOIN info_personne p ON m.id_membre = p.id_personne
       ORDER BY m.date_inscription DESC LIMIT 5`
    );
    const [paiements] = await db.query(
      `SELECT CONCAT('Paiement reçu : ', montant, ' DH') AS text,
              date_paiement AS time
       FROM Paiement WHERE statut = 'Payé'
       ORDER BY date_paiement DESC LIMIT 5`
    );
    const [seances] = await db.query(
      `SELECT CONCAT('Séance créée : ', nom) AS text, date AS time
       FROM seances ORDER BY date DESC LIMIT 5`
    );

    const activites = [...inscriptions, ...paiements, ...seances]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5)
      .map(a => ({ ...a, time: new Date(a.time).toLocaleString('fr-FR') }));

    res.json({ success: true, activites });
  } catch (err) {
    console.error("❌ Erreur GET admin activite:", err);
    res.status(500).json({ error: 'Erreur chargement activité', details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// MEMBRES
// ─────────────────────────────────────────────────────────────
app.get('/api/membres', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id_personne, p.nom, p.prenom, p.date_naissance, p.email, p.telephone, p.adresse, p.sexe,
             p.poids, p.taille, p.objectif, p.notes,
             m.date_inscription, m.type_membre
      FROM info_personne p INNER JOIN Membre m ON p.id_personne = m.id_membre
      ORDER BY p.id_personne DESC`);
    res.json(rows);
  } catch (err) {
    console.error("Erreur GET membres:", err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/membres/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id_personne, p.nom, p.prenom, p.date_naissance, p.email, p.telephone, p.adresse, p.sexe,
             p.poids, p.taille, p.objectif, p.notes,
             m.date_inscription, m.type_membre
      FROM info_personne p INNER JOIN Membre m ON p.id_personne = m.id_membre
      WHERE p.id_personne = ?`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Membre non trouvé' });
    res.json(rows[0]);
  } catch (err) {
    console.error("Erreur GET membre/:id:", err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/membres', async (req, res) => {
  const { nom, prenom, date_naissance, adresse, telephone, email, sexe, date_inscription, type_membre, poids, taille, objectif, notes } = req.body;
  try {
    const [r] = await db.query(
      'INSERT INTO info_personne (nom, prenom, date_naissance, adresse, telephone, email, sexe, poids, taille, objectif, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nom, prenom, date_naissance || null, adresse, telephone, email, sexe || null, poids || null, taille || null, objectif || null, notes || null]
    );
    await db.query(
      'INSERT INTO Membre (id_membre, date_inscription, type_membre) VALUES (?, ?, ?)',
      [r.insertId, date_inscription, type_membre || 'Standard']
    );
    res.status(201).json({ message: 'Membre ajouté', id_membre: r.insertId });
  } catch (err) {
    console.error("Erreur POST membre:", err.message);
    res.status(500).json({ error: 'Erreur lors de la création' });
  }
});

app.put('/api/membres/:id', async (req, res) => {
  console.log("📥 PUT membre body reçu:", req.body);

  const { nom, prenom, date_naissance, adresse, telephone, email, sexe, poids, taille, objectif, notes, type_membre } = req.body;

  if (!nom || !prenom || !email) {
    return res.status(400).json({ error: 'Nom, prénom et email sont obligatoires', body: req.body });
  }

  try {
    await db.query(
      `UPDATE info_personne 
       SET nom=?, prenom=?, date_naissance=?, adresse=?, telephone=?, email=?, sexe=?, poids=?, taille=?, objectif=?, notes=? 
       WHERE id_personne=?`,
      [
        nom ?? null,
        prenom ?? null,
        date_naissance || null,
        adresse ?? null,
        telephone ?? null,
        email ?? null,
        sexe || null,
        (poids === '' || poids === undefined) ? null : poids,
        (taille === '' || taille === undefined) ? null : taille,
        objectif || null,
        notes ?? null,
        req.params.id
      ]
    );

    if (type_membre) {
      await db.query('UPDATE Membre SET type_membre=? WHERE id_membre=?', [type_membre, req.params.id]);
    }

    res.json({ message: 'Membre modifié' });
  } catch (err) {
    console.error("❌ Erreur PUT membre:", err);
    res.status(500).json({ error: 'Erreur modification', details: err.message });
  }
});

app.delete('/api/membres/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM info_personne WHERE id_personne=?', [req.params.id]);
    res.json({ message: 'Membre supprimé' });
  } catch (err) {
    console.error("Erreur DELETE membre:", err.message);
    res.status(500).json({ error: 'Erreur suppression' });
  }
});

// ─────────────────────────────────────────────────────────────
// COACHS
// ─────────────────────────────────────────────────────────────
app.get('/api/coachs', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_personne AS id_coach,
        p.nom, p.prenom, p.date_naissance,
        p.telephone, p.email, p.adresse, p.sexe,
        c.specialite, c.salaire, c.statut, c.photo
      FROM info_personne p
      INNER JOIN coach c ON p.id_personne = c.id_coach
      ORDER BY p.nom ASC`);
    res.json(rows);
  } catch (err) {
    console.error("Erreur GET coachs:", err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/coachs/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_personne AS id_coach,
        p.nom, p.prenom, p.date_naissance,
        p.telephone, p.email, p.adresse, p.sexe,
        c.specialite, c.salaire, c.statut, c.photo
      FROM info_personne p
      INNER JOIN coach c ON p.id_personne = c.id_coach
      WHERE p.id_personne = ?`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Coach non trouvé' });
    res.json(rows[0]);
  } catch (err) {
    console.error("Erreur GET coach/:id:", err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/coachs', upload.single('photo'), async (req, res) => {
  const { nom, prenom, date_naissance, telephone, email, adresse, specialite, sexe, salaire, statut } = req.body;
  if (!nom || !prenom || !email || !specialite)
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  try {
    const [r] = await db.query(
      'INSERT INTO info_personne (nom, prenom, date_naissance, telephone, email, adresse, sexe) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nom, prenom, date_naissance || null, telephone || null, email, adresse || null, sexe || null]
    );
    const photoName = req.file ? req.file.filename : null;
    await db.query(
      'INSERT INTO coach (id_coach, specialite, salaire, statut, photo) VALUES (?, ?, ?, ?, ?)',
      [r.insertId, specialite, salaire ? parseFloat(salaire) : null, statut || 'actif', photoName]
    );
    res.status(201).json({ message: 'Coach ajouté', id_coach: r.insertId });
  } catch (err) {
    console.error("Erreur POST coach:", err.message);
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ error: 'Email déjà utilisé' });
    res.status(500).json({ error: 'Erreur création coach', details: err.message });
  }
});

app.put('/api/coachs/:id', upload.single('photo'), async (req, res) => {
  const { nom, prenom, date_naissance, telephone, email, adresse, specialite, sexe, salaire, statut } = req.body;
  try {
    await db.query(
      'UPDATE info_personne SET nom=?, prenom=?, date_naissance=?, telephone=?, email=?, adresse=?, sexe=? WHERE id_personne=?',
      [nom, prenom, date_naissance || null, telephone || null, email, adresse || null, sexe || null, req.params.id]
    );
    if (req.file) {
      await db.query(
        'UPDATE coach SET specialite=?, salaire=?, statut=?, photo=? WHERE id_coach=?',
        [specialite, salaire ? parseFloat(salaire) : null, statut || 'actif', req.file.filename, req.params.id]
      );
    } else {
      await db.query(
        'UPDATE coach SET specialite=?, salaire=?, statut=? WHERE id_coach=?',
        [specialite, salaire ? parseFloat(salaire) : null, statut || 'actif', req.params.id]
      );
    }
    res.json({ message: 'Coach modifié' });
  } catch (err) {
    console.error("Erreur PUT coach:", err.message);
    res.status(500).json({ error: 'Erreur modification coach', details: err.message });
  }
});

app.delete('/api/coachs/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM info_personne WHERE id_personne=?', [req.params.id]);
    res.json({ message: 'Coach supprimé' });
  } catch (err) {
    console.error("Erreur DELETE coach:", err.message);
    res.status(500).json({ error: 'Erreur suppression' });
  }
});

// ─────────────────────────────────────────────────────────────
// SPORTS
// ─────────────────────────────────────────────────────────────
app.get('/api/sports', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sports ORDER BY nom_sport ASC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Erreur serveur' }); }
});

// ─────────────────────────────────────────────────────────────
// SÉANCES
// ─────────────────────────────────────────────────────────────
app.get('/api/seances', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.id_seance, s.nom, s.date, s.heure, s.capacite, s.niveau, s.public_cible,
        s.id_sport, s.id_coach,
        COALESCE(sp.nom_sport,'Non défini') AS nom_sport,
        COALESCE(CONCAT(p.nom,' ',p.prenom),'Coach inconnu') AS nom_coach
      FROM seances s
      LEFT JOIN sports sp ON s.id_sport = sp.id_sport
      LEFT JOIN coach c ON s.id_coach = c.id_coach
      LEFT JOIN info_personne p ON c.id_coach = p.id_personne
      ORDER BY s.date DESC`);
    res.json(rows);
  } catch (err) {
    console.error("Erreur GET seances:", err.message);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// ✅ GET membres inscrits à une séance spécifique
app.get('/api/seances/:id/membres', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_personne,
        p.nom,
        p.prenom,
        i.statut AS statut_inscription,
        i.date_inscription
      FROM Inscription i
      JOIN info_personne p ON i.id_membre = p.id_personne
      WHERE i.id_seance = ?
      ORDER BY p.nom ASC
    `, [req.params.id]);
    res.json(rows);
  } catch (err) {
    console.error("Erreur GET membres pour séance:", err.message);
    res.status(500).json({ error: 'Erreur chargement membres inscrits' });
  }
});

app.post('/api/seances', async (req, res) => {
  const { nom, date, heure, capacite, id_sport, id_coach, niveau, public_cible } = req.body;

  console.log("📥 Body reçu:", req.body);

  if (!nom || !date || !heure || !capacite || !id_sport || !id_coach)
    return res.status(400).json({ error: 'Champs obligatoires', body: req.body });
  try {
    const [r] = await db.query(
      'INSERT INTO seances (nom, date, heure, capacite, id_sport, id_coach, niveau, public_cible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nom, date, heure, Number(capacite), Number(id_sport), Number(id_coach), niveau || null, public_cible || 'Mixte']
    );
    res.status(201).json({ message: 'Séance ajoutée', id: r.insertId });
  } catch (err) {
    console.error("❌ Erreur INSERT seance:", err.message);
    res.status(500).json({ error: "Erreur ajout", details: err.message });
  }
});

app.delete('/api/seances/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM seances WHERE id_seance=?', [req.params.id]);
    res.json({ message: 'Séance supprimée' });
  } catch (err) { res.status(500).json({ error: 'Erreur suppression' }); }
});

app.put('/api/seances/:id', async (req, res) => {
  const { nom, date, heure, capacite, id_sport, id_coach, niveau, public_cible } = req.body;
  console.log("📥 PUT seance body:", req.body);
  try {
    await db.query(
      'UPDATE seances SET nom=?, date=?, heure=?, capacite=?, id_sport=?, id_coach=?, niveau=?, public_cible=? WHERE id_seance=?',
      [nom, date, heure, capacite, Number(id_sport), Number(id_coach), niveau, public_cible, req.params.id]
    );
    res.json({ message: 'Séance modifiée' });
  } catch (err) {
    console.error("❌ Erreur PUT seance:", err.message);
    res.status(500).json({ error: 'Erreur modification', details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// ABONNEMENTS
// ─────────────────────────────────────────────────────────────
app.get('/api/abonnements', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.id_abonnement, a.type, a.date_debut, a.date_fin, a.prix, a.id_membre,
        CONCAT(m.nom,' ',m.prenom) AS nom_membre
      FROM Abonnement a
      LEFT JOIN Membre mem ON a.id_membre = mem.id_membre
      LEFT JOIN info_personne m ON mem.id_membre = m.id_personne
      ORDER BY a.date_debut DESC`);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Erreur chargement' }); }
});

app.post('/api/abonnements', async (req, res) => {
  const { type, date_debut, date_fin, prix, id_membre } = req.body;
  if (!type || !date_debut || !date_fin || !prix || !id_membre)
    return res.status(400).json({ error: "Champs obligatoires" });
  try {
    const [r] = await db.query(
      'INSERT INTO Abonnement (type, date_debut, date_fin, prix, id_membre) VALUES (?, ?, ?, ?, ?)',
      [type, date_debut, date_fin, parseFloat(prix), parseInt(id_membre)]
    );
    res.status(201).json({ message: "Abonnement ajouté", id: r.insertId });
  } catch (err) { res.status(500).json({ error: "Erreur ajout" }); }
});

app.put('/api/abonnements/:id', async (req, res) => {
  const { type, date_debut, date_fin, prix } = req.body;
  try {
    await db.query(
      'UPDATE Abonnement SET type=?, date_debut=?, date_fin=?, prix=? WHERE id_abonnement=?',
      [type, date_debut?.split('T')[0], date_fin?.split('T')[0], parseFloat(prix), req.params.id]
    );
    res.json({ message: 'Abonnement modifié' });
  } catch (err) { res.status(500).json({ error: 'Erreur modification' }); }
});

app.delete('/api/abonnements/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM Paiement WHERE id_abonnement=?', [req.params.id]);
    await db.query('DELETE FROM Abonnement WHERE id_abonnement=?', [req.params.id]);
    res.json({ message: 'Abonnement supprimé' });
  } catch (err) { res.status(500).json({ error: 'Erreur suppression' }); }
});

app.get('/api/abonnements-par-membre/:id_membre', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id_abonnement, type, date_debut, date_fin, prix FROM Abonnement WHERE id_membre=? ORDER BY date_fin DESC',
      [req.params.id_membre]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Erreur chargement' }); }
});

// ─────────────────────────────────────────────────────────────
// PAIEMENTS
// ─────────────────────────────────────────────────────────────
app.get('/api/paiements', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_paiement, p.montant, p.date_paiement, p.mode_paiement, p.statut,
        p.id_abonnement, p.reference,
        a.type AS type_abonnement, a.prix AS prix_abonnement, a.id_membre,
        CONCAT(ip.nom, ' ', ip.prenom) AS nom_membre,
        ip.email, ip.telephone
      FROM Paiement p
      JOIN Abonnement a ON p.id_abonnement = a.id_abonnement
      JOIN Membre m ON a.id_membre = m.id_membre
      JOIN info_personne ip ON m.id_membre = ip.id_personne
      ORDER BY p.date_paiement DESC`);
    res.json(rows);
  } catch (err) {
    console.error("Erreur GET paiements:", err.message);
    res.status(500).json({ error: 'Erreur chargement paiements' });
  }
});

app.get('/api/paiements-par-membre/:id_membre', async (req, res) => {
  try {
    const { id_membre } = req.params;
    const [memberCheck] = await db.query('SELECT id_membre FROM Membre WHERE id_membre = ?', [id_membre]);
    if (memberCheck.length === 0) return res.status(404).json({ error: 'Membre non trouvé' });
    const [rows] = await db.query(`
      SELECT p.id_paiement, p.montant, p.date_paiement, p.mode_paiement, p.statut,
        p.id_abonnement, p.reference,
        a.type AS type_abonnement, a.prix AS prix_abonnement, a.date_debut, a.date_fin
      FROM Paiement p
      JOIN Abonnement a ON p.id_abonnement = a.id_abonnement
      WHERE a.id_membre = ?
      ORDER BY p.date_paiement DESC`, [id_membre]);
    res.json(rows);
  } catch (err) {
    console.error("Erreur GET paiements par membre:", err.message);
    res.status(500).json({ error: 'Erreur chargement paiements membre', details: err.message });
  }
});

app.get('/api/paiements-par-abonnement/:id_abonnement', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Paiement WHERE id_abonnement = ? ORDER BY date_paiement DESC', [req.params.id_abonnement]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Erreur chargement paiements abonnement' }); }
});

app.post('/api/paiements', async (req, res) => {
  const { montant, date_paiement, mode_paiement, statut, id_abonnement, reference } = req.body;
  if (!montant || !date_paiement || !mode_paiement || !statut || !id_abonnement)
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  try {
    const [abo] = await db.query('SELECT * FROM Abonnement WHERE id_abonnement = ?', [id_abonnement]);
    if (abo.length === 0) return res.status(404).json({ error: 'Abonnement non trouvé' });
    const [r] = await db.query(
      'INSERT INTO Paiement (montant, date_paiement, mode_paiement, statut, id_abonnement, reference) VALUES (?, ?, ?, ?, ?, ?)',
      [parseFloat(montant), date_paiement, mode_paiement, statut, parseInt(id_abonnement), reference || null]
    );
    res.status(201).json({ message: 'Paiement ajouté avec succès', id_paiement: r.insertId });
  } catch (err) {
    console.error("Erreur POST paiement:", err.message);
    res.status(500).json({ error: 'Erreur ajout paiement' });
  }
});

app.put('/api/paiements/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'UPDATE Paiement SET statut="Payé", date_paiement=CURDATE() WHERE id_paiement=? AND statut="En attente"',
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Paiement non trouvé ou déjà payé' });
    res.json({ message: 'Paiement validé avec succès' });
  } catch (err) { res.status(500).json({ error: 'Erreur validation paiement' }); }
});

app.put('/api/paiements/update/:id', async (req, res) => {
  const { montant, date_paiement, mode_paiement, statut, reference } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE Paiement SET montant=?, date_paiement=?, mode_paiement=?, statut=?, reference=? WHERE id_paiement=?',
      [parseFloat(montant), date_paiement?.split('T')[0], mode_paiement, statut, reference || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Paiement non trouvé' });
    res.json({ message: 'Paiement modifié avec succès' });
  } catch (err) { res.status(500).json({ error: 'Erreur modification paiement' }); }
});

app.delete('/api/paiements/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Paiement WHERE id_paiement=?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Paiement non trouvé' });
    res.json({ message: 'Paiement supprimé avec succès' });
  } catch (err) { res.status(500).json({ error: 'Erreur suppression paiement' }); }
});

// ─────────────────────────────────────────────────────────────
// PRÉSENCE
// ─────────────────────────────────────────────────────────────
app.get('/api/presence/:id_seance', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id_membre, statut
      FROM Inscription
      WHERE id_seance = ? 
        AND statut IN ('Présent', 'Absent')
    `, [req.params.id_seance]);

    res.json(rows);
  } catch (err) { 
    console.error("❌ Erreur GET présence:", err.message);
    res.status(500).json({ error: 'Erreur chargement présence' }); 
  }
});

app.post('/api/presence', async (req, res) => {
  const { id_seance, id_membre, statut } = req.body;

  console.log('📝 Enregistrement présence:', { id_seance, id_membre, statut });

  try {
    const [existing] = await db.query(
      'SELECT id_inscription FROM Inscription WHERE id_seance = ? AND id_membre = ?',
      [id_seance, id_membre]
    );

    if (existing.length === 0) {
      await db.query(
        `INSERT INTO Inscription (id_seance, id_membre, statut, date_inscription) 
         VALUES (?, ?, ?, CURDATE())`,
        [id_seance, id_membre, statut]
      );
    } else {
      await db.query(
        'UPDATE Inscription SET statut = ? WHERE id_seance = ? AND id_membre = ?',
        [statut, id_seance, id_membre]
      );
    }

    res.json({ 
      success: true, 
      message: 'Présence mise à jour',
      data: { id_seance, id_membre, statut }
    });
  } catch (err) { 
    console.error("❌ Erreur POST présence:", err.message);
    res.status(500).json({ error: 'Erreur enregistrement présence', details: err.message }); 
  }
});

app.get('/api/membres-for-seance', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id_personne, nom, prenom 
      FROM info_personne 
      JOIN Membre ON id_personne = id_membre
      ORDER BY nom ASC
    `);
    res.json(rows);
  } catch (err) { 
    console.error("❌ Erreur GET membres-for-seance:", err.message);
    res.status(500).json({ error: 'Erreur chargement membres' }); 
  }
});

// ─────────────────────────────────────────────────────────────
// PAIEMENTS COACHS
// ─────────────────────────────────────────────────────────────
app.get('/api/paiement-coachs', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id_coach,
        CONCAT(p.nom, ' ', p.prenom) AS nom_coach,
        c.specialite,
        c.salaire,
        c.statut
      FROM coach c
      JOIN info_personne p ON c.id_coach = p.id_personne
      ORDER BY p.nom ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erreur GET paiement coachs:", err.message);
    res.status(500).json({ error: 'Erreur chargement paiement coachs' });
  }
});

// ─────────────────────────────────────────────────────────────
// RAPPORTS
// ─────────────────────────────────────────────────────────────
app.get('/api/rapports', async (req, res) => {
  try {
    const [[{ total }]]               = await db.query('SELECT COUNT(*) AS total FROM Membre');
    const [[{ total: aboActifs }]]    = await db.query('SELECT COUNT(*) AS total FROM Abonnement WHERE date_fin >= CURDATE()');
    const [[{ total: revenus }]]      = await db.query('SELECT COALESCE(SUM(montant),0) AS total FROM Paiement WHERE statut="Payé"');
    const [[{ total: attente }]]      = await db.query('SELECT COALESCE(SUM(montant),0) AS total FROM Paiement WHERE statut="En attente"');
    const [[{ total: seances }]]      = await db.query('SELECT COUNT(*) AS total FROM seances');
    const [[{ taux_presence_moyen }]] = await db.query(`
      SELECT COALESCE(
        (SUM(CASE WHEN statut='Présent' THEN 1 ELSE 0 END) /
         NULLIF(SUM(CASE WHEN statut IN ('Présent','Absent') THEN 1 ELSE 0 END),0)) * 100, 0
      ) AS taux_presence_moyen FROM Inscription`);
    res.json({
      total_membres:        total,
      abonnements_actifs:   aboActifs,
      revenus_totaux:       revenus,
      paiements_en_attente: attente,
      total_seances:        seances,
      taux_presence_moyen:  Math.round(taux_presence_moyen * 100) / 100
    });
  } catch (err) { res.status(500).json({ error: 'Erreur statistiques' }); }
});

// ─────────────────────────────────────────────────────────────
// COMMENTAIRES
// ─────────────────────────────────────────────────────────────
app.get('/api/commentaires/:id_membre', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id_commentaire,
        c.id_membre,
        c.id_coach,
        c.commentaire,
        c.date_creation,
        CONCAT(p.nom, ' ', p.prenom) AS nom_coach
      FROM commentaires c
      JOIN info_personne p ON c.id_coach = p.id_personne
      WHERE c.id_membre = ?
      ORDER BY c.date_creation DESC
    `, [req.params.id_membre]);
    res.json(rows);
  } catch (err) {
    console.error("Erreur GET commentaires:", err.message);
    res.status(500).json({ error: 'Erreur chargement commentaires' });
  }
});

app.post('/api/commentaires', async (req, res) => {
  const { id_membre, id_coach, commentaire } = req.body;

  if (!id_membre || !id_coach || !commentaire || !commentaire.trim()) {
    return res.status(400).json({ error: 'id_membre, id_coach et commentaire sont obligatoires' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO commentaires (id_membre, id_coach, commentaire) VALUES (?, ?, ?)',
      [id_membre, id_coach, commentaire.trim()]
    );
    res.status(201).json({ 
      message: 'Commentaire ajouté', 
      id_commentaire: result.insertId 
    });
  } catch (err) {
    console.error("Erreur POST commentaire:", err.message);
    res.status(500).json({ error: 'Erreur ajout commentaire' });
  }
});

app.delete('/api/commentaires/:id_commentaire', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM commentaires WHERE id_commentaire = ?', 
      [req.params.id_commentaire]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Commentaire non trouvé' });
    }
    res.json({ message: 'Commentaire supprimé' });
  } catch (err) {
    console.error("Erreur DELETE commentaire:", err.message);
    res.status(500).json({ error: 'Erreur suppression commentaire' });
  }
});

// ─────────────────────────────────────────────────────────────
// Lancement
// ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur démarré sur http://localhost:${PORT}`));