const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DetailFactureSchema = new Schema({
    factureId: {
        type: Schema.Types.ObjectId,
        ref: 'factures',
        required: true
    },
    reparationId: {
        type: Schema.Types.ObjectId,
        ref: 'reparations',
        required: true
    },
    prixUnitaire: {
        type: Number,
        required: true
    },
    quantite: {
        type: Number,
        required: true
    }
});

const DetailFacture = mongoose.model('detailFactures', DetailFactureSchema);
module.exports = DetailFacture;