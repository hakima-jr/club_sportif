-- 1. Maclumat l-asasiya (Personne)
CREATE TABLE IF NOT EXISTS info_personne (
  id_personne INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100),
  prenom VARCHAR(100),
  age INT,
  adresse VARCHAR(200),
  telephone VARCHAR(20),
  email VARCHAR(100) UNIQUE -- UNIQUE bach may-t-3awedch nefss l-email
);

-- 2. Table dyal l-Connexion (Users) - HADI LI KANET NAQSAK
CREATE TABLE IF NOT EXISTS users (
  id_user INT AUTO_INCREMENT PRIMARY KEY,
  id_personne INT,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'coach', 'membre') DEFAULT 'membre',
  FOREIGN KEY (id_personne) REFERENCES info_personne(id_personne) ON DELETE CASCADE
);

-- 3. Coach (mrtobt b info_personne)
CREATE TABLE IF NOT EXISTS coach (
  id_coach INT PRIMARY KEY, -- Id_coach howa nefss id_personne
  specialite VARCHAR(100),
  FOREIGN KEY (id_coach) REFERENCES info_personne(id_personne) ON DELETE CASCADE
);

-- 4. Membre (mrtobt b info_personne)
CREATE TABLE IF NOT EXISTS Membre (
  id_membre INT PRIMARY KEY, -- Id_membre howa nefss id_personne
  date_inscription DATE,
  type_membre VARCHAR(50),
  FOREIGN KEY (id_membre) REFERENCES info_personne(id_personne) ON DELETE CASCADE
);

-- 5. Sports o Seances
CREATE TABLE IF NOT EXISTS sports (
  id_sport INT AUTO_INCREMENT PRIMARY KEY,
  nom_sport VARCHAR(100),
  categorie VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS seances (
  id_seance INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100),
  date DATE,
  heure VARCHAR(20),
  capacite INT,
  id_sport INT,
  id_coach INT,
  niveau VARCHAR(50),
  FOREIGN KEY (id_sport) REFERENCES sports(id_sport),
  FOREIGN KEY (id_coach) REFERENCES coach(id_coach)
);

-- 6. Abonnements o Paiement
CREATE TABLE IF NOT EXISTS Abonnement (
  id_abonnement INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50),
  date_debut DATE,
  date_fin DATE,
  prix DECIMAL(10,2),
  id_membre INT,
  FOREIGN KEY (id_membre) REFERENCES Membre(id_membre)
);

CREATE TABLE IF NOT EXISTS Paiement (
  id_paiement INT AUTO_INCREMENT PRIMARY KEY,
  montant DECIMAL(10,2),
  date_paiement DATE,
  mode_paiement VARCHAR(50),
  statut VARCHAR(50),
  id_abonnement INT,
  FOREIGN KEY (id_abonnement) REFERENCES Abonnement(id_abonnement)
);
-- Table Utilisateur pour l'authentification
CREATE TABLE IF NOT EXISTS Utilisateur (
  id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'reception', 'coach') NOT NULL DEFAULT 'reception',
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Compte admin par défaut
INSERT INTO Utilisateur (nom, prenom, email, password, role) 
VALUES ('Admin', 'Club', 'admin@club.com', 'admin123', 'admin');

CREATE TABLE IF NOT EXISTS info_personne (
  id_personne INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100),
  prenom VARCHAR(100),
  age INT,
  date_naissance DATE,
  adresse VARCHAR(200),
  telephone VARCHAR(20),
  email VARCHAR(100) UNIQUE
);

CREATE TABLE IF NOT EXISTS Inscription (
  id_inscription INT AUTO_INCREMENT PRIMARY KEY,
  id_membre INT,
  id_seance INT,
  date_inscription DATE,
  statut VARCHAR(50) DEFAULT 'actif',
  FOREIGN KEY (id_membre) REFERENCES Membre(id_membre) ON DELETE CASCADE,
  FOREIGN KEY (id_seance) REFERENCES seances(id_seance) ON DELETE CASCADE
);