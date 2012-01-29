Twitter Streaming
======

Experimenting [Twitter Streaming API](https://dev.twitter.com/docs/streaming-api/methods) with Node.js, Express.js, Socket.io

Requirements
------------

* [Node.js](http://nodejs.org/)
* [Npm](http://npmjs.org/)

Modules:

* [Socket.io](http://socket.io/)
* [Express](http://expressjs.com/)

Installation
----------

1. Clone the repository with ``git clone git://github.com/Fabryz/twitter_streaming.git``
2. Install dependencies with ``npm install``
3. Modify ``configs.json`` with your twitter username and password, then change the param/value used for filtering the tweets accordingly to the Twitter Streaming API Methods.
An example of the default configuration file to search for #html5, #nodejs, #jquery hashtags is below:

		{
			"user" : "twitterUsername",
			"pass" : "twitterPassword",
			"param": "track",
			"value" : "#html5,#nodejs,#jquery"
		}

4. Start the server with ``node server.js``
5. Point your browser to ``YOUR_SERVER_IP:8080``
6. Stare at the screen, use "\" to toggle the stats panel

Contribution
-------

* [Roberto Butti](https://github.com/roberto-butti)
* [Fabrizio Codello](https://github.com/Fabryz)

License
-------

Copyright (C) 2012 Fabrizio Codello, Roberto Butti

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.