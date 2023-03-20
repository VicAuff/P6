// Importe le module mongoose
const mongoose = require("mongoose");

// Création du schéma pour les utilisateurs
const userSchema = mongoose.Schema({
  // L'adresse email doit être unique et indexée pour faciliter les recherches
  email: { type: String, required: true, unique: true, index: true },
  // Le mot de passe est également requis
  password: { type: String, required: true },
});

// Export du module en tant que modèle Mongoose
module.exports = mongoose.model("User", userSchema);
