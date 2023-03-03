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
    //enregistre les info dans la base de données
    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 }; 


//modification de sauce
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    // si une nouvelle image a été fournie
    if (req.file != null) {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {});
      // modification de la sauce dans la base de données avec la nouvelle image
      const sauceObject = {
        // récupération du corps de la requête avec la nouvelle image
        ...JSON.parse(req.body.sauce),
        // traitement de la nouvelle image
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      };
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      // modification de la sauce dans la base de données sans nouvelle image
      const sauceObject = { ...req.body, imageUrl: sauce.imageUrl, _id: req.params.id };
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
        .catch((error) => res.status(400).json({ error }));
    }
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
    // ajoute like + id qui like
    Sauce.updateOne({_id: sauceId},{$push: { usersLiked: userId }, $inc: {likes: 1}})
    .then(() => res.status(200).json({ message: "Votre like a été pris en compte!" }))
    .catch((error) => res.status(400).json({ error }))
  }
    // si l'utilisateur dislike
    else if (like === -1) {
      // ajoute dislike + id qui dislike
      Sauce.updateOne({_id: sauceId}, {$push: { usersDisliked: userId }, $inc: {dislikes: 1}})
      .then(() => res.status(200).json({message: "Votre dislike a été pris en compte!"}))
      .catch((error) => res.status(400).json({ error }))
    }
    //si enlève
    else if (like === 0) {
      Sauce.findOne({_id: sauceId})
      .then(sauce => {
        // si l'utilisateur enlève son like
        // vérifie sur l'ID de l'utilisateur apparait bien dans le tableau usersLiked
        if (sauce.usersLiked.includes(userId)) {
            //retire like et id 
            Sauce.updateOne({_id: sauceId}, {$inc: {likes: -1}, $pull: {usersLiked: userId}})
            .then(() => res.status(200).json({ message: "Votre like à bien été supprimé" }))
            .catch((error) => res.status(400).json({ error }));
          }
        // si l'utilisateur enlève son dislike
        // vérifie sur l'ID de l'utilisateur apparait bien dans le tableau usersDisliked
        if (sauce.usersDisliked.includes(userId)) {
            // retire dislike et id
            Sauce.updateOne({_id: sauceId}, {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}})
            .then(() => res.status(200).json({ message: "Votre dislike à bien été supprimé" }))
            .catch((error) => res.status(400).json({ error }))
        }
      })
    // réponse si erreur
    .catch((error) => res.status(400).json({ error }))
    }
  };
