const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReparationSchema = new Schema({
    depotId: {
        type: Schema.Types.ObjectId,
        ref: 'depots',
        required: true
    },
    duree: {
        type: Number,
        required: true
    },
    materiel: {
        type: String,
        required: true
    },
    avancement: {
        type: Number,
        required: true
    }
});

const Reparation = mongoose.model('reparations', ReparationSchema);
module.exports = Reparation;