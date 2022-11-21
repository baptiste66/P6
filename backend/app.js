const express = require('express');
const app = express();
const cors= require('cors')
const {signup,login}=require("./controllers/user")
const{sauces}=require("./controllers/sauce")
//permet de sécuriser les mots de passe
require("dotenv").config()
//connection moogoose
require("./models/mongoose")
//middleware
app.use(cors())
app.use(express.json())
 app.post("/api/auth/signup",signup)
 app.post("/api/auth/login",login)
 app.post("/api/sauces",sauces)



module.exports=app

  