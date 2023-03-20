// Exporte une fonction middleware qui prend en paramètres req, res et next
module.exports = (req, res, next) => {
  // Récupération de l'objet sauce à partir du corps de la requête
  const sauce = req.body.sauce ? JSON.parse(req.body.sauce) : req.body;
  // Extraction des propriétés de l'objet sauce
  const { name, manufacturer, description, mainPepper } = sauce;
  // Création d'un tableau avec les propriétés à vérifier
  const stringsToCheck = [name, manufacturer, description, mainPepper];

  // Suppression des espaces inutiles et vérification de la longueur minimale
  const isValid = stringsToCheck.every((str) => str.trim().length >= 2);

  // Si toutes les propriétés ont au moins 2 caractères, appelle la fonction next() pour passer au middleware suivant
  if (isValid) {
    next();
  } else {
    // Sinon, lance une erreur avec le message "Minimum 2 caractères"
    throw new Error("Minimum 2 caractères");
  }
};
