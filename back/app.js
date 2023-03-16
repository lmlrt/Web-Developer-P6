/*Req */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');

const Sauce = require('./models/sauce');
const User = require('./models/user');

mongoose.connect('mongodb+srv://laurentmilhorat:ZvVY2TwBEtV3rwc@cluster0.qu2ewgr.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));



const app = express();




app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.options('*', cors());

app.use(express.json());
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false}));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);






module.exports = app;