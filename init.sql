-- =====================================================
-- BASE DE DONNÉES CLUB SPORTIF - COMPLÈTE ET CORRIGÉE
-- =====================================================

-- 1. Créer la base de données (si elle n'existe pas)
CREATE DATABASE IF NOT EXISTS club_sportif;
USE club_sportif;

-- =====================================================
-- TABLE info_personne (contient toutes les infos perso)
-- =====================================================
CREATE TABLE IF NOT EXISTS info_personne (
    id_personne INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    date_naissance DATE,
    age INT,
    adresse VARCHAR(200),
    telephone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    sexe ENUM('Homme', 'Femme'),
    poids DECIMAL(5,2),
    taille INT,
    objectif VARCHAR(100),
    notes TEXT
);

-- =====================================================
-- TABLE Membre (hérite de info_personne)
-- =====================================================
CREATE TABLE IF NOT EXISTS Membre (
    id_membre INT PRIMARY KEY,
    date_inscription DATE,
    type_membre ENUM('Standard', 'Premium', 'VIP') DEFAULT 'Standard',
    FOREIGN KEY (id_membre) REFERENCES info_personne(id_personne) ON DELETE CASCADE
);

-- =====================================================
-- TABLE Coach (hérite de info_personne)
-- =====================================================
CREATE TABLE IF NOT EXISTS Coach (
    id_coach INT PRIMARY KEY,
    specialite VARCHAR(100),
    FOREIGN KEY (id_coach) REFERENCES info_personne(id_personne) ON DELETE CASCADE
);

-- =====================================================
-- TABLE Utilisateur (comptes pour login)
-- =====================================================
CREATE TABLE IF NOT EXISTS Utilisateur (
    id_utilisateur INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'coach', 'membre') DEFAULT 'membre',
    telephone VARCHAR(20),
    actif BOOLEAN DEFAULT TRUE,
    id_membre INT,
    id_coach INT,
    FOREIGN KEY (id_membre) REFERENCES Membre(id_membre) ON DELETE SET NULL,
    FOREIGN KEY (id_coach) REFERENCES Coach(id_coach) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE Sports
-- =====================================================
CREATE TABLE IF NOT EXISTS Sports (
    id_sport INT PRIMARY KEY AUTO_INCREMENT,
    nom_sport VARCHAR(100) NOT NULL,
    description TEXT,
    categorie VARCHAR(50)
);

-- =====================================================
-- TABLE Séances
-- =====================================================
CREATE TABLE IF NOT EXISTS Seances (
    id_seance INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    heure TIME NOT NULL,
    capacite INT NOT NULL,
    niveau VARCHAR(50),
    id_sport INT NOT NULL,
    id_coach INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sport) REFERENCES Sports(id_sport) ON DELETE CASCADE,
    FOREIGN KEY (id_coach) REFERENCES Coach(id_coach) ON DELETE CASCADE
);

-- =====================================================
-- TABLE Abonnement
-- =====================================================
CREATE TABLE IF NOT EXISTS Abonnement (
    id_abonnement INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(50) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    id_membre INT NOT NULL,
    statut ENUM('actif', 'expiré', 'suspendu') DEFAULT 'actif',
    FOREIGN KEY (id_membre) REFERENCES Membre(id_membre) ON DELETE CASCADE
);

-- =====================================================
-- TABLE Paiement
-- =====================================================
CREATE TABLE IF NOT EXISTS Paiement (
    id_paiement INT PRIMARY KEY AUTO_INCREMENT,
    montant DECIMAL(10,2) NOT NULL,
    date_paiement DATE NOT NULL,
    mode_paiement ENUM('Espèces', 'Carte bancaire', 'Virement', 'Chèque') NOT NULL,
    statut ENUM('Payé', 'En attente', 'Annulé') DEFAULT 'En attente',
    id_abonnement INT NOT NULL,
    reference VARCHAR(100),
    FOREIGN KEY (id_abonnement) REFERENCES Abonnement(id_abonnement) ON DELETE CASCADE
);

-- =====================================================
-- TABLE Inscription (pour la présence aux séances)
-- =====================================================
CREATE TABLE IF NOT EXISTS Inscription (
    id_inscription INT PRIMARY KEY AUTO_INCREMENT,
    date_inscription DATE NOT NULL,
    statut ENUM('Présent', 'Absent', 'Retard') DEFAULT 'Présent',
    id_membre INT NOT NULL,
    id_seance INT NOT NULL,
    FOREIGN KEY (id_membre) REFERENCES Membre(id_membre) ON DELETE CASCADE,
    FOREIGN KEY (id_seance) REFERENCES Seances(id_seance) ON DELETE CASCADE,
    UNIQUE KEY unique_inscription (id_membre, id_seance)
);

-- =====================================================
-- TABLE Présences (alternative simple)
-- =====================================================
CREATE TABLE IF NOT EXISTS Presences (
    id_presence INT PRIMARY KEY AUTO_INCREMENT,
    date_presence DATE NOT NULL,
    statut ENUM('Présent', 'Absent') DEFAULT 'Présent',
    id_membre INT NOT NULL,
    id_seance INT NOT NULL,
    FOREIGN KEY (id_membre) REFERENCES Membre(id_membre) ON DELETE CASCADE,
    FOREIGN KEY (id_seance) REFERENCES Seances(id_seance) ON DELETE CASCADE
);

-- =====================================================
-- INDEX pour améliorer les performances
-- =====================================================
CREATE INDEX idx_membre_email ON info_personne(email);
CREATE INDEX idx_seance_date ON Seances(date);
CREATE INDEX idx_abonnement_membre ON Abonnement(id_membre);
CREATE INDEX idx_paiement_abonnement ON Paiement(id_abonnement);
CREATE INDEX idx_inscription_seance ON Inscription(id_seance);
CREATE INDEX idx_inscription_membre ON Inscription(id_membre);

-- =====================================================
-- INSERER DES DONNÉES DE TEST
-- =====================================================

-- Sports
INSERT INTO Sports (nom_sport, description, categorie) VALUES
('Musculation', 'Entraînement avec poids et machines', 'Force'),
('Cardio', 'Course, vélo, elliptique', 'Cardio'),
('Natation', 'Piscine et cours de natation', 'Aquatique'),
('Yoga', 'Séances de relaxation et étirement', 'Bien-être'),
('CrossFit', 'Entraînement intensif', 'Fonctionnel'),
('Boxe', 'Boxe anglaise et française', 'Combat');

-- Membres (info_personne)
INSERT INTO info_personne (nom, prenom, date_naissance, email, telephone, adresse, sexe, poids, taille, objectif, notes) VALUES
('jarmim', 'hakima', '1990-03-12', 'hikmatjarmim27@gmail.com', '0632814467', 'Tétouan', 'Femme', 58.5, 165, 'Maintien', 'Membre régulière'),
('rassi', 'ali', '1985-04-05', 'ali@gmail.com', '0622222222', 'Tanger', 'Homme', 75.0, 178, 'Prise de masse', NULL),
('Ben sbih', 'sara', '1995-03-05', 'sara@gmail.com', '0714569256', 'Tétouan', 'Femme', 55.0, 160, 'Perte de poids', 'Objectif -5kg'),
('alami', 'yassine', '2000-01-15', 'yassine@email.com', '0612745270', 'Casablanca', 'Homme', 70.0, 175, 'Performance', NULL),
('benani', 'fatima', '1988-07-22', 'fatima@email.com', '0698765432', 'Rabat', 'Femme', 62.0, 168, 'Maintien', NULL);

-- Insérer dans la table Membre
INSERT INTO Membre (id_membre, date_inscription, type_membre) VALUES
(1, '2025-01-10', 'Premium'),
(2, '2025-02-15', 'Standard'),
(3, '2025-03-20', 'VIP'),
(4, '2025-04-01', 'Standard'),
(5, '2025-05-05', 'Premium');

-- Coachs (info_personne d'abord)
INSERT INTO info_personne (nom, prenom, date_naissance, email, telephone, adresse, sexe) VALUES
('benjelloun', 'karim', '1980-03-15', 'karim@coach.com', '0600000001', 'Tétouan', 'Homme'),
('el fassi', 'nadia', '1985-07-20', 'nadia@coach.com', '0600000002', 'Tanger', 'Femme');

-- Insérer dans la table Coach
INSERT INTO Coach (id_coach, specialite) VALUES
(6, 'Musculation et Cardio'),
(7, 'Yoga et CrossFit');

-- Utilisateurs (comptes pour login)
-- Mot de passe par défaut: "password123" (en clair, à hasher plus tard)
INSERT INTO Utilisateur (nom, prenom, email, password, role, telephone, id_membre, id_coach) VALUES
('Admin', 'Système', 'admin@club.com', 'admin123', 'admin', '0600000000', NULL, NULL),
('benjelloun', 'karim', 'karim@coach.com', 'coach123', 'coach', '0600000001', NULL, 6),
('jarmim', 'hakima', 'hikmatjarmim27@gmail.com', 'membre123', 'membre', '0632814467', 1, NULL);

-- Séances
INSERT INTO Seances (date, heure, capacite, niveau, id_sport, id_coach) VALUES
('2026-05-16', '09:00:00', 20, 'Débutant', 1, 6),
('2026-05-16', '11:00:00', 15, 'Intermédiaire', 5, 7),
('2026-05-17', '10:00:00', 25, 'Débutant', 4, 7),
('2026-05-17', '14:00:00', 20, 'Avancé', 6, 6),
('2026-05-18', '16:00:00', 30, 'Intermédiaire', 2, 6);

-- Abonnements
INSERT INTO Abonnement (type, date_debut, date_fin, prix, id_membre, statut) VALUES
('Premium', '2026-01-01', '2026-12-31', 5000.00, 1, 'actif'),
('Standard', '2026-02-01', '2026-07-31', 2000.00, 2, 'actif'),
('VIP', '2026-01-15', '2027-01-14', 8000.00, 3, 'actif'),
('Standard', '2026-04-01', '2026-09-30', 2000.00, 4, 'actif'),
('Premium', '2026-05-01', '2026-10-31', 2500.00, 5, 'actif');

-- Paiements
INSERT INTO Paiement (montant, date_paiement, mode_paiement, statut, id_abonnement) VALUES
(5000.00, '2026-01-01', 'Carte bancaire', 'Payé', 1),
(2000.00, '2026-02-01', 'Espèces', 'Payé', 2),
(8000.00, '2026-01-15', 'Virement', 'Payé', 3),
(2000.00, '2026-04-01', 'Carte bancaire', 'Payé', 4),
(2500.00, '2026-05-01', 'Espèces', 'En attente', 5),
(1000.00, '2026-05-10', 'Carte bancaire', 'Payé', 2);

-- Inscriptions (présence)
INSERT INTO Inscription (date_inscription, statut, id_membre, id_seance) VALUES
('2026-05-16', 'Présent', 1, 1),
('2026-05-16', 'Présent', 2, 1),
('2026-05-16', 'Absent', 3, 1),
('2026-05-16', 'Présent', 1, 2),
('2026-05-17', 'Présent', 2, 3),
('2026-05-17', 'Retard', 4, 4);

-- =====================================================
-- VUES UTILES (pour les rapports)
-- =====================================================

-- Vue: Membres avec leurs abonnements
CREATE OR REPLACE VIEW vue_membres_abonnements AS
SELECT 
    ip.id_personne,
    ip.nom,
    ip.prenom,
    ip.email,
    ip.telephone,
    ip.sexe,
    m.date_inscription,
    m.type_membre,
    a.type AS type_abonnement,
    a.date_debut,
    a.date_fin,
    a.prix,
    CASE WHEN a.date_fin >= CURDATE() THEN 'Actif' ELSE 'Expiré' END AS statut_abonnement
FROM info_personne ip
JOIN Membre m ON ip.id_personne = m.id_membre
LEFT JOIN Abonnement a ON m.id_membre = a.id_membre
ORDER BY ip.id_personne;

-- Vue: Statistiques des séances
CREATE OR REPLACE VIEW vue_statistiques_seances AS
SELECT 
    s.id_seance,
    s.date,
    s.heure,
    sp.nom_sport,
    CONCAT(ip.nom, ' ', ip.prenom) AS nom_coach,
    s.capacite,
    COUNT(i.id_inscription) AS inscriptions,
    SUM(CASE WHEN i.statut = 'Présent' THEN 1 ELSE 0 END) AS presents,
    ROUND((SUM(CASE WHEN i.statut = 'Présent' THEN 1 ELSE 0 END) / NULLIF(COUNT(i.id_inscription), 0)) * 100, 2) AS taux_presence
FROM Seances s
JOIN Sports sp ON s.id_sport = sp.id_sport
JOIN Coach c ON s.id_coach = c.id_coach
JOIN info_personne ip ON c.id_coach = ip.id_personne
LEFT JOIN Inscription i ON s.id_seance = i.id_seance
GROUP BY s.id_seance;

-- =====================================================
-- PROCÉDURES STOCKÉES
-- =====================================================

-- Procédure: Ajouter un membre avec ses infos
DELIMITER //
CREATE PROCEDURE ajouter_membre(
    IN p_nom VARCHAR(100),
    IN p_prenom VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_telephone VARCHAR(20),
    IN p_adresse VARCHAR(200),
    IN p_sexe VARCHAR(10),
    IN p_date_naissance DATE,
    IN p_date_inscription DATE,
    IN p_type_membre VARCHAR(20)
)
BEGIN
    DECLARE v_id_personne INT;

    -- Insert dans info_personne
    INSERT INTO info_personne (nom, prenom, email, telephone, adresse, sexe, date_naissance)
    VALUES (p_nom, p_prenom, p_email, p_telephone, p_adresse, p_sexe, p_date_naissance);

    SET v_id_personne = LAST_INSERT_ID();

    -- Insert dans Membre
    INSERT INTO Membre (id_membre, date_inscription, type_membre)
    VALUES (v_id_personne, p_date_inscription, p_type_membre);

    SELECT v_id_personne AS id_membre;
END//
DELIMITER ;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Mettre à jour l'âge automatiquement
DELIMITER //
CREATE TRIGGER calculer_age
BEFORE INSERT ON info_personne
FOR EACH ROW
BEGIN
    IF NEW.date_naissance IS NOT NULL THEN
        SET NEW.age = YEAR(CURDATE()) - YEAR(NEW.date_naissance);
    END IF;
END//
DELIMITER ;

-- =====================================================
-- VÉRIFICATIONS FINALES
-- =====================================================

-- Afficher toutes les tables
SHOW TABLES;

-- Vérifier les membres
SELECT * FROM vue_membres_abonnements;

-- Vérifier les séances
SELECT * FROM vue_statistiques_seances;

-- Vérifier les utilisateurs
SELECT id_utilisateur, nom, prenom, email, role, id_coach, id_membre FROM Utilisateur;




ALTER TABLE Seances 
  ADD COLUMN nom VARCHAR(150) AFTER id_seance,
  ADD COLUMN public_cible ENUM('Mixte','Femmes','Hommes','Enfants') DEFAULT 'Mixte' AFTER niveau;

-- optionnel: sammi les séances existantes bach matbanch "—"
UPDATE Seances SET nom = CONCAT('Séance ', id_seance) WHERE nom IS NULL;