$(document).ready(function() {
	var Debug = {

		log: function (msg) {
			console.log(new Date().toJSON() +": "+ msg);
		},

		toggle: function(speed) {
			speed = speed || 'fast';
			defaultDebug.slideToggle(speed);
		}
	};

	function init() {
		Debug.log("Connecting...");

		$(document).keyup(function(e) {
			if (e.keyCode === 220) { //backslash
				Debug.toggle();
			}
		});
	}

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

	function calcMaxPerSecond() {
		maxPerSecondInterval = setInterval(function() {
			speed.html(tweetsAmount);

			if (maxTweetsAmount < tweetsAmount) {
				maxTweetsAmount = tweetsAmount;
			}

			maxSpeed.html(maxTweetsAmount);

			tweetsAmount = 0;
		}, 1000);
	}

	/*
	* Main
	*/

	var socket = new io.connect(window.location.href);
	
	var tweets = $("#tweets ul"),
		defaultDebug = $("#stats"),
		speed = $("#speed"),
		maxSpeed = $("#maxSpeed"),
		maxPerSecondInterval = null,
		tweetsAmount = 0,
		maxTweetsAmount = 0;
		
	init();
	calcMaxPerSecond();

	/* 
	* Socket stuff	
	*/
	    
    socket.on('connect', function() {
		Debug.log("Connected.");
	});
			
	socket.on('disconnect', function() {
		Debug.log("Disconnected.");
		clearInterval(maxPerSecondInterval);
	});
		
	socket.on('tot', function(data) {	
		Debug.log("Current players number: "+ data.tot);
	});

	socket.on('filters', function(data) {	
		Debug.log("Parameter: "+ data.param +", value: "+ data.value);
	});

	function convertURLs(str){
		var regex = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/g;
		return str.replace(regex, "<a href='$1' title='Open this link in a new tab' target='_blank'>$1</a>")
	}

	function strdecode( data ) {
		return JSON.parse( decodeURIComponent( escape ( data ) ) );
	}

	socket.on('tweet', function(tweet) {	
		//console.dir(tweet);
		tweet = strdecode(tweet);

		var date = new Date(tweet.created_at);
		tweets.prepend('<li><a href="http://twitter.com/'+ tweet.user.screen_name +'" title="Visit '+ tweet.user.screen_name +'\'s profile" target="_blank"><img id="avatar" src="'+ tweet.user.profile_image_url +'" alt="" width="48" height="48" /></a><div id="info"><span id="date">'+ date.format("{FullYear}/{Month:2}/{Date:2} {Hours:2}:{Minutes:2}:{Seconds:2}") +'</span><span id="username">'+ tweet.user.screen_name +'</span><span id="text">'+ convertURLs(tweet.text) +'</span></div><div class="clearer"></div></li>');
		// $('#tweets').prop('scrollTop', $('#tweets').prop('scrollHeight'));
		tweetsAmount++;
	});
});
