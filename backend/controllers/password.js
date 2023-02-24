const passwordSchema = require('../models/password');
//permet de donner des condition au mdp
module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        res.status(400).json({ message: 'Le mot de passe doit faire 10 caractères, avec une maj, une min et un chiffre et un caractère spéciale.' });
    }
};