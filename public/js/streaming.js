$(document).ready(function() {
	var socket = new io.connect(window.location.href);
	
	var status = $("#status"),
		nick = $("#nick"),
		online = $("#online"),
		tot = $("#tot"),
		tweets = $("#tweets ul");
		
	status.html("Connecting.");
	
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
		tweets.append('<li>'+ data.tweet.created_at +' '+ data.tweet.user.screen_name +': '+ data.tweet.text +'</li>');
		$('#tweets').prop('scrollTop', $('#tweets').prop('scrollHeight'));
	});
});
