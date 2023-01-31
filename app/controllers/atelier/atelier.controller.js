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

router.get('/utilisateur/getAllVoiture', (req, res, next) => {
    Depot.find()
    .populate({
        path: 'voitureId',
        select: 'utilisateurId marque type matricule'
    })
    .populate({
        path: 'etatId',
        select: 'etat'
    })
    .exec((err, depots) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        var response = [];
        depots.forEach((depot) => {
            var voiture = depot.voitureId;
            var etat = depot.etatId;
            response.push({
                depotid: depot._id,
                etatid: etat._id,
                etat: etat.etat,
                voitureid: voiture._id,
                iduser: voiture.utilisateurId,
                voituremarque: voiture.marque,
                voituretype: voiture.type,
                voiturematricule: voiture.matricule
            });
        });
        res.json(response);
    });
});

router.post('/reparation/changerEtat', (req, res) => {
    // Récupération des données de la requête
    const { etat, facture, depotid } = req.body;
  
    // Recherche du dépôt correspondant à l'ID spécifié
    Depot.findById(depotid, (err, depot) => {
      if (err) {
        return res.status(500).send('Erreur lors de la récupération du dépôt');
      }
      if (!depot) {
        return res.status(404).send('Dépôt non trouvé');
      }
    
      // Vérification de l'existence d'une facture avec le même numéro
      Facture.findOne({ numero: facture }, (err, existingFacture) => {
        if (err) {
          return res.status(500).send('Erreur lors de la recherche de la facture');
        }
        if (existingFacture) {
          return res.status(409).send('Une facture existe déjà avec ce numéro');
        }
        // Vérification de l'existence d'une facture avec le même ID de dépôt
        Facture.findOne({ depotId: depot._id }, (err, existingFacture) => {
          if (err) {
            return res.status(500).send('Erreur lors de la recherche de la facture');
          }
          if (existingFacture) {
            return res.status(409).send('Une facture existe déjà pour ce dépôt');
          }
          // Insertion de la facture
          const newFacture = new Facture({
            numero: facture,
            depotId: depot._id,
            etatFacture: "Non payer"
          });
          newFacture.save((err) => {
            if (err) {
              return res.status(500).send('Erreur lors de l\'insertion de la facture');
            }
            // Mise à jour de l'état du dépôt
            Etat.findOne({ etat: etat }, (err, etat) => {
              if (err) {
                return res.status(500).send('Erreur lors de la récupération de l\'etat');
              }
              if (!etat) {
                return res.status(404).send('Etat non trouvé');
              }
              depot.etatId = etat._id;
              depot.save((err) => {
                if (err) {
                  return res.status(500).send('Erreur lors de la mise à jour de l\'état du dépôt');
                }
                return res.status(200).send('Etat du dépôt mis à jour et facture créée avec succès');
              });
            });
          });
        });
      });
    });
  });

  router.post('/reparation/inserer', (req, res) => {
    // Récupération des données de la requête
    const { materiel, duree, prixU, quantite, depotid } = req.body;
  
    // Recherche du dépôt correspondant à l'ID spécifié
    Depot.findById(depotid, (err, depot) => {
      if (err) {
        return res.status(500).send('Erreur lors de la récupération du dépôt');
      }
      if (!depot) {
        return res.status(404).send('Dépôt non trouvé');
      }
  
      // Insertion de la réparation
      const newReparation = new Reparation({
        depotId: depot._id,
        duree: duree,
        materiel: materiel,
        avancement: 0
      });
     // console.log(newReparation);
      newReparation.save((err) => {
        if (err) {
          return res.status(500).send('Erreur lors de l\'insertion de la réparation');
        }
        // Récupération de l'id de la facture correspondant au dépôt
        Facture.findOne({ depotId: depot._id }, (err, facture) => {
          if (err) {
            return res.status(500).send('Erreur lors de la récupération de la facture');
          }
          if (!facture) {
            return res.status(404).send('Facture non trouvée');
          }
          // Insertion du détail de facture
          const newDetailFacture = new DetailFacture({
            factureId: facture._id,
            reparationId: newReparation._id,
            prixUnitaire: prixU,
            quantite: quantite
          });
          newDetailFacture.save((err) => {
            if (err) {
              return res.status(500).send('Erreur lors de l\'insertion du détail de facture');
            }
            return res.status(200).send('Réparation et détail de facture créés avec succès');
          });
        });
      });
    });
  });

router.post('/reparation/getReparations', (req, res, next) => {
    var filter = {};
    filter.depotId = req.body.depotId;
    Reparation.find(filter, function(err, reparations){
    if (err) {
        res.status(500).send({ message: err });
    }else{
        res.json(reparations);
    }
    });
});

router.post('/reparation/changerAvancement', (req, res) => {
  // Récupération des données de la requête
  const { id, avancement } = req.body;

  Reparation.findById(id, (err, reparation) => {
    if (err) {
      return res.status(500).send('Erreur lors de la récupération de la réparation');
    }
    if (!reparation) {
      return res.status(404).send('Réparation non trouvée');
    }
  
    // Mise à jour de l'avancement de la réparation
    reparation.avancement = avancement;
    reparation.save((err) => {
      if (err) {
        return res.status(500).send('Erreur lors de la mise à jour de l\'avancement de la réparation');
      }
      return res.status(200).send('Avancement de la réparation mis à jour avec succès');
    });
  });
});
router.post('/reparation/terminerReparation', (req, res, next) => {
  const depotid = req.body.depotId;
  Etat.findOne({ etat: 'fini' }, function(err, etat) {
      if (err) {
          res.status(500).send({ message: err });
      } else {
          Depot.updateOne({ _id: depotid }, { $set: { etatId: etat._id } }, function(err) {
              if (err) {
                  res.status(500).send({ message: err });
              } else {
                  res.status(200).send({ message: 'Vous avez fini la reparation' });
              }
          });
      }
  });
});

router.post('/reparation/getFacture', (req, res) => {
  const { depotId } = req.body;

  Facture.findOne({ depotId }).then(facture => {
      if (!facture) {
          return res.status(404).json({ message: 'Facture non trouvée' });
      }

      DetailFacture.find({ factureId: facture._id }).then(detailFactures => {
          const promises = detailFactures.map(detailFacture => {
              return Reparation.findById(detailFacture.reparationId).then(reparation => {
                  return {
                      numero: facture.numero,
                      materiel: reparation.materiel,
                      prixUnitaire: detailFacture.prixUnitaire,
                      quantite: detailFacture.quantite
                  };
              });
          });

          Promise.all(promises).then(results => {
              res.json(results);
          });
      });
  });
});


module.exports = router;