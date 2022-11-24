const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
       next();
    } else {
    res.status(400).json({ message:'Le Mot de passe doit contenir entre 10 à 64 caractère, avec une maj, une min et un chiffre' });
    }
};