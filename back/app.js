/*Req */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const dotenv= require('dot-env');

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');

mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));



const app = express();

app.use(mongoSanitize());


app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.options('*', cors());

app.use(express.json());
app.use(express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;