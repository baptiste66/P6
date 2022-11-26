const sauce=require("../models/sauce")
//permet de naviguer dans les fichier
const fs = require('fs');
//récupérations des sauces
exports.getSauces=(req,res,next)=>{
    sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
    
}


//récuperation d'une sauce par raport id
exports.singleSauce=(req,res,next)=>{
    sauce.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
    
}
//création de sauce
  exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const Sauce = new sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    Sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };


//modification de sauce
 exports.modifySauce = (req, res, next) => {
    const Sauce = new sauce({
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      userId: req.body.userId
    });
    sauce.updateOne({_id: req.params.id}, Sauce).then(
      () => {
        res.status(201).json({
          message: 'Sauce modifier!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

  
//supp sauce
exports.deleteSauce = (req, res, next) => {
  sauce.findOne({ _id: req.params.id})
      .then(Sauce => {
        const imgName = sauce.imageUrl;
        const imDefaut = "http://localhost:3000/images/defaut/imagedefaut.png";
          if (Sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else if (imgName != imDefaut) {
              const filename = Sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};
//like dislike sauce



