
module.exports = function(client, wclient, chat, whisper) {

  client.on('chat', function(channel, user, message, self) {
    if (self) return;

    if (message.match(/^!random \d+-\d+/i)) {
      var match = message.match(/^!random (\d+)-(\d+)/i);
      var high = Math.max(parseInt(match[1]), parseInt(match[2]));
      var low = Math.min(parseInt(match[1]), parseInt(match[2]));
      chat(channel, Math.floor(Math.random()*(high-low+1)+low) + '!');
    }
  });
}