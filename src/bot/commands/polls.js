

module.exports = function(client, wclient, chat, whisper, config, db) {

  wclient.on('whisper', function(user, message) {
    var username = user.username;
    if (message.match(/^vote/)) {
      db.poll.find({ end: null }, (err, polls) => {
        var poll = polls[0];
        if (!poll) {
          wclient.whisper(username, 'There is no poll currently running.');
          return;
        }
        var match = message.match(/^vote (\d)$/);
        if (!match) {
          wclient.whisper(username, 'To vote, use /w fccbot vote # (e.g. vote 2)');
          return;
        }
        var num = parseInt(match[1]);
        if (num < 1 || num > poll.options.length) {
          wclient.whisper(username, 'You can only vote between items 1-'+poll.options.length);
          return;
        }
        wclient.whisper(username, 'You voted for "'+poll.options[num-1]+'"');
      });
    }
  });

}