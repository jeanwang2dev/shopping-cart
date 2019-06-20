/* Set up your main variables */
var express = require('express'),
	config = require('./server/configure'),
	app = express(),
	mongoose = require('mongoose');
	require('dotenv').config(),
/*	https = require('https'),
	http = require('http'),
	
	fs = require('fs'),
	options = {
		key: fs.readFileSync('key.pem'),
		cert: fs.readFileSync('cert.pem')
	}; */

/* Call the module.exports constructor function of the configure file
This adds to app and returns app
This is done so we do not have to write a bunch of code in our index file.*/
app = config(app);

/* Connect to mongoose */
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@127.0.0.1/${process.env.DB_NAME}`, { useNewUrlParser: true });
mongoose.connection.on('open',function(){
	console.log('Mongoose Connected.');
});

/* need to do this to prevent promise error from happening */
mongoose.Promise = global.Promise;

/* Make Mongoose use `findOneAndUpdate()`. Note that this option is `true` */
mongoose.set('useFindAndModify', false);

/* Set the port */
app.set('port', process.env.PORT || 3000);

/* Make the views directory to serve up the files within that directory */
app.set('views', __dirname + '/views');

/*
http.createServer(app).listen(app.get('port'),'localhost');
console.log('Server running at http://localhost:8080/'); */

/* //Listen on port 80
http.createServer(app).listen(8080);

https.createServer(options, app).listen(app.get('port'),function(){
	console.log('Server up : https://YOURSERVERIP:' + app.get('port'));
}); */


//LISTEN ON PORT 5000 
app.listen(app.get('port'),function(){
	console.log('Server up : http://YOURSERVERIP:' + app.get('port'));
}); 
