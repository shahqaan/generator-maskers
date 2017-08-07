'use strict';

var app = require('./index');
var http = require('http');
<% if (isSockets) { %> var webSockets = require('./app/lib/web_sockets'); <% } %>

<% if (db == 'mongoose') { %>
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var mongoString = require('./config/mongo.json').url;

var mongoLogger = function(coll, method, query, doc) {
  global.log.debug(coll + '.' + method + '( ' + JSON.stringify(query) +  ', ' + JSON.stringify(doc) + ' )');
};

mongoose.set('debug', true); // mongoose.set('debug', mongoLogger)

mongoose.connect(mongoString, function(error, db) {
  if (error) {
    global.log.error(err);
  } else {
    global.log.info('Connected to MongoDB');
  }
});

<% } %>

var server = http.Server(app);
server.listen(process.env.PORT || 8000);

server.on('listening', function () {
  global.log.info('Server listening on http://localhost:%d', this.address().port);
});

<% if (isSockets) { %>
global.io = require('socket.io').listen(server);
global.io.on('connection', webSockets.newConnection);
<% } %>
