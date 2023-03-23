// Importe la bibliothèque Mongoose pour la gestion des données avec MongoDB
const mongoose = require("mongoose");

// Crée un schéma Mongoose pour les objets Sauce
const sauceShema = mongoose.Schema({
  // Champ userId, de type String, requis pour chaque Sauce
  userId: { type: String, required: true },
  // Champ name, de type String, requis pour chaque Sauce
  name: { type: String, required: true },
  // Champ manufacturer, de type String, requis pour chaque Sauce
  manufacturer: { type: String, required: true },
  // Champ description, de type String, requis pour chaque Sauce
  description: { type: String, required: true },
  // Champ mainPepper, de type String, requis pour chaque Sauce
  mainPepper: { type: String, required: true },
  // Champ imageUrl, de type String, requis pour chaque Sauce
  imageUrl: { type: String, required: true },
  // Champ heat, de type Number, requis pour chaque Sauce
  heat: { type: Number, required: true },
  // Champ likes, de type Number, avec une valeur par défaut de 0
  likes: { type: Number, default: 0 },
  // Champ dislikes, de type Number, avec une valeur par défaut de 0
  dislikes: { type: Number, default: 0 },
  // Champ usersLiked, un tableau de Strings, avec une valeur par défaut de tableau vide
  usersLiked: { type: [String], default: [] },
  // Champ usersDisliked, un tableau de Strings, avec une valeur par défaut de tableau vide
  usersDisliked: { type: [String], default: [] },
});

// Exporte le modèle Mongoose "Sauce" basé sur le schéma défini précédemment
module.exports = mongoose.model("Sauce", sauceShema);