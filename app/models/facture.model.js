const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FactureSchema = new Schema({
    numero: {
        type: String,
        required: true
    },
    depotId: {
        type: Schema.Types.ObjectId,
        ref: 'depots',
        required: true
    },
    etatFacture: {
        type: String,
        required: true
    }
});

const Facture = mongoose.model('factures', FactureSchema);
module.exports = Facture;