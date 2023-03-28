// Importe la bibliothèque email-validator pour la validation des adresses e-mail
const emailValidator = require("email-validator");

// Exporte une fonction middleware qui valide l'adresse e-mail dans la requête HTTP
module.exports = (req, res, next) => {
  // Vérifie si l'adresse e-mail dans la requête est valide en utilisant la fonction validate()
  // de la bibliothèque email-validator
  if (!emailValidator.validate(req.body.email)) {
    // Si l'adresse e-mail n'est pas valide, 
    // envoie une réponse avec un code d'erreur 400 (Bad Request) et un message d'erreur
    res
      .status(400)
      .json({ message: "Veuillez entrer une adresse e-mail correcte" });
  } else {
    // Si l'adresse e-mail est valide, passe la main au middleware suivant
    next();
  }
};
