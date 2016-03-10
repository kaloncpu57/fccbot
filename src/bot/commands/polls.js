

module.exports = function(client, wclient, chat, whisper, config, db) {

  wclient.on('whisper', function(user, message) {
    var username = user.username;
    if (message.match(/^vote/)) {
      db.poll.find({ end: null }, (err, polls) => {
        var poll = polls[0];
        if (!poll) {
          whisper(username, 'There is no poll currently running.');
          return;
        }
        db.pollVote.find({ poll: poll._id, user: username }, (err, votes) => {
          var vote = votes[0];
          var match = message.match(/^vote (\d)$/);
          if (!match) {
            whisper(username, 'To vote, use /w fccbot vote # (e.g. vote 2)');
            return;
          }
          var num = parseInt(match[1]);
          if (num < 1 || num > poll.options.length) {
            wclient.whisper(username, 'You can only vote between items 1-'+poll.options.length);
            return;
          }
          if (!vote) {
            whisper(username, 'You voted for "'+poll.options[num-1]+'"');
            vote = new db.pollVote({
              poll: poll._id,
              user: username,
              vote: num
            });
          } else {
            whisper(username, 'You changed your vote to "'+poll.options[num-1]+'"');
            vote.vote = num;
          }
          vote.save(err => {
            console.log('[POLLVOTE SAVE ERR]',err);
          });
        });
      });
    }
  });

  client.on('chat', (channel, user, message, self) => {
    if (self) return;
    if (message.match(/^!?vote /)) chat(channel, 'Vote using /w fccbot vote #');
  });

}