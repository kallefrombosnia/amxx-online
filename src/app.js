const express = require('express');
const path = require('path');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');

// Database init and set to global object
const adapter = new FileSync('db/db.json')
global.db = low(adapter);
global.db.defaults({ compiles: [], total_compile_times: 0, total_compile_time: 0, log_error: [], log_success: []}).write();

global.config = require('../config.json');

// Init app
const app = express();

// Template folder
app.set('views', path.join(__dirname, 'views'));

// Serve static files 
app.use('/assets', express.static(path.join(__dirname, 'assets')))

// Use body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// json format output
app.set('json spaces', 2)

// Set rendering enginel current pugjs
app.set('view engine', 'pug');

// Prevent signed header by express etc
app.disable('x-powered-by')


/*
    PUBLIC ROUTES
*/

// Use dashboard router handler
app.use(require('./routes/public/dashboardRouter'));

// Use compile route handler
app.use(require('./routes/public/compileRouter'));

// Use docs route handler
app.use(require('./routes/public/docsRouter'));

// Use docs route handler
app.use('/api', require('./routes/public/apiRouter'));

// Start app and listen on web port
app.listen(config.WEB_PORT, () =>{
    console.log(`Web server started on port ${config.WEB_PORT}...`);
});