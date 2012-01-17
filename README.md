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
3. Create a file ``stream.sh`` under the root directory of the cloned repository and ``chmod +x stream.sh`` it
4. Paste this code inside ``stream.sh``:

    #!/bin/sh
    curl -d @params/locations https://stream.twitter.com/1/statuses/filter.json -uYourTwitterUsername:YourPassword

5. Start the server with ``node node_twitter.js``
6. Point your browser to ``YOUR_SERVER_IP:8080``

Contribution
-------

Creator:

* [Roberto Butti](https://github.com/roberto-butti)

Contributors:

* [Fabrizio Codello](https://github.com/Fabryz)
