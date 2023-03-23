// Importe le module Express pour gérer les routes
const express = require("express");
// Crée un router Express
const router = express.Router();
// Importe le middleware d'authentification pour vérifier que l'utilisateur est connecté
const auth = require("../middleware/auth");
// Importe le middleware Multr pour gérer les fichiers envoyés avec les requêtes HTTP
const multer = require("../middleware/multer-config");
// Importe le middleware pictureInput pour valider le champ "sauce"
const pictureInput = require("../middleware/picture-input");
// Importe le controller pour les sauces
const sauceCtrl = require("../controllers/sauce");

// Route GET pour récupérer toutes les sauces
router.get("/", auth, sauceCtrl.getAllSauce);
// Route POST pour créer une nouvelle sauce
router.post("/", auth, multer, pictureInput, sauceCtrl.createSauce);
// Route GET pour récupérer une sauce en particulier en fonction de son ID
router.get("/:id", auth, sauceCtrl.getOneSauce);
// Route PUT pour modifier une sauce existante en fonction de son ID
router.put("/:id", auth, multer, pictureInput, sauceCtrl.modifySauce);
// Route DELETE pour supprimer une sauce existante en fonction de son ID
router.delete("/:id", auth, sauceCtrl.deleteSauce);
// Route POST pour ajouter ou suprimer un like ou un dislike à une sauce existante en fonction de son ID
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce);

// Exporte le router pour qu'il puisse être utilisé par l'application principale
module.exports = router;
