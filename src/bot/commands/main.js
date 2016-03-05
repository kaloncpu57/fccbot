var request = require('request');

module.exports = function(client, wclient, chat, whisper, config, db) {

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
    }
  });

}
