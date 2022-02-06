const mongoose = require("mongoose");

const leveling = new mongoose.Schema({
  GuildId: String,
  status: Boolean,
  user: Array,
});

module.exports = mongoose.model("leveling-system", leveling);
