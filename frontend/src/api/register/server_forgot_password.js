// ─────────────────────────────────────────────────────────────
// زيد هاد الكود فـ server.js ديالك بعد route /api/register
// ─────────────────────────────────────────────────────────────
// 1. زيد فأعلى server.js:
//    const nodemailer = require('nodemailer');
//    const crypto = require('crypto');
// 2. زيد فـ .env:
//    EMAIL_USER=clubsportif.noreply@gmail.com
//    EMAIL_PASS=your_gmail_app_password
// ─────────────────────────────────────────────────────────────

const nodemailer = require('nodemailer');
const crypto     = require('crypto');

// Transporter Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,  // App Password ديال Gmail (مو password عادي)
  },
});

// Table temporaire للـ reset tokens (فـ memory — أو زيدها فـ DB)
const resetTokens = new Map(); // { token: { email, expires } }

// ── POST /api/forgot-password ──
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email requis' });

  try {
    // تحقق بلي الـ email موجود
    const [users] = await db.query(
      'SELECT id_utilisateur, nom, prenom FROM Utilisateur WHERE email = ? AND actif = true',
      [email]
    );

    // دايماً نرجعو success حتى ما نكشفوش إذا الـ email موجود أو لا
    if (users.length === 0) {
      return res.json({ success: true, message: 'Si cet email existe, un lien a été envoyé.' });
    }

    const user  = users[0];
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 15 * 60 * 1000; // 15 دقيقة

    // خزن الـ token
    resetTokens.set(token, { email, expires });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // بعث الـ email
    await transporter.sendMail({
      from:    `"Club Sportif" <${process.env.EMAIL_USER}>`,
      to:      email,
      subject: '🔑 Réinitialisation de votre mot de passe',
      html: `
        <div style="font-family:Segoe UI,sans-serif;max-width:480px;margin:0 auto;background:#f8fafc;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#13485f,#243d4a);padding:32px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;">🏋️ Club Sportif</h1>
          </div>
          <div style="padding:32px;">
            <h2 style="color:#1e293b;margin:0 0 12px;">Bonjour ${user.prenom} ${user.nom},</h2>
            <p style="color:#64748b;line-height:1.6;">Vous avez demandé la réinitialisation de votre mot de passe.</p>
            <p style="color:#64748b;line-height:1.6;">Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            <div style="text-align:center;margin:28px 0;">
              <a href="${resetLink}" style="background:#13485f;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            <p style="color:#94a3b8;font-size:12px;">Ce lien expire dans <strong>15 minutes</strong>.</p>
            <p style="color:#94a3b8;font-size:12px;">Si vous n'avez pas fait cette demande, ignorez cet email.</p>
          </div>
          <div style="background:#f1f5f9;padding:16px;text-align:center;">
            <p style="color:#94a3b8;font-size:11px;margin:0;">© 2025 Club Sportif — Ne pas répondre à cet email</p>
          </div>
        </div>
      `,
    });

    console.log(`✅ Reset email envoyé à: ${email}`);
    res.json({ success: true, message: 'Si cet email existe, un lien a été envoyé.' });

  } catch (err) {
    console.error('Erreur forgot-password:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ── POST /api/reset-password ──
app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ message: 'Token et nouveau mot de passe requis' });

  const data = resetTokens.get(token);

  if (!data) return res.status(400).json({ message: 'Lien invalide ou déjà utilisé' });
  if (Date.now() > data.expires) {
    resetTokens.delete(token);
    return res.status(400).json({ message: 'Lien expiré. Veuillez refaire la demande.' });
  }

  try {
    await db.query(
      'UPDATE Utilisateur SET password = ? WHERE email = ?',
      [newPassword, data.email]
    );
    resetTokens.delete(token); // حذف الـ token بعد الاستعمال
    console.log(`✅ Password reset pour: ${data.email}`);
    res.json({ success: true, message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    console.error('Erreur reset-password:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});