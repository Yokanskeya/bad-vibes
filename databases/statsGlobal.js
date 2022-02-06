const mongoose = require("mongoose");

const Stats = new mongoose.Schema({
  BotId: String,
  Commands: Number,
  Songs: Number,
  
});

module.exports = mongoose.model("Stats-Global", Stats);
