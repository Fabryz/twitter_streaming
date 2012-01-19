/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'))
    app.use(express.logger(':remote-addr - :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'));
    app.use(express.favicon());
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.sendfile('index.html')
});

app.listen(8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

/*
* WebSockets
*/

var	io = require('socket.io').listen(app),
 	totUsers = 0;
	
io.configure(function() { 
	io.enable('browser client minification');
	io.set('log level', 1); 
	io.set('transports', [ 
			'websocket',
			'flashsocket',
			'htmlfile',
			'xhr-polling',
			'jsonp-polling'
	]);
}); 

io.sockets.on('connection', function(client) {
	totUsers++;
	console.log('+ User '+ client.id +' connected, total users: '+ totUsers);
	client.emit("nick", { nick: client.id });
	client.emit("keywords", { keywords: keywords });
	io.sockets.emit("tot", { tot: totUsers });

	client.on('disconnect', function() {
		totUsers--;
		console.log('- User '+ client.id +' disconnected, total users: '+ totUsers);
		io.sockets.emit("tot", { tot: totUsers });
	});
});

/*
* Using Twitter Streaming API
*/

var util = require('util'),
	https = require('https'),
	query = require('querystring'),
	Buffer = require('buffer').Buffer;

if (process.argv.length < 5 ) {
	console.log("Incorrect number of parameters.");
	console.log("Usage: node server.js <twitterUsername> <twitterPassword> <keywords>");
	console.log("Keywords must be a list of words separated by commas: jquery,html5,symfony2");
	process.exit(1);
}

var user = process.argv[2],
	password = process.argv[3],
	keywords = process.argv[4],
	postdata = query.stringify({ 'track' : keywords });

var headers = {
	"User-Agent" : "ts_agent",
	"Authorization" : "Basic " + new Buffer(user + ":" + password).toString("base64"),
	"Content-Type" : "application/x-www-form-urlencoded",
	"Content-Length" : postdata.length
};

var requestOptions = {
	host: "stream.twitter.com",
	port: 443,
	path: "/1/statuses/filter.json",
	method: "POST",
	headers: headers
};

var request = https.request(requestOptions, function(response) {

	response.on('data', function(chunk){
		//console.log("DATA: %s",chunk.toString('utf8'));
		var json = chunk.toString('utf8');

		if (json.length > 0) {
			try {
				var tweet = JSON.parse(json);
				//console.log(j.text);
				io.sockets.emit("tweet", { tweet: tweet });
			} catch(e) {
				console.log("Error: "+ e);
			}
		}
	});

	response.on('end', function() {
		console.log("End.");
	});
});

request.write(postdata);
request.end();

request.on('error', function(e) {
	console.error(e);
});
