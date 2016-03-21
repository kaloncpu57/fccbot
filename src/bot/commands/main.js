const request = require('request');

module.exports = function(client, wclient, chat, whisper, comm, config, db) {

  client.on('chat', (channel, user, message, self) => {
    if (self) return;

    if (message.match(/^!random \d+-\d+/i)) {
      var match = message.match(/^!random (\d+)-(\d+)/i);
      var high = Math.max(parseInt(match[1]), parseInt(match[2]));
      var low = Math.min(parseInt(match[1]), parseInt(match[2]));
      chat(channel, Math.floor(Math.random()*(high-low+1)+low) + '!');
    } else if (message.match(/^!clear$/i) && user['user-type'] === 'mod') {
      client.clear(channel);
    } else if (message.match(/^!uptime$/i)) {
      request('https://api.twitch.tv/kraken/streams/'+config.get('twitch.channels')[0], (err, http, body) => {
        if (err) {
          chat(channel, 'Error getting uptime!');
          return;
        }
        var data = JSON.parse(body);
        if (!data.stream || !data.stream.created_at) {
          chat(channel, 'Error parsing uptime!');
          return;
        }
        var diff = Math.floor((Date.now() - (new Date(data.stream.created_at)).getTime())/1000); // Number of seconds diff
        var seconds = diff % 60;
        var minutes = Math.floor(diff/60) % 60;
        var hours = Math.floor(diff/3600);

        var str = 'The stream has been live for ' + (hours?hours+'h ':'') + (minutes?minutes+'m ':'') + (seconds?seconds+'s':'');
        chat(channel, str);
      });
    } else if (message.match(/^!shop$/i)) {
      chat(channel, 'Checkout the official freecodecamp shop: https://www.freecodecamp.com/shop');
    } else if (message.match(/^!stickers$/i)) {
      chat(channel, 'Free Code Camp laptop stickers are here! Get two for only $5, with free shipping anywhere! http://www.freecodecamp.com/shop');
    } else if (message.match(/^!reddit$/i)) {
      chat(channel, 'Subscribe to FreeCodeCamps Reddit: https://www.reddit.com/r/freecodecamp');
    }
  });

  var checkedFollowers = [];
  setInterval(() => {
    request('https://api.twitch.tv/kraken/channels/'+config.get('twitch.channels')[0]+'/follows', (err, http, body) => {
      if (err) {
        console.log('[REQUEST ERROR] Cannot get followers!',err);
        return;
      }
      var followers;
      try {
        followers = JSON.parse(body).follows;
      } catch (e) {
        console.log('[REQUEST ERROR] Cannot parse followers!',e);
        return;
      }

      var newFollow = followers.filter(f => !~checkedFollowers.indexOf(f.user.display_name) && Date.now() - (new Date(f.created_at)).getTime() < 4*60*1000).map(f => f.user.display_name);
      checkedFollowers.push(...newFollow);
      newFollowers(newFollow);
    });
  }, 10*1000);

  function newFollowers(followers) {
    if (followers.length == 0) return;
    console.log(followers);
    comm.emit('newFollowers', followers);
  }

}
