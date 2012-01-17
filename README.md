Twitter Streaming
======

Experimenting Twitter Streaming API with Node.js

Requirements
------------

* [Node.js](http://nodejs.org/)
* [Npm](http://npmjs.org/)

Installation
----------

1. Clone the repository with ``git clone git://github.com/Fabryz/twitter_streaming.git``
2. Create a file ``stream.sh`` and ``chmod +x stream.sh`` it
3. Put inside ``stream.sh``:
``#!/bin/sh
curl -d @locations https://stream.twitter.com/1/statuses/filter.json -uYourTwitterUsername:YourPassword``
4. Start the server with ``node node_twitter.js``

Contribution
-------

Creator:
* Roberto Butti

Contributors:
* Fabrizio Codello