const mongoose = require("mongoose");

const Count = new mongoose.Schema({
  GuildId: String,
  ChannelId: String,
  Member: String,
  
});

module.exports = mongoose.model("Member-Count", Count);
