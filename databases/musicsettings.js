const mongoose = require("mongoose");

const musicSettingSchema = new mongoose.Schema({
  guildId: String,
  channelId: String,
  messageId: String,
  imgId: String,
});

module.exports = mongoose.model("music-settings", musicSettingSchema);
