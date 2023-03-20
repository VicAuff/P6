// Importe la bibliothèque Multer pour la gestion des fichiers
const multer = require("multer");
// Crée un objet contenant les types MIME acceptés pour les images
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Crée un objet de stockage pour les fichiers téléchargés
const storage = multer.diskStorage({
  // Spécifie le dossier de destination pour les fichiers téléchargés
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // Génère un nom de fichier unique pour chaque fichier téléchargé
  filename: (req, file, callback) => {
    // Remplace les espaces dans le nom de fichier original par des underscores
    const name = file.originalname.split(" ").join("_");
    // Récupère l'extension de fichier à partir du type MIME
    const extension = MIME_TYPES[file.mimetype];
    // Génère un nom de fichier unique en ajoutant la date actuelle et l'extension de fichier
    callback(null, name + Date.now() + "." + extension);
  },
});

// Exporte un objet Multer configuré avec le système de stockage défini ci-dessus pour traiter les fichiers téléchargés
module.exports = multer({ storage: storage }).single("image");
