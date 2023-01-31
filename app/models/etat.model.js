const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EtatSchema = new Schema({
    etat: {
        type: String,
        required: true
    }
});

const Etat = mongoose.model('etats', EtatSchema);

const etat1 = new Etat({etat: "deposé"});
const etat2 = new Etat({etat: "en cours"});
const etat3 = new Etat({etat: "fini"});
const etat4 = new Etat({etat: "récupérer"});

Etat.findOne({etat: etat1.etat}, (err, etat) => {
    if(!etat) {
        etat1.save((err, etat1) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Etat ${etat1.etat} a été ajouté à la base de données`);
            }
        });
    } else {
        //console.log(`Etat ${etat1.etat} existe déjà dans la base de données`);
    }
});

Etat.findOne({etat: etat2.etat}, (err, etat) => {
    if(!etat) {
        etat2.save((err, etat2) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Etat ${etat2.etat} a été ajouté à la base de données`);
            }
        });
    } else {
        //console.log(`Etat ${etat2.etat} existe déjà dans la base de données`);
    }
});
Etat.findOne({etat: etat3.etat}, (err, etat) => {
    if(!etat) {
        etat3.save((err, etat3) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Etat ${etat3.etat} a été ajouté à la base de données`);
            }
        });
    } else {
        //console.log(`Etat ${etat3.etat} existe déjà dans la base de données`);
    }
});
Etat.findOne({etat: etat4.etat}, (err, etat) => {
    if(!etat) {
        etat4.save((err, etat4) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Etat ${etat4.etat} a été ajouté à la base de données`);
            }
        });
    } else {
        //console.log(`Etat ${etat3.etat} existe déjà dans la base de données`);
    }
});

module.exports = Etat;