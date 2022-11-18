const express = require('express');
const app = express();
const port =3000
const cors= require('cors')
app.use(cors())
app.use(express.json())
//routes

app.post("/api/auth/signup",(req, res) => {
  console.log("signup request:",req.body)
})
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://baptiste:test36400@cluster2.thsotrz.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.get("/",()=>(req,res)=>res.send("hello world"))
app.listen(port, ()=>console.log("listenning on port"+port ))
