const express = require('express');
const tmi = require('tmi.js');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');

var MongoDB = mongoose.connect('mongodb://localhost:27017').connection;

MongoDB.on('error', function(err) {
  console.log('Database error: ' + err.message);
});

MongoDB.once('open', function() {
  console.log('Connected to database');
});

var app = express(MongoDB);

app.use(express.static(path.join(__dirname, 'dashboard/views')));
app.use(express.static(path.join(__dirname, 'dashboard/static')));

var db = {
  message: require('../schemas/message')(mongoose),
};



const port = process.env.PORT || (config.get('testPort') ? 3000 : 80);
var server = app.listen(port, () => {
  console.log('Server live on port ' + port);
});
var io = require('socket.io').listen(server);


const options = {
  options: {
    debug: true
  },
  connection: {
    cluster: 'chat',
    reconnect: true
  },
  identity: {
    username: config.get('twitch.username'),
    password: config.get('twitch.oauth').trim()
  },
  channels: config.get('twitch.channels').map(channel => '#'+channel)
};

const whisperoptions = {
  options: options.options,
  connection: {
    cluster: 'group',
    reconnect: true
  },
  identity: options.identity
}

var client = new tmi.client(options);
var whisperclient = new tmi.client(whisperoptions);

client.connect();
whisperclient.connect();

require('./bot/index')(app, db, io, config, client, whisperclient);
require('./dashboard/server')(app, db, io, config);
