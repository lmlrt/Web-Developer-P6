const Sauce = require('../models/sauce');

exports.getAll = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));

};

exports.getOne = (req, res, next) => {
console.log(req); 
  Sauce.findOne({ _id: req.params.id })
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }));
  
};

exports.make = (req, res, next) => {
  console.log(req);   console.log(req.auth); 
  const sauce = new Sauce({
    userId: 99,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: req.body.imageUrl,
    heat: req.body.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  console.log(sauce);

  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce ajoutée !' }))
    .catch(error => res.status(400).json({ error }));
  res.status(300);

};

exports.edit = (req, res, next) => {
  
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));

};

exports.delete = (req, res, next) => {
  
    Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
      .catch(error => res.status(400).json({ error }));


};
