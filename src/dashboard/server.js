var bodyParser = require('body-parser')

module.exports = function(app, db, io, comm, config) {

  app.use( bodyParser.json() );       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

  app.post('/newpoll', (req, res) => {
    console.log(req.body);
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
