$(document).ready(function() {
	var socket = new io.connect(window.location.href);
	
	var status = $("#status"),
		nick = $("#nick"),
		online = $("#online"),
		tot = $("#tot"),
		keywords = $("#keywords"),
		tweets = $("#tweets ul"),
		debug = $("#debug"),
		speed = $("#speed"),
		maxSpeed = $("#maxSpeed"),
		tweetsAmount = 0,
		maxTweetsAmount = 0;
		
	status.html("Connecting...");
	keywords.html("Retrieving keywords...");

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

	function toggleDebug(spd) {
		var speed = spd || 'fast';
	
		debug.fadeToggle(speed);
		debug.toggleClass("active");
		if (debug.hasClass("active")) {

		} else {

		}
	}

	$(document).keyup(function(e) {
		if (e.keyCode === 220) { //backslash
			toggleDebug();
		}
	});
	
	setInterval(function() {
		speed.html(tweetsAmount);

		if (maxTweetsAmount < tweetsAmount) {
			maxTweetsAmount = tweetsAmount;
		}

		maxSpeed.html(maxTweetsAmount);

		tweetsAmount = 0;
	}, 1000);

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

	socket.on('keywords', function(data) {	
		keywords.html(data.keywords);
	});

	function convertURLs(str){
		var regex = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/g;
		return str.replace(regex, "<a href='$1' title='Open this link in a new tab' target='_blank'>$1</a>")
	}

	socket.on('tweet', function(data) {	
		//console.dir(data);

		var date = new Date(data.tweet.created_at);

		tweets.append('<li><a href="http://twitter.com/'+ data.tweet.user.screen_name +'" title="Visit '+ data.tweet.user.screen_name +'\'s profile" target="_blank"><img id="avatar" src="'+ data.tweet.user.profile_image_url +'" alt="" width="48" height="48" /></a><div id="info"><span id="date">'+ date.format("{FullYear}/{Month:2}/{Date:2} {Hours:2}:{Minutes:2}:{Seconds:2}") +'</span><span id="username">'+ data.tweet.user.screen_name +'</span><span id="text">'+ convertURLs(data.tweet.text) +'</span></div><div class="clearer"></div></li>');
		$('#tweets').prop('scrollTop', $('#tweets').prop('scrollHeight'));
		tweetsAmount++;
	});
});
