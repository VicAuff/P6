// Importation du framework Express
const express = require("express");
// Importation de la bibliothèque Mongoose pour communiquer avec MongoDB
const mongoose = require("mongoose");
// Importation du module path pour gérer les chemins d'accès aux fichiers
const path = require("path");
// Importation du module dotenv pour charger les variables d'environnement depuis le fichier .env
const dotenv = require("dotenv");

// Importation des routes définies pour les utilisateurs
const userRoutes = require("./routes/user");
// Importation des routes définies pour les sauces
const sauceRoutes = require("./routes/sauce");

// Charge les variables d'environnement depuis le fichier .env
dotenv.config();

// Création de l'application Express
const app = express();

// Analyse des requêtes json
app.use(express.json());

// Connexion à MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Connexion à MongoDB réussie !");
  } catch (error) {
    console.log("Connexion à MongoDB échouée.....", error);
  }
}

connectToDatabase();

// Middleware pour gérer les en-têtes CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Utilisation des routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

// Export du module app
module.exports = app;
