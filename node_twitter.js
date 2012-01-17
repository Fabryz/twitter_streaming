/**
 * Module dependencies.
 */

var express = require('express'),
    util = require('util'),
	spawn = require('child_process').spawn;

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
  res.render('index', { title: 'Twitter Streaming' })
});

app.listen(8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
    
var tail_child = spawn('sh', ['stream.sh'], { 'cwd' : __dirname });

console.log('Spawned child pid: ' + tail_child.pid);

var response = "";
tail_child.stdout.setEncoding("utf8");
tail_child.stdout.on('data', function(data) {
	response += data.toString('utf8');
	var index, json;
	while ((index = response.indexOf('\r\n')) > -1) {
		//console.log("");
		json = response.slice(0, index);
		response = response.slice(index + 2);
        
		if (json.length > 0) {
			try {
				var tweet = JSON.parse(json);
                
                var tweet_date = new Date(Date.parse(tweet.created_at)).toLocaleDateString();
                var tweet_time = new Date(Date.parse(tweet.created_at)).toLocaleTimeString();

				console.log(tweet_date +' '+ tweet_time +' '+ tweet.user.screen_name +': '+tweet.text);
				//self.emit('tweet', JSON.parse(json));
			} catch(e) {
				console.log("ERRORE:"+e);
				//self.emit('error', e);
			}
		}
	}
	//console.dir("**************\n"+json+"************\n");
});

tail_child.stderr.on('data', function (data) {
	//console.log('stderr: ' + data);
});

tail_child.on('exit', function (code) {
	if (code !== 0) {
		console.log('process exited with code ' + code);
	}
});