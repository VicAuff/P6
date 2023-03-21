// Importe le modèle Sauce depuis le fichier "../models/sauce"
const Sauce = require("../models/sauce");
// Importe la bibliothèque "fs" (File System) de Node.js pour la gestion des fichiers
const fs = require("fs");

// Crée une nouvelle sauce
exports.createSauce = (req, res, next) => {
  // Extrait l'objet sauce du corps de la requête et supprime les champs _id et _userId
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  // Sauvegarde la sauce et envoie une réponse
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Récupère une sauce spécifique
exports.getOneSauce = (req, res, next) => {
  // Recherche la sauce dans la base de données en utilisant l'ID de la sauce
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// Modifie une sauce existante
exports.modifySauce = async (req, res, next) => {
  try {
    const sauce = await Sauce.findById(req.params.id);

    if (!sauce) {
      return res.status(404).json({ message: "Sauce introuvable" });
    }

    if (sauce.userId !== req.auth.userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const sauceObject = req.file
      ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };

    if (req.file) {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, (err) => {
        if (err)
          console.log("Échec de la suppression de l'ancienne image :", err);
      });
    }

    const updatedSauce = await Sauce.findByIdAndUpdate(
      req.params.id,
      sauceObject,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ message: "Sauce modifiée", sauce: updatedSauce });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Supprime une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Récupère toutes les sauces
exports.getAllSauce = (req, res, next) => {
  // Recherche toutes les sauces dans la base de données
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Gère les likes et les dislikes d'une sauce
exports.likeDislikeSauce = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    const { id: sauceId } = req.params;
    const { like } = req.body;

    let update, message;

    if (like === 1) {
      update = { $addToSet: { usersLiked: userId }, $inc: { likes: 1 } };
      message = "Like";
    } else if (like === -1) {
      update = { $addToSet: { usersDisliked: userId }, $inc: { dislikes: 1 } };
      message = "Dislike";
    } else {
      update = {
        $pull: { usersLiked: userId, usersDisliked: userId },
        $inc: { likes: 0, dislikes: 0 },
      };
      message = "Nothing";
    }

    const sauce = await Sauce.findOneAndUpdate({ _id: sauceId }, update, {
      new: true,
    });

    if (!sauce) {
      return res.status(404).json({ error: "Sauce non trouvée" });
    }

    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Gère les likes et les dislikes d'une sauce
module.exports = {
  createSauce: exports.createSauce,
  getOneSauce: exports.getOneSauce,
  modifySauce: exports.modifySauce,
  deleteSauce: exports.deleteSauce,
  getAllSauce: exports.getAllSauce,
  likeDislikeSauce: exports.likeDislikeSauce,
};
