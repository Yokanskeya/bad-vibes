const mongoose = require("mongoose");

const GuildSettings = new mongoose.Schema({
  GuildId: String,
  GuildName: String,
  Prefix: String,
  Language: String,
  Pruning: Boolean,
  Unkowncmdmessage: Boolean,
  Autoresume: Boolean,
  Volume: String,
  Eq: String,
  AutoPlay: Boolean,
  PlayMessage: String,
  AutoRole: Boolean,
  Greeting: Boolean,
  DjRoles: String,
  BotChannel: Array,
  Embed: Object, 
});

module.exports = mongoose.model("guild-settings", GuildSettings);
