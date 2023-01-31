const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UtilisateurSchema = new Schema({
    nom: {
        type: String
        //required: true
    },
    statut: {
        type: String
        //required: true
    },
    role: {
        type: String
        //required: true
    },
    mail: {
        type: String
        //required: true
    },
    mdp: {
        type: String,
        //required: true
    },
    codeConfirmation: {
        type: Number
    }
});

const Utilisateur = mongoose.model('utilisateur', UtilisateurSchema);

module.exports = Utilisateur;