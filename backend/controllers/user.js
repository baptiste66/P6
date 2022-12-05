const {User}=require("../models/user")
const bcrypt=require("bcrypt")
const jwt = require('jsonwebtoken');

//fonction création compte
 exports.signup=(req,res,next)=>{
  //10 saltround pour meilleur sécuriter rapiditer
 bcrypt.hash(req.body.password, 10)
      .then(hash => {
//crée un user avec email et password crypté
        const user = new User({
          email: req.body.email,
          //password a des condition voir models
          password: hash
        });
     user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(err => res.status(400).json({ message:"l'email est déjà utilisé"+err }));
      })
      .catch(err => res.status(500).json({ err }));
  }

//fonction connexion
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            //si email n'est pas bon message d'err
            if (!user) {
                return res.status(401).json({ message: 'email incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'mot de passe incorrecte' });
                    }
                    //si password/email correct prend l'id et crée un token avec l'id crypté
                    res.status(200).json({
                        // renvoie l'user id de mongodb
                        userId: user._id,
                        //crée un token avec id crypter 
                         token: jwt.sign(
                            { userId: user._id },
                            process.env.jwt_password,
                            {expiresIn: '12h'}),
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };
  

