const bodyParser = require('body-parser');
const passport = require('passport');
const twitchStrategy = require('passport-twitchtv').Strategy;

module.exports = function(app, db, io, comm, config) {

  app.use(bodyParser.json() );       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
      done(null, user);
  });

  passport.use(new twitchStrategy({
      clientID: config.get('twitch.clientID'),
      clientSecret: config.get('twitch.clientSecret'),
      callbackURL: 'http://localhost:7000/auth/twitchtv/callback',
      scope: 'user_read'
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

  app.get('/auth/twitchtv', passport.authenticate('twitchtv'));
  app.get('/auth/twitchtv/callback', passport.authenticate('twitchtv', { failureRedirect: '/login' }), function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
  });

  app.get('/', function (req, res) {
    res.render('index', {
      varInEjsYouWantToAccess: 2,
      user: req.user,
      otherVar: 5
    });
  });

  app.get('/login', function (req, res) {
      res.render('login');
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });






  app.post('/newpoll', (req, res) => {
    if (!req.body.creator || !req.body.name || !req.body.options) {
      res.status(400);
      res.send();
      return;
    }

    comm.clearPolls(() => {
      var poll = new db.poll({
      creator: req.body.creator,
      title: req.body.name,
      options: req.body.options.split(',')
      });
      poll.save((err) => {
        if (err) console.log('[POLL CREATION ERR]',err);
        else comm.emit('newpoll');
        res.status(err ? 400 : 201);
        res.send();
      });
    });
  });

  app.post('/endpoll', (req, res) => {
    comm.emit('endpoll');
  });
}
