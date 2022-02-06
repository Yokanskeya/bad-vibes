const mongoose = require("mongoose");

const embedMessage = new mongoose.Schema({
  GuildId: String,
  Color: String,
  Footer: String,
  Title: String,
  Description: String,
  Image: String,
});

module.exports = mongoose.model("Embed-Message", embedMessage);
