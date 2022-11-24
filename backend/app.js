const express = require('express');
const app = express();
const cors= require('cors')
const sauceRouter= require("./routes/sauce")
const userRouter = require("./routes/user");
//permet de sécuriser les mots de passe
require("dotenv").config()
//connection moogoose
require("./middleware/mongoose")
const path = require('path');
//middleware
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(cors())

app.use(express.json())


 
 app.use("/api/auth/", userRouter)
 app.use("/api/", sauceRouter)
 

module.exports=app

  