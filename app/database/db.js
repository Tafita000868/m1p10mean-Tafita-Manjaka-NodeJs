var hosting = {
  HOST: "garage_user",
  PASSWORD: "garage_user",
  DB: "Garage_db"
};

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);


// mongoose.connect('mongodb://127.0.0.1:27017/Garage_db', {useNewUrlParser: true});
// mongodb+srv://garage_user:<password>@cluster0.hvqcgf2.mongodb.net/test
// mongoose.connect(`mongodb://${hosting.HOST}:${hosting.PORT}/${hosting.DB}`, {

mongoose.connect(`mongodb+srv://${hosting.HOST}:${hosting.PASSWORD}@cluster0.hvqcgf2.mongodb.net/${hosting.DB}`, {
   useNewUrlParser: true,
   useUnifiedTopology: true
  }).then(() => {
      console.log("Successfully connect to Mongo");
    })
    .catch(err => {
      console.error("Connection error", err);
    }
);

const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));

// db.once('open', function() {
//   console.log("Connected to MongoDB")
// });

// module.exports = db;