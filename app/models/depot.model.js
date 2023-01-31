const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepotSchema = new Schema({
    etatId: {
        type: Schema.Types.ObjectId,
        ref: 'etats',
        required: true
    },
    voitureId: {
        type: Schema.Types.ObjectId,
        ref: 'voitures',
        required: true
    },
    dateDebut: {
        type: Date,
        required: true
    },
    dateFin: {
        type: Date,
        required: false
    }
});

const Depot = mongoose.model('depots', DepotSchema);
module.exports = Depot;