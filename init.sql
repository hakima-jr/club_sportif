CREATE TABLE IF NOT EXISTS sports (
  id_sport INT AUTO_INCREMENT PRIMARY KEY,
  nom_sport VARCHAR(100),
  categorie VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS coach (
  id_coach INT AUTO_INCREMENT PRIMARY KEY,
  specialite VARCHAR(100)
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

-- Données de test
INSERT INTO sports (nom_sport, categorie) VALUES ('Yoga', 'Individuel');
INSERT INTO sports (nom_sport, categorie) VALUES ('Fitness', 'Collectif');
INSERT INTO sports (nom_sport, categorie) VALUES ('Musculation', 'Individuel');

INSERT INTO coach (specialite) VALUES ('Yoga');
INSERT INTO coach (specialite) VALUES ('Fitness');

CREATE TABLE IF NOT EXISTS paiement (
  id_paiement INT AUTO_INCREMENT PRIMARY KEY,
  montant DECIMAL(10,2),
  date_paiement DATE,
  mode_paiement VARCHAR(50),
  statut VARCHAR(50),
  id_abonnement INT
);