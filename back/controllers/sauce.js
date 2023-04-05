const Sauce = require('../models/sauce');

exports.getAll = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));

};

exports.getOne = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));

};

exports.make = (req, res, next) => {
  const o = JSON.parse(req.body.sauce);
  const url = `${req.protocol}://${req.get('host')}/uploads/` + req.file.filename;

  const newSauce = new Sauce({
    userId: req.auth.userId,
    name: o.name,
    manufacturer: o.manufacturer,
    description: o.description,
    mainPepper: o.mainPepper,
    heat: o.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${url}`
  });
  console.log(req.file);
  newSauce.save()
    .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
    .catch(error => { res.status(400).json({ error }) })
};



exports.edit = (req, res, next) => {
  let updatedData = { ...req.body };

  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}/${req.file.filename}`;
    updatedData = JSON.parse(updatedData.sauce);
    updatedData.imageUrl = url;
  }
  const query = { _id: req.params.id };
  const data = { ...updatedData, _id: req.params.id };
  Sauce.updateOne(query, data)
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }));

};

exports.delete = (req, res, next) => {

  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
    .catch(error => res.status(400).json({ error }));


};

function findIndexLike(id, arr) {
  for (let i = 0; i < arr.length; i++) {
    if(arr[i]==id) {
      return i;
    }
  }
  return -1;
}

exports.like = (req, res, next) => {
  if (req.body.userId == req.auth.userId) {
    const uId = req.auth.userId;
    const sId = req.params.id;
    const like = req.body.like;


    switch (like) { //add to likes
      case 1:

        Sauce.findOne({ _id: sId }, (err, doc) => {
          if (err) {
            console.error(err);
          } else {
            const query = { _id: sId };
            let newData = doc;
            const prev = findIndexLike(uId, newData.usersDisliked);
            if(prev>=0) {
              newData.usersDisliked.delete(prev);
            }
            newData.likes++;
            newData.usersLiked.push(uId);
            
            Sauce.updateOne(query, newData)
              .then(() => res.status(200).json({ message: 'Sauce likée !' }))
              .catch(error => res.status(400).json({ error }));
          }
        });
        break;
        case 0: //remove like/dislike
          Sauce.findOne({ _id: sId }, (err, doc) => {
            if (err) {
              console.error(err);
            } else {
              const query = { _id: sId };
              let newData = doc;
              const prevLike = findIndexLike(uId, newData.usersLiked);
              const prevDislike = findIndexLike(uId, newData.usersDisliked);

              if(prevLike>=0) {
                delete newData.usersLiked[prevLike];
               newData.likes--;
              }              if(prevDislike>=0) {
                delete newData.usersDisliked[prevDislike];
               newData.dislikes--;
              }

              
              Sauce.updateOne(query, newData)
                .then(() => res.status(200).json({ message: 'Like retiré !' }))
                .catch(error => res.status(400).json({ error }));
            }
          });
        break;
      case -1: //add to dislikes
      Sauce.findOne({ _id: sId }, (err, doc) => {
        if (err) {
          console.error(err);
        } else {
          const query = { _id: sId };
          let newData = doc;
          const prev = findIndexLike(uId, newData.usersLiked);
          if(prev>=0) {
            newData.usersLiked.delete(prev);
          }
          newData.dislikes++;
          newData.usersDisliked.push(uId);
          
          Sauce.updateOne(query, newData)
            .then(() => res.status(200).json({ message: 'Sauce dislikée !' }))
            .catch(error => res.status(400).json({ error }));
        }
      });
        break;
      default:
        break;
    }
  } else {
    res.status(403);
  }
};
