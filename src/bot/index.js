const requireIndex = require('requireindex');

module.exports = function(app, db, io, config, client, wclient) {

  var messagesSent = []; // List of last 20 message send times
  var needToSend = []; // Messages that can't be sent until we've waited long enough

  function chat(channel, msg) {
    if (Date.now() - messagesSent[0] < 30*1000 && messagesSent.length >= 20) {
      needToSend = needToSend.push({ channel: channel, msg: msg });
      return;
    } else if (messagesSent.length >= 20) {
      messagesSent.shift();
    }
    messagesSent.push(Date.now());
    client.say(channel, msg);
  }

  function sendAllNeededMessages() {
    while (needToSend.length > 0) {
      if (Date.now() - messagesSent[0] < 30*1000) return;
      var msg = needToSend.shift();
      chat(msg.channel, msg.msg);
    }
  }
  setInterval(sendAllNeededMessages, 1000); // TODO: Maybe fix? Cleaner way of doing this?

  function whisper(user, msg) {
    wclient.whisper(user, msg);
  }

  client.on('connected', function() {
    console.log('Connected to channels');
  });
  wclient.on('connected', function() {
    console.log('Connected to whisper server');
  });

  const commandFiles = requireIndex(__dirname+'/commands');
  Object.keys(commandFiles).forEach(cmdFile => {
    console.log('Loading Command File '+cmdFile);
    commandFiles[cmdFile](client, wclient, chat, whisper, config, db);
  });
}