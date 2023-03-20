// Importation du framework Express
const express = require("express");
// Création d'un objet Router pour définir des routes HTTP
const router = express.Router();

// Importation du contrôleur user qui contient la logique métier pour les routes de l'API
const userCtrl = require("../controllers/user");
// Importation du middleware emailValidator qui vérifie si l'adresse e-mail fournie est valide
const emailValidator = require("../middleware/email-validator");
// Importation du middleware passwordValidator qui vérifie si le mot de passe fourni est valide
const passwordValidator = require("../middleware/password-validator");

// Définition des routes pour l'inscription et la connexion des utilisateurs en utilisant les middlewares et contrôleurs appropriés
router.post("/signup", emailValidator, passwordValidator, userCtrl.signup);
router.post("/login", userCtrl.login);

// Exportation du module router contenant les routes pour l'API des utilisateurs
module.exports = router;