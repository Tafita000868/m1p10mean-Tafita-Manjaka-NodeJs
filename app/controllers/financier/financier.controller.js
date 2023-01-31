const express = require('express');

const router = express.Router();

const config = require("../../config/auth.config");

const Utilisateur = require('../../models/utilisateur.model');
const Voiture = require('../../models/voiture.model');
const Etat = require('../../models/etat.model');
const Depot = require('../../models/depot.model');
const Facture = require('../../models/facture.model');

const Reparation = require('../../models/reparation.model');
const DetailFacture = require('../../models/detailFacture.model');

const clientMiddleware = require('../../middlewares/client.middleware');
const voitureMiddleware = require('../../middlewares/voiture.middleware');

router.get('/utilisateur/getAllFactures', (req, res, next) => {
    Facture.find({}, (err, factures) => {
        if (err) {
            return res.status(500).send({ message: err });
        } else {
            res.status(200).send({ factures });
        }
    });
});

router.post('/reparation/validerPayement', (req, res) => {
    const factureId = req.body.factureId;

    Facture.findOne({ _id: factureId }, (err, facture) => {
        if (err) {
            return res.status(500).send({ message: "Erreur lors de la recherche de la facture" });
        }

        if (!facture) {
            return res.status(404).send({ message: "Facture non trouvée" });
        }

        facture.etatFacture = "validé";

        facture.save((err) => {
            if (err) {
                return res.status(500).send({ message: "Erreur lors de la mise à jour de la facture" });
            }
            res.status(200).send({ message: "Facture mise à jour avec succès" });
        });
    });
});

module.exports = router;