var request = require('request');

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = function(client, wclient, chat, whisper, comm, config, db) {

  client.on('chat', (channel, user, message, self) => {
    if (self) return;

    if (message.match(/^!attack/)) {
      request('https://tmi.twitch.tv/group/user/'+channel.substring(1)+'/chatters', (err, http, body) => {
        if (err) {
          viewers = void(0);
          console.log("Could not retrieve viewers list for " + channel + " (fun.js: !attack command)");
        } else {
          var viewers = JSON.parse(body)["chatters"];
          viewers = viewers["moderators"].concat(viewers["staff"], viewers["admins"], viewers["global_mods"], viewers["viewers"]);
        }
        var cmds = message.split(" "),
            attacks = ["fireball", "sword", "hammer", "ice blast", "lightning"],
            attack = attacks[randInt(0, attacks.length - 1)],
            damage = "for " + randInt(1, 150) + " damage!",
            attackBot = "@" + user['username'] + " attacked with their " + attack + " " + damage + " fccbot counters with its " + attacks[randInt(0, attacks.length - 1)] + " for " + randInt(1, 150) + " damage!",
            str;
        if (randInt(0, 100) < 10) {
          damage = "but missed!";
        }
        if (cmds.length > 1) {
          var victim = cmds[1],
              firstChar = victim.charAt(0);
          if (firstChar == "@") { //check for common @ before username
            victim = victim.substring(1);
          } else if (firstChar == '"' || firstChar == "'") { //allow for possible "victim" with spaces in username using quotes
            var findName = message.split(firstChar);
            if (findName.length > 1) {
              victim = findName[1];
            }
          }
          if (victim.toLowerCase() == "fccbot") {
            str = attackBot;
          } else if (victim.toLowerCase() == user['username'].toLowerCase()) {
            str = "@" + user['username'] + " must be confused! They tried to attack theirself!";
          } else if (viewers && viewers.indexOf(victim.toLowerCase()) > -1) { //if victim is a viewer, notify them with @
            str = "@" + user['username'] + " attacked @" + victim + " with their " + attack + " " + damage;
          } else {
            str = "@" + user['username'] + " attacked " + victim + " with their " + attack + " " + damage;
          }
        } else {
          str = attackBot; //if a victim is not specified, attack fccbot
        }
        chat(channel, str);
      });
    }
  });

}
