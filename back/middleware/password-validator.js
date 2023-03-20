// Importe le module de validation de mot de passe
const passwordValidator = require("password-validator");

// Création d'un schéma pour le mot de passe
const passwordSchema = new passwordValidator();

// Définit les règles de validation du mot de passe
passwordSchema
  .is()
  .min(8) // Le mot de passe doit contenir au moins 8 caractères
  .is()
  .max(70) // Le mot de passe ne doit pas dépasser 70 caractères
  .has()
  .uppercase(1) // Le mot de passe doit contenir au moins une lettre majuscule
  .has()
  .lowercase() // Le mot de passe doit contenir au moins une lettre minuscule
  .has()
  .digits(1) // Le mot de passe doit contenir au moins un chiffre
  .has()
  .not()
  .spaces(); // Le mot de passe ne doit pas contenir d'espaces

// Middleware pour la validation du mot de passe
module.exports = (req, res, next) => {
  // Si le mot de passe ne correspond pas au schéma de validation
  if (!passwordSchema.validate(req.body.password)) {
    // Retourne un message d'erreur avec un code d'état 400 Bad Request
    res.status(400).json({
      message:
        "Le mot de passe doit contenir entre 8 et 15 caractères, au moins une lettre majuscule et une lettre minuscule, ainsi qu'un chiffre",
    });
  } else {
    // Si le mot de passe est valide, continue le traitement de la requête
    next();
  }
};
