/**
 * Module dependencies.
 */

var express = require('express'),
	app = module.exports = express.createServer();

// Configuration

app.configure(function(){
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
console.log("Express server listening in %s mode", app.settings.env);

/*
* Using Twitter Streaming API
*/

var https = require('https'),
	Buffer = require('buffer').Buffer,
	fs = require('fs'),
	request = '';

function readConfigs() {
	var json,
		configs;
	
	try {
		json = JSON.parse(fs.readFileSync(__dirname +'/configs.json', 'utf8'));
	} catch(e) {
		console.log("Error while reading configs.json: "+ e);
	}

	configs = {
		user : json.user,
		password : json.pass,
		param : json.param,
		value : json.value
	};
	return configs;
}

var configs = readConfigs(),
	postdata = configs.param +'='+ configs.value;

var requestOptions = {
	host: "stream.twitter.com",
	port: 443,
	path: "/1/statuses/filter.json",
	method: "POST",
	headers: {
		"User-Agent" : "ts_agent",
		"Authorization" : "Basic " + new Buffer(configs.user + ":" + configs.password).toString("base64"),
		"Content-Type" : "application/x-www-form-urlencoded",
		"Content-Length" : postdata.length
	}
};

function strencode( data ) {
  return unescape( encodeURIComponent( JSON.stringify( data ) ) );
}
	
function grabFeed() {
	request = https.request(requestOptions, function(response) {
		console.log("* Stream started.");

		response.on('data', function(chunk) {
			var json = chunk.toString('utf8');

			if (json.length > 0) {
				try {
					var tweet = JSON.parse(json);
					io.sockets.emit("tweet", strencode(tweet) );
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

	if ((totUsers > 0) && (request == '')) {
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
			request = '';
		}

		io.sockets.emit("tot", { tot: totUsers });
	});
});