/* Pull in the dependencies */
var routes = require('./routes'),
    exphbs = require('express-handlebars'),
	express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	favicon = require('serve-favicon');

module.exports = function(app){
	/*Set up bodyParser*/
	app.use(bodyParser.urlencoded({'extended':false}));
	
	/*Set up the session */
	app.use(session({
		secret: 'thisisasecret',
		resave: false,
		saveUninitialized: false
	}));

	/* Put app into routes constructor */
	routes(app);

	/* Make the public folder static to get and use JS CSS and image files*/
    app.use('/public/', express.static(path.join(__dirname,'../public')));
    app.use(favicon('./public/favicon.ico'));

	/* Handle 404 error*/
	app.use(function(req, res) {
	res.status(400);
	res.render('404error',{user: true, subtitle: " - Page Not Found", text: 'We are sorry the page you are looking for is not found on this site.'});
	});

	/* Handle 500 error*/
	app.use(function(error, req, res, next) {
	res.status(500);
	res.render('404error',{user: true, subtitle: " - Internal Server Error", text: 'Internal Server Error: site is down.'});
	});

	/* Set up handlebars as your template engine */
	app.engine('handlebars', exphbs.create({
		defaultLayout: 'main',
		layoutsDir: app.get('views') + '/layouts',
		partialsDir: app.get('views') + '/partials',
	}).engine);
	app.set('view engine', 'handlebars');

	/* Return app */
	return app;
};

