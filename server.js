const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require('./app/database/db');

const clientController = require('./app/controllers/client/client.controller');
const atelierController = require('./app/controllers/atelier/atelier.controller');
const financierController = require('./app/controllers/financier/financier.controller');
const emailController = require('./app/config/mail'); 

const etatVoiture = require('./app/models/etat.model');

// mongoose.connect(); // etablir la connexion 



var corsOptions = {
  origin: "https://m1p10mean-tafita-manjaka-angular-59em.vercel.app/"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(clientController);
app.use(atelierController);
app.use(financierController);
app.use(etatVoiture);
app.use(emailController);

//require('./app/seed');

app.get('/', function(req, res){
	res.redirect('/');
});

// start the server
const isProduction = process.env.NODE_ENV === 'production'
const port = isProduction ? 7500 : 3001
app.listen(port, function () {
    console.log(`listening on ${port}`)
})

