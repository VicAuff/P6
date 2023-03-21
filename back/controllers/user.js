// Importe le module bcrypt pour le hachage de mots de passe
const bcrypt = require("bcrypt");
// Importe le module jsonwebtoken pour la gestion des tokens
const jwt = require("jsonwebtoken");
// Importe le modèle User pour la gestion des utilisateurs dans la base de données
const User = require("../models/user");

// Contrôleur pour la création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  // Hache le mot de passe de l'utilisateur avant de le sauvegarder dans la base de données
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Crée un nouvel utilisateur avec l'adresse email et le mot de passe haché
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      // Sauvegarde l'utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Contrôleur pour la connexion d'un utilisateur existant
exports.login = (req, res, next) => {
  // Recherche l'utilisateur correspondant à l'adresse email fournie
  User.findOne({ email: req.body.email })
    .then((user) => {
      // Si aucun utilisateur ne correspond à l'adresse email fournie, renvoie une erreur 401
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      // Si l'utilisateur existe, compare le mot de passe fourni avec le mot de passe haché stocké dans la base de données
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // Si les mots de passe ne correspondent pas, renvoie une erreur 401
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          // Si les mots de passe correspondent, génère un token d'authentification avec jsonwebtoken et renvoie l'ID de l'utilisateur et le token dans la réponse
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error: error.message }));
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};
