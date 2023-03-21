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

/*// Importe le module mongoose
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
module.exports = mongoose.model("Sauce", sauceSchema);*/
