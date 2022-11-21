const {User}=require("../models/user")
const bcrypt=require("bcrypt")
const jwt = require('jsonwebtoken');

//fonction création compte
 exports.signup=(req,res,next)=>{
  //10 saltround pour meilleur sécuriter rapiditer
 bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
     user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(err => res.status(400).json({ message:"l'email est déjà utilisé"+err }));
      })
      .catch(err => res.status(500).json({ err }));
  }

//fonction connexion
  exports.login= (req, res, next)=> {
    const jwt_password= process.env.jwt_password

      User.findOne({ email: req.body.email })
          .then(user => {
              if (!user) {
                  return res.status(401).json({ error: 'Utilisateur non trouvé !' });
              }
              bcrypt.compare(req.body.password, user.password)
                  .then(valid => {
                      if (!valid) {
                          return res.status(401).json({ error: 'Mot de passe incorrect !' });
                      }
                      res.status(200).json({
                          userId: user._id,
                          //vérification pour voir si l'utilisateur est authentifier
                          token: jwt.sign(
                              { userId: user._id },
                              `${jwt_password}`,
                              { expiresIn: '24h' }
                          )
                      });
                  })
                  .catch(error => res.status(500).json({ error }));
          })
          .catch(error => res.status(500).json({ error }));
   };
 

  

  