var express = require('express');
var tmi = require('tmi.js');
var mongoose = require('mongoose');

var config = require('config');

var MongoDB = mongoose.connect('mongodb://localhost:27017').connection;

MongoDB.on('error', function(err) {
  console.log('Database error: ' + err.message);
});

MongoDB.once('open', function() {
  console.log('Connected to database');
});

var app = express(MongoDB);

var db = {
  //user: require('./schemas/user')(mongoose),
};



const port = process.env.PORT || (config.get('testPort') ? 3000 : 80);
var server = app.listen(port, () => {
  console.log('Server live on port ' + port);
});
var io = require('socket.io').listen(server);


var options = {
  options: {
    debug: true
  },
  connection: {
    random: 'chat',
    reconnect: true
  },
  identity: {
    username: config.get('twitch.username'),
    password: config.get('twitch.oauth')
  },
  channels: config.get('twitch.channels')
};
var client = new tmi.client(options);

require('./bot/index')(app, db, io);
require('./dashboard/server')(app, db, io);