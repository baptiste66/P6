const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//schéma mongoose donnée utilisateur unique
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
//limite un compte par adresse email
userSchema.plugin(uniqueValidator);
const User=mongoose.model("User",userSchema)
module.exports={User}