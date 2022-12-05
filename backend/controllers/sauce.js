const Sauce=require("../models/sauce")
//permet de naviguer dans les fichier
const fs = require('fs');
const { json } = require("stream/consumers");

//récupérations des sauces
exports.getSauces=(req,res,next)=>{
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
}


//récuperation d'une sauce par raport id
exports.singleSauce=(req,res,next)=>{
  //comparaison entre id requète et objet pour afficher l'objet sélectionner
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}


//création de sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id;
  delete sauceObject._userId;
    const sauce = new Sauce({
      //copie les information de sauceObjet
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [' '],
        usersdisLiked: [' '],
    });
    //enregistre les info dans la base de donnée
    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 }; 


//modification de sauce
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    //sélectionne première image et la supprime
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      // vérifie si l'objet existe
      const sauceObject = req.file? {
        // récupération du corps de la requête
            ...JSON.parse(req.body.sauce),
            // traitement de la nouvelle image
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
          }
          //sinon juste le corps de la requète
          : { ...req.body };
          // modification de la sauce dans la base de donnée
      Sauce.updateOne({ _id: req.params.id },{ ...sauceObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
        .catch((error) => res.status(400).json({ error }));
    });
  });
};

  
//supp sauce
exports.deleteSauce = (req, res, next) => {
  //cherche la bonne sauce 
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //si créateur de la sauce alors peut supprimer
      if (sauce.userId == req.auth.userId) {
         // sélectionne l'image de la sauce
        const filename = sauce.imageUrl.split("/images/")[1]
        //supprime l'image du backend
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() =>
            res
              .status(200)
              .json({ message: "sauce supprimée !" })
          )
          .catch((error) => res.status(400).json({ error }));
    })  
  }
    //sinon pas autoriser
      else {
        return res.status(403).json("unauthorized request");
};
    })
  }


//like dislike sauce
exports.likeSauce = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id
  if (like === 1) {
    // modification de la sauce dans la base de donnée push de l'ID utilisateur dans le tableau et incrémentation du like dans le compteur de like
    Sauce.updateOne({_id: sauceId},{$push: { usersLiked: userId }, $inc: {likes: 1}})
    // réponse 200 + message
    .then(() => res.status(200).json({ message: "Votre like a été pris en compte!" }))
    // si erreur réponse 400
    .catch(error => res.status(400).json({ error: error }));
  }

}