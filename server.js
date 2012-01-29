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
* Using Twitter Streaming API
*/

var https = require('https'),
	Buffer = require('buffer').Buffer,
	fs = require('fs'),
	request;

	//TODO json must be formatted correctly
	//console.log("Incorrect number of parameters.");
	//console.log("Usage: node server.js <twitterUsername> <twitterPassword> <keywords>");
	//console.log("Keywords must be a list of words separated by commas: jquery,html5,symfony2");

var configs = JSON.parse(fs.readFileSync(__dirname +'/configs.json', 'utf8')),
	user = configs.user,
	password = configs.pass,
	param = configs.param,
	value = configs.value,
	postdata = param +'='+ value;

var requestOptions = {
	host: "stream.twitter.com",
	port: 443,
	path: "/1/statuses/filter.json",
	method: "POST",
	headers: {
		"User-Agent" : "ts_agent",
		"Authorization" : "Basic " + new Buffer(user + ":" + password).toString("base64"),
		"Content-Type" : "application/x-www-form-urlencoded",
		"Content-Length" : postdata.length
	}
};
	
function grabFeed() {
	request = https.request(requestOptions, function(response) {
		console.log("* Stream started.");

		response.on('data', function(chunk) {
			//console.log("DATA: %s",chunk.toString('utf8'));
			var json = chunk.toString('utf8');

			if (json.length > 0) {
				try {
					var tweet = JSON.parse(json);
					//console.log(tweet.text);
					io.sockets.emit("tweet", { tweet: tweet });
				} catch(e) {
					console.log("Error: "+ e);
				}
			}
		});

		response.on('end', function() {
			console.log("* Stream ended.");
		});
	});

	request.write(postdata);
	request.end();

	request.on('error', function(e) {
		console.log('Request error: '+ e);
	});
}

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

	if (totUsers > 0) {
		grabFeed();
	}

	client.emit("clientId", { id: client.id });
	client.emit("filters", { param: configs.param, value: configs.value });
	io.sockets.emit("tot", { tot: totUsers });

	client.on('disconnect', function() {
		totUsers--;
		console.log('- User '+ client.id +' disconnected, total users: '+ totUsers);

		if (totUsers == 0) {
			request.abort();
		}

		io.sockets.emit("tot", { tot: totUsers });
	});
});