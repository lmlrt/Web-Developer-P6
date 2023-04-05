const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const maskemail = require('maskemail');
const validator = require("email-validator");
const passwordValidator = require('password-validator');

var schema = new passwordValidator();
 schema.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()   

exports.signup = (req, res, next) => {
    if(schema.validate(req.body.password)== false) {
        throw 200;
    }


    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            let newEmail = req.body.email;

            if(validator.validate(newEmail) == false) {
                throw 200;
            } 
                const user = new User({
                    email: maskemail(newEmail),
                    password: hash
                });
                
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }));
            

        })
        .catch(error => res.status(500).json({ error }));
};
exports.login = (req, res, next) => {
    User.findOne({ email: maskemail(req.body.email) })
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
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};