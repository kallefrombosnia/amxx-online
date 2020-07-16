const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

global.config = require('../config.json');

// Init app
const app = express();

// Template folder
app.set('views', path.join(__dirname, 'views'));

// Serve static files 
app.use('/assets', express.static(path.join(__dirname, 'assets')))

// Use body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set rendering enginel current pugjs
app.set('view engine', 'pug');


/*
    PUBLIC ROUTES
*/

// Use dashboard router handler
app.use(require('./routes/public/dashboardRouter'));

// Use compile route handler
app.use(require('./routes/public/compileRouter'));

// Start app and listen on web port
app.listen(config.WEB_PORT, () =>{
    console.log(`Web server started on port ${config.WEB_PORT}...`);
});