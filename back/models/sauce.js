// Importe le module mongoose
const mongoose = require("mongoose");

// Création d'un sous-schéma pour les likes et les dislikes
const likesSchema = mongoose.Schema({
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String], default: [] },
  usersDisliked: { type: [String], default: [] },
});

// Création du schéma principal pour les sauces
const sauceSchema = mongoose.Schema({
  // Chaque sauce est associée à un utilisateur
  userId: { type: String, required: true },
  // Les informations de base sur la sauce
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  // Incorporation du sous-schéma pour les likes et dislikes
  likesInfo: { type: likesSchema, default: () => ({}) },
});

// Export du module en tant que modèle Mongoose
module.exports = mongoose.model("Sauce", sauceSchema);