const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VoitureSchema = new Schema({
    utilisateurId: {
        type: Schema.Types.ObjectId,
        ref: 'utilisateurs'
        //required: true
    },
    marque: {
        type: String
        //required: true
    },
    type: {
        type: String
        //required: true
    },
    matricule: {
        type: String
        //required: true
    }
});

const Voiture = mongoose.model('voitures', VoitureSchema);

module.exports = Voiture;