const http = require("http"); // Importation du module "http"
const app = require("./app"); // Importation de l'application "app"

// Fonction pour normaliser le port
const normalizePort = (val) => {
  const port = parseInt(val, 10); // Convertit "val" en nombre entier

  if (isNaN(port)) { // Si "port" n'est pas un nombre, renvoie "val"
    return val;
  }
  if (port >= 0) { // Si "port" est un nombre supérieur ou égal à 0, renvoie ce nombre
    return port;
  }
  return false; // Sinon, renvoie false
};

const port = normalizePort(process.env.PORT || "3000"); // Normalisation du port d'écoute
app.set("port", port); // Affectation du port à l'application

// Fonction pour gérer les erreurs liées au serveur
const errorHandler = (error) => {
  if (error.syscall !== "listen") { // Si l'erreur n'est pas liée à l'écoute
    throw error; // Lève l'erreur
  }

  // Récupère l'adresse du serveur
  const address = server.address();
  // Détermine le type de connexion (pipe ou port) en fonction de l'adresse du serveur
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  switch (error.code) {
    case "EACCES":
      // Affiche un message d'erreur si les privilèges sont insuffisants
      console.error(bind + " requires elevated privileges.");
      process.exit(1); // Arrête le processus
      break;
    case "EADDRINUSE":
      // Affiche un message d'erreur si le port est déjà utilisé
      console.error(bind + " is already in use.");
      process.exit(1); // Arrête le processus
      break;
    default:
      throw error; // Lève l'erreur
  }
};

const server = http.createServer(app); // Création du serveur

server.on("error", errorHandler); // Gestion des erreurs du serveur
server.on("listening", () => { // Message de confirmation lorsque le serveur écoute
  const address = server.address(); // Récupère l'adresse du serveur
  // Détermine le type de connexion (pipe ou port) en fonction de l'adresse du serveur
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind); // Affiche un message de confirmation
});

server.listen(port); // Lance le serveur sur le port spécifié

