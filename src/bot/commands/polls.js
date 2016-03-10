

module.exports = function(client, wclient, chat, whisper, comm, config, db) {

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
          var num = parseInt(match[1]) - 1;
          if (num < 0 || num >= poll.options.length) {
            wclient.whisper(username, 'You can only vote between items 1-'+poll.options.length);
            return;
          }
          if (!vote) {
            whisper(username, 'You voted for "'+poll.options[num]+'"');
            vote = new db.pollVote({
              poll: poll._id,
              user: username,
              vote: num
            });
          } else {
            whisper(username, 'You changed your vote to "'+poll.options[num]+'"');
            vote.vote = num;
          }
          vote.save(err => {
            if (err) console.log('[POLLVOTE SAVE ERR]',err);
          });
        });
      });
    }
  });

  comm.on('newpoll', () => {
    var channel = config.get('twitch.channels')[0];
    db.poll.find({ end: null }, (err, polls) => {
      var poll = polls[0];

      chat(channel, 'New Poll: ' + poll.title + ('.?!'.indexOf(poll.title[poll.title.length-1]) ? '' : '.') + ' Vote by typing: /w fccbot vote #');
      poll.options.forEach((option,index) => {
        chat(channel, (index+1) + '. ' + option);
      });
    });
  });

  comm.on('endpoll', () => {
    var channel = config.get('twitch.channels')[0];
    db.poll.find({ end: null }, (err, polls) => {
      var poll = polls[0];
      if (!poll) return;
      db.pollVote.find({ poll: poll._id }, (err, votes) => {
        if (votes.length == 0) {
          chat(channel, 'No one voted on: ' + poll.title);
          return;
        }
        var totals = poll.options.map(i=>{
          return { name: i, total: 0 };
        });
        votes.forEach(vote => {
          totals[vote.vote].total++;
        });
        chat(channel, 'Results for: ' + poll.title + ' ('+votes.length+' votes)');
        totals = totals.sort((a, b) => a.total < b.total)
        var place = ['1st', '2nd', '3rd'];
        totals.forEach((total, i) => {
          chat(channel, (i<3?place[i]:(i+1)+'th')+': '+total.name+' ('+total.total+' votes, '+(Math.round(total.total/votes.length*100))+'%)');
        });
      });
    });
  });

  client.on('chat', (channel, user, message, self) => {
    if (self) return;
    if (message.match(/^.?vote /)) chat(channel, '@'+user.username+' , vote using /w fccbot vote #');
    else if (message.match(/^!endpoll/) && user['user-type'] === 'mod') {
      comm.emit('endpoll');
    }
  });

}