const mongoose = require("mongoose");

const reactionRoleSchema = new mongoose.Schema({
  GuildId: String,
  Message: String,
  RolesId: Object,
});

module.exports = mongoose.model("reaction-roles", reactionRoleSchema);
