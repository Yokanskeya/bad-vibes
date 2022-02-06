var {
  Manager
} = require("erela.js");
var {
  Permissions
} = require("discord.js");
var Spotify = require("erela.js-spotify");
var AppleMusic = require("erela.js-apple");
var Deezer = require("erela.js-deezer");
var Facebook = require("erela.js-facebook");
var config = require(`${process.cwd()}/botconfig/config.json`);
var settings = require(`${process.cwd()}/botconfig/settings.json`);

clientID = process.env.clientID || config.spotify.clientID,
clientSecret = process.env.clientSecret || config.spotify.clientSecret;

module.exports = (client) => {
  if ((!clientID || clientID.length < 5) || (!clientSecret || clientSecret.length < 5)) {
    client.manager = new Manager({
      nodes: config.clientsettings.nodes,
      plugins: [
        new Deezer(),
        new Facebook(),
        new AppleMusic(),
      ],
      send(id, payload) {
        var guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    });
  } else {
    client.manager = new Manager({
      nodes: config.clientsettings.nodes,
      plugins: [
        new Spotify({
          clientID, //get a clientID from there: https://developer.spotify.com/dashboard
          clientSecret
        }),
        new Deezer(),
        new Facebook(),
        new AppleMusic(),
      ],
      send(id, payload) {
        var guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    });
  }
  client.once("ready", () => {
    client.manager.init(client.user.id);
  });
  //require the other events
  require("./node_events")(client)
  require("./events")(client)
  require("./musicsystem")(client)

};