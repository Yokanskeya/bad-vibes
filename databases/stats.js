const mongoose = require("mongoose");

const Stats = new mongoose.Schema({
  GuildId: String,
  Commands: Number,
  Songs: Number,
  
});

module.exports = mongoose.model("Stats", Stats);
