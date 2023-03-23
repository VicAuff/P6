// Importe le modèle Sauce depuis le fichier "../models/sauce"
const Sauce = require("../models/sauce");
// Importe la bibliothèque "fs" (File System) de Node.js pour la gestion des fichiers
const fs = require("fs");

// Fonction pour créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
  // Extrait l'objet sauce du corps de la requête et supprime les champs _id et _userId
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;

  // Crée une nouvelle instance de Sauce avec les données extraites de la requête
  const sauce = new Sauce({
    ...sauceObject,
    // Attribue le userId à partir des données d'authentification de la requête
    userId: req.auth.userId,
    // Construit l'URL de l'image en utilisant le protocole, l'hôte et le nom du fichier de la requête
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  // Sauvegarde la sauce dans la base de données et envoie une réponse
  sauce
    .save()
    .then(() => {
      // Envoie une réponse de succès avec un statut 201 et un message
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      // En cas d'erreur, envoie une réponse avec un statut 400 et l'erreur
      res.status(400).json({ error });
    });
};

// Exporte un contrôleur pour récupérer une sauce spécifique
exports.getOneSauce = (req, res, next) => {
  // Recherche la sauce dans la base de données en utilisant l'ID de la sauce (paramètre de la requête)
  Sauce.findOne({
    _id: req.params.id,
  })
    // Si la sauce est trouvée, envoie la sauce au format JSON avec un statut 200 (succès)
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    // Si une erreur se produit lors de la recherche, envoie un message d'erreur au format JSON avec un statut 404 (non trouvé)
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// Exporte une fonction asynchrone pour modifier une sauce existante
exports.modifySauce = async (req, res, next) => {
  try {
    // Recherche la sauce correspondante dans la base de données en utilisant l'ID dans les paramètres de la requête
    const sauce = await Sauce.findById(req.params.id);
    // Si la sauce n'est pas trouvée, retourne une erreur 404 avec un message d'erreur
    if (!sauce) {
      return res.status(404).json({ message: "Sauce introuvable" });
    }
    // Vérifie si l'utilisateur qui fait la requête est le propriétaire de la sauce, sinon retourne une erreur 401 avec un message d'erreur
    if (sauce.userId !== req.auth.userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    // Crée un nouvel objet sauce à partir des données de la requête, en incluant l'image si elle est présente
    const sauceObject = req.file
      ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };
    // Si une nouvelle image est ajoutée, supprime l'ancienne image du serveur
    if (req.file) {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, (err) => {
        if (err)
          console.log("Échec de la suppression de l'ancienne image :", err);
      });
    }

    // Met à jour la sauce dans la base de données avec les nouvelles informations
    const updatedSauce = await Sauce.findByIdAndUpdate(
      req.params.id,
      sauceObject,
      {
        new: true,
        runValidators: true,
      }
    );
    // Envoie une réponse avec un statut 200 et un message indiquant que la sauce a été modifiée, ainsi que la sauce mise à jour
    res.status(200).json({ message: "Sauce modifiée", sauce: updatedSauce });
  } catch (error) {
    // Si une erreur se produit, envoie une réponse avec un statut 400 et l'erreur
    res.status(400).json({ error });
  }
};

// Définit une fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  // Recherche la sauce dans la base de données en utilisant l'ID des paramètres de requête
  Sauce.findOne({ _id: req.params.id })
    // Gère le succès de la recherche
    .then((sauce) => {
      // Vérifie si l'utilisateur qui effectue la requête est le propriétaire de la sauce
      if (sauce.userId != req.auth.userId) {
        // Envoie une réponse avec un statut 401 (non autorisé) et un message d'erreur
        res.status(401).json({ message: "Not authorized" });
      } else {
        // Extrait le nom du fichier image de l'URL de l'image de la sauce
        const filename = sauce.imageUrl.split("/images/")[1];
        // Supprime l'image du fichier système en utilisant le nom de fichier extrait
        fs.unlink(`images/${filename}`, () => {
          // Supprime la sauce de la base de données en utilisant l'ID des paramètres de requête
          Sauce.deleteOne({ _id: req.params.id })
            // Gère le succès de la suppression
            .then(() => {
              // Envoie une réponse avec un statut 200 (succès) et un message de confirmation
              res.status(200).json({ message: "Supprimé !" });
            })
            // Gère les erreurs de suppression
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    // Gère les erreurs de recherche
    .catch((error) => {
      // Envoie une réponse avec un statut 500 (erreur interne du serveur) et les détails de l'erreur
      res.status(500).json({ error });
    });
};

// Définit une fonction pour récupérer toutes les sauces
exports.getAllSauce = (req, res, next) => {
  // Recherche toutes les sauces dans la base de données
  Sauce.find()
    // Gère le succès de la recherche
    .then((sauces) => {
      // Envoie une réponse avec un statut 200 (succès) et les données des sauces récupérées
      res.status(200).json(sauces);
    })
    // Gère les erreurs de recherche
    .catch((error) => {
      // Envoie une réponse avec un statut 400 (mauvaise requête) et les détails de l'erreur
      res.status(400).json({
        error: error,
      });
    });
};

exports.likeDislikeSauce = async (req, res, next) => {
  try {
    const { userId } = req.auth; // Récupère l'ID de l'utilisateur à partir de la requête authentifiée
    const { id: sauceId } = req.params; // Récupère l'ID de la sauce à partir des paramètres de la requête
    const { like } = req.body; // Récupère la valeur "like" de la requête POST

    let update, message;

    // Récupérer la sauce pour connaître l'état actuel des likes et dislikes
    const sauce = await Sauce.findOne({ _id: sauceId });

    if (like === 1) {
      if (sauce.usersDisliked.includes(userId)) {
        update = {
          // Définit les opérations MongoDB pour mettre à jour la sauce
          $pull: { usersDisliked: userId },
          $addToSet: { usersLiked: userId },
          $inc: { dislikes: -1, likes: 1 },
        };
        message = "Dislike annulé et remplacé par un like";
      } else {
        // Définit les opérations MongoDB pour ajouter un like à la sauce
        update = { $addToSet: { usersLiked: userId }, $inc: { likes: 1 } };
        message = "Like ajouté";
      }
    } else if (like === -1) {
      // Vérifie si l'utilisateur a disliké la sauce
      if (sauce.usersLiked.includes(userId)) {
        // Vérifie si l'utilisateur a précédemment liké la sauce
        update = {
          // Définit les opérations MongoDB pour mettre à jour la sauce
          $pull: { usersLiked: userId },
          $addToSet: { usersDisliked: userId },
          $inc: { likes: -1, dislikes: 1 },
        };
        message = "Like annulé et remplacé par un dislike";
      } else {
        update = {
          $addToSet: { usersDisliked: userId },
          $inc: { dislikes: 1 },
        };
        message = "Dislike ajouté";
      }
    } else {
      // Si la valeur n'est pas 1 ou -1, cela signifie que l'utilisateur souhaite annuler son like ou dislike précédent
      const liked = sauce.usersLiked.includes(userId);
      const disliked = sauce.usersDisliked.includes(userId);

      // Si l'utilisateur avait précédemment like/dislike la sauce, décrémente le compteur de likes/dislike
      const changeLikes = liked ? -1 : 0;
      const changeDislikes = disliked ? -1 : 0;

      update = {
        // Définit les opérations MongoDB pour mettre à jour la sauce
        $pull: { usersLiked: userId, usersDisliked: userId },
        $inc: { likes: changeLikes, dislikes: changeDislikes },
      };
      message = "Like ou dislike annulé";
    }

    const updatedSauce = await Sauce.findOneAndUpdate(
      { _id: sauceId },
      update,
      {
        new: true,
      }
    ); // Met à jour la sauce dans la base de données avec les opérations MongoDB définies

    if (!updatedSauce) {
      // Vérifie si la sauce a bien été mise à jour
      return res.status(404).json({ error: "Sauce non trouvée" });
    }

    res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
