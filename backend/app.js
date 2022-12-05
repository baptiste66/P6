//
const express = require('express');
const app = express();
//sécurise l'url
const helmet = require("helmet")
//donne accés au chemin du système de fichiers
const path = require('path');
const sauceRouter= require("./routes/sauce")
const userRouter = require("./routes/user");
//permet de sécuriser les mots de passe
require("dotenv").config()
//connection moogoose
require("./middleware/mongoose")

//cor donne l'acces api
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
/// pour cette route utiliser le fichier statique
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(helmet());
// ajout du middleware express.json afin d'extraire le corps JSON pour la requête POST
app.use(express.json())
//route
 app.use("/api/auth/", userRouter)
 app.use("/api/", sauceRouter)
 

module.exports=app

  