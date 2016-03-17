const express = require('express');
const tmi = require('tmi.js');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const passport = require("passport");
const twitchStrategy = require("passport-twitchtv").Strategy;

var MongoDB = mongoose.connect('mongodb://localhost:27017').connection;

MongoDB.on('error', function(err) {
  console.log('Database error: ' + err.message);
});

MongoDB.once('open', function() {
  console.log('Connected to database');
});

var app = express(MongoDB);

app.set('views', __dirname + '/dashboard/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'dashboard/static')));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (req, res) {
    res.render('index');
});

app.get("/login", function (req, res) {
    res.render('login', { user: req.user });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

var db = {
  message: require('../schemas/message')(mongoose),
  poll: require('../schemas/poll')(mongoose),
  pollVote: require('../schemas/pollVote')(mongoose)
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

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new twitchStrategy({
    clientID: config.get('twitch.clientID'),
    clientSecret: config.get('twitch.clientSecret'),
    callbackURL: "http://localhost:7000/auth/twitchtv/callback",
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {

      // To keep the example simple, the user's Twitch.tv profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Twitch.tv account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

app.get("/auth/twitchtv", passport.authenticate('twitchtv'));
app.get('/auth/twitchtv/callback', passport.authenticate('twitchtv', { failureRedirect: '/login' }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});

var communicator = Object.create(require('events').EventEmitter.prototype);

require('./bot/index')(app, db, io, communicator, config, client, whisperclient);
require('./dashboard/server')(app, db, io, communicator, config);
