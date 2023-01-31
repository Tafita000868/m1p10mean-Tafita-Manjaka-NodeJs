
const config = require("../../config/auth.config");

const Utilisateur = require('../../models/utilisateur.model');

const Voiture = require('../../models/voiture.model');

const Etat = require('../../models/etat.model');

const Depot = require('../../models/depot.model');

const clientMiddleware = require('../../middlewares/client.middleware');

const voitureMiddleware = require('../../middlewares/voiture.middleware');

module.exports = {
    config, 
    Utilisateur,
    Voiture,
    Etat,
    Depot,
    clientMiddleware,
    voitureMiddleware
}