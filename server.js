const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origins, X-Requested-With, Content-Type, Accept');
    res.header("Access-Control-Allow-Method", "*");
    next();
})

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


// define a simple route
app.get('/', (req, res) => {
    res.json({ "message": "Welcome to you." });
});
require('./app/routes/store.routes.js')(app);
require('./app/routes/user.routes.js')(app);
require('./app/routes/book.routes.js')(app)

// listen for requests
app.listen(process.env.node_port, () => {
    console.log("Server is listening on port ", process.env.node_port);
});
