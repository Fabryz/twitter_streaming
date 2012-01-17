var util = require('util'),
	spawn = require('child_process').spawn;
    
console.log('* Twitter Streaming app has started.');
    
var tail_child = spawn('sh', ['stream.sh'], { 'cwd' : '/Applications/MAMP/htdocs/twitter_streaming' });

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
                
				console.log(tweet.created_at +' '+ tweet.user.screen_name +': '+tweet.text);
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
	
});

tail_child.on('exit', function (code) {
	if (code !== 0) {
		console.log('process exited with code ' + code);
	}
});