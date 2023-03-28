// Importe la bibliothèque jsonwebtoken pour la gestion des tokens JWT
const jwt = require("jsonwebtoken");

// Exporte une fonction middleware qui vérifie le token JWT dans l'en-tête de la requête HTTP
module.exports = (req, res, next) => {
  try {
    // Récupère le token JWT dans l'en-tête Authorization de la requête
    // et le décode en utilisant la fonction verify() de la bibliothèque jsonwebtoken
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    // Récupère l'ID utilisateur à partir du token JWT décodé et l'ajoute à l'objet req.auth
    // pour une utilisation ultérieure
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    // Passe la main au middleware suivant
    next();
  } catch (error) {
    // Si une erreur se produit pendant la vérification du token JWT, envoie une réponse
    // avec un code d'erreur 401 (Unauthorized) et un message d'erreur
    res.status(401).json({ error });
  }
};