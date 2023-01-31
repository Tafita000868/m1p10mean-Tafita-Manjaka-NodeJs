const express = require('express');

const router = express.Router();

const config = require("../../config/auth.config");
const Mail = require("../../config/mail");

const Utilisateur = require('../../models/utilisateur.model');
const Voiture = require('../../models/voiture.model');
const Etat = require('../../models/etat.model');
const Depot = require('../../models/depot.model');
const Facture = require('../../models/facture.model');

const Reparation = require('../../models/reparation.model');
const DetailFacture = require('../../models/detailFacture.model');
const clientMiddleware = require('../../middlewares/client.middleware');
const voitureMiddleware = require('../../middlewares/voiture.middleware');

var jwt = require("jsonwebtoken");

var bcrypt = require("bcryptjs");

router.get('/utilisateur/liste', function(req, res, next) {
    Utilisateur.find({}, function(err, utilisateurs) {
        if (err) return next(err);
        res.json(utilisateurs);
    });
});

router.post('/utilisateur/inserer', clientMiddleware.checkEmailExists, function(req, res, next) {
    const utilisateur = new Utilisateur({
      nom : req.body.nom,
      statut : "Non confirmé",
      role : "client",
      mail : req.body.mail,
      mdp : bcrypt.hashSync(req.body.mdp, 8),
      codeConfirmation: Math.floor(100000 + Math.random() * 900000)
    });
  
    const email = new Mail(utilisateur.mail, 'Confirmation de compte', `Votre code de confirmation est : ${utilisateur.codeConfirmation}`);
    email.sendEmail();
  
    utilisateur.save(err => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.json(utilisateur);
    });
  });
  
  router.post('/utilisateur/confirmer', function(req, res, next) {
    Utilisateur.findOne({ mail: req.body.mail }, function (err, utilisateur) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      if (!utilisateur) {
        res.status(404).send({ message: 'Utilisateur introuvable.' });
        return;
      }
      //console.log(utilisateur.codeConfirmation-req.body.codeConfirmation);
      if (utilisateur.codeConfirmation == req.body.codeConfirmation) {
        utilisateur.statut = 'normale';
        utilisateur.save(function (err) {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.json(utilisateur);
        });
      } else {
        res.status(401).send({ message: 'Code de confirmation incorrect.' });
      }
    });
  });

router.post('/utilisateur/login', (req, res, next) => {
    const { mail, mdp } = req.body;
    
    Utilisateur.findOne({ mail }, (err, utilisateur) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        
        if (!utilisateur) {
            res.status(401).send({ message: 'Adresse e-mail non enregistrée' });
            return;
        }

        if (utilisateur.statut == "Non confirmé") {
            res.status(401).send({ message: 'Votre compte n\'a pas été confirmé. Veuillez vérifier votre boîte de réception pour un email de confirmation' });
            return;
        }

        i/*f(utilisateur.role !== "client") {
            res.status(401).send({ message: 'Utilisateur non enregistré' });
            return;
        }*/

        var mdpValid = bcrypt.compareSync(
            mdp,
            utilisateur.mdp
          );
        
        if (!mdpValid) {
            res.status(401).send({ message: 'Mot de passe incorrect' });
            return;
        }

        var token = jwt.sign({ id: utilisateur.id }, config.secret, {
            expiresIn: 86400 // 24 hours
          });
    
        var authorities = [];
        
        authorities.push("ROLE_" + utilisateur.role.toUpperCase());

        res.status(200).send({
            id: utilisateur._id,
            nom: utilisateur.nom,
            statut: utilisateur.statut,
            role: authorities,
            mail: utilisateur.mail,
            accessToken: token
          });
    });
});

router.post('/utilisateur/loginAdmin', (req, res, next) => {
    const { mail, mdp } = req.body;
    
    Utilisateur.findOne({ mail }, (err, utilisateur) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        
        if (!utilisateur) {
            res.status(401).send({ message: 'Adresse e-mail non enregistrée' });
            return;
        }

        if (utilisateur.statut == "Non confirmé") {
            res.status(401).send({ message: 'Votre compte n\'a pas été confirmé. Veuillez vérifier votre boîte de réception pour un email de confirmation' });
            return;
        }

        if(utilisateur.role == "client") {
            res.status(401).send({ message: 'Utilisateur non enregistré' });
            return;
        }

        var mdpValid = bcrypt.compareSync(
            mdp,
            utilisateur.mdp
          );
        
        if (!mdpValid) {
            res.status(401).send({ message: 'Mot de passe incorrect' });
            return;
        }

        var token = jwt.sign({ id: utilisateur.id }, config.secret, {
            expiresIn: 86400 // 24 hours
          });
    
        var authorities = [];
        
        authorities.push("ROLE_" + utilisateur.role.toUpperCase());

        res.status(200).send({
            id: utilisateur._id,
            nom: utilisateur.nom,
            statut: utilisateur.statut,
            role: authorities,
            mail: utilisateur.mail,
            accessToken: token
          });
    });
});


router.post('/utilisateur/insererVoiture', voitureMiddleware.validate, (req, res, next) => {
    Voiture.findOne({matricule: req.body.matricule}, (err, existingVoiture) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (existingVoiture) {
            res.status(409).send({ message: 'Voiture avec ce numéro d immatriculation déjà enregistrée' });
            return;
        }
        const voiture = new Voiture({
            utilisateurId: req.body.utilisateurId,
            marque: req.body.marque,
            type: req.body.type,
            matricule: req.body.matricule
        });
        voiture.save((err, savedVoiture) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            Etat.findOne({etat: "deposé"}, (err, etat) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (etat) {
                    const depot = new Depot({
                        voitureId: savedVoiture._id,
                        etatId: etat._id,
                        dateDebut: new Date()
                    });
                    depot.save((err, savedDepot) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        res.status(200).send(savedDepot);
                    });
                }
            });
        });
    });
});

router.post('/utilisateur/getVoiture', (req, res, next) => {

    const utilisateurId = req.body.utilisateurId;
    Voiture.find({ utilisateurId: utilisateurId })
        .exec((err, voitures) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            let voitureIds = voitures.map(voiture => voiture._id);

            Depot.find({ voitureId: { $in: voitureIds } })
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

                    let response = [];
                    depots.forEach((depot) => {
                        let voiture = depot.voitureId;
                        let etat = depot.etatId;

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
});

/*router.get('/utilisateur/getAllVoiture', (req, res, next) => {
    Voiture.find((err, voitures) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            res.json(voitures);
        }
    });
});*/



router.put('/utilisateur/modifier/:id', function(req, res, next) {
    Utilisateur.findByIdAndUpdate(req.params.id, req.body, function(err, utilisateur) {
        if (err) return next(err);
        res.json(utilisateur);
    });
});

router.delete('/utilisateur/supprimer/:id', function(req, res, next) {
    Utilisateur.findByIdAndRemove(req.params.id, req.body, function(err, utilisateur) {
        if (err) return next(err);
        res.json(utilisateur);
    });
});

router.post('/utilisateur/recupererVoiture', (req, res, next) => {
    const depotid = req.body.depotid;
    Facture.findOne({ depotId: depotid, etatFacture: { $ne: 'validé' } }, function(err, facture) {
        if (err) {
            res.status(500).send({ message: 'Erreur lors de la recherche de la facture' });
        } else if (!facture) {
            Etat.findOne({ etat: 'récupérer' }, function(err, etat) {
                if (err) {
                    res.status(500).send({ message: 'Erreur lors de la recherche de l\'état' });
                } else {
                    Depot.updateOne({ _id: depotid }, { $set: { etatId: etat._id } }, function(err) {
                        if (err) {
                            res.status(500).send({ message: 'Erreur lors de la mise à jour du dépôt' });
                        } else {
                            res.status(200).send({ message: 'Vous avez récupéré votre voiture' });
                        }
                    });
                }
            });
        } else {
            res.status(400).send({ message: 'La facture n\'est pas encore validée' });
        }
    });
});
    
    

router.post('/reparation/payer', function(req, res) {
    let numero = req.body.numero;
  
    Facture.findOne({numero: numero}, (err, facture) => {
        if (err) {
            return res.status(500).send("Erreur lors de la recherche de la facture");
        }
    
        if (!facture) {
            return res.status(404).send("Facture non trouvée");
        }
    
        if (facture.etatFacture === "payement en cours") {
            return res.status(400).send({message: "La facture est déjà en cours de paiement"});
        }
    
        facture.etatFacture = "payement en cours";
    
        facture.save((err) => {
            if (err) {
                return res.status(500).send("Erreur lors de la mise à jour de la facture");
            }
            res.send({message: "Facture mise à jour avec succès"});
        });
    });
  });



module.exports = router;
