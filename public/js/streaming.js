$(document).ready(function() {
	var socket = new io.connect(window.location.href);
	
	var status = $("#status"),
		nick = $("#nick"),
		online = $("#online"),
		tot = $("#tot"),
		tweets = $("#tweets ul");
		
	status.html("Connecting.");

	Date.prototype.format = function (fmt) {
		var date = this;

		return fmt.replace(/\{([^}:]+)(?::(\d+))?\}/g, function (s, comp, pad) {
	        var fn = date["get" + comp];

	        if (fn) {
	            var v = (fn.call(date) + (/Month$/.test(comp) ? 1 : 0)).toString();
	
	            return pad && (pad = pad - v.length) ? new Array(pad + 1).join("0") + v : v;
	        } else {
	            return s;
	        }
		});
	};
	
	/* 
	* Socket stuff	
	*/
	    
    socket.on('connect', function() {
    	status.html("Connected.");
	});
			
	socket.on('disconnect', function() {
		status.html("Disconnected.");
	});
	
	socket.on('nick', function(data) {
    	nick.html(data.nick);
	});
	
	socket.on('tot', function(data) {	
		tot.html(data.tot);
	});

	socket.on('tweet', function(data) {	
		var date = new Date(data.tweet.created_at);

		tweets.append('<li>'+ date.format("{FullYear}/{Month:2}/{Date:2} {Hours:2}:{Minutes:2}:{Seconds:2}") +' '+ data.tweet.user.screen_name +': '+ data.tweet.text +'</li>');
		$('#tweets').prop('scrollTop', $('#tweets').prop('scrollHeight'));
	});
});
