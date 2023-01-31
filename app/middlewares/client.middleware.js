const Utilisateur = require('../models/utilisateur.model');

const clientMiddleware = {
    checkEmailExists: (req, res, next) => {
        const { mail } = req.body;
        Utilisateur.findOne({ mail }, (err, utilisateur) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (utilisateur) {
                res.status(400).send({ message: 'Adresse e-mail déjà utilisée' });
                return;
            }
            next();
        });
    }
};

module.exports = clientMiddleware;