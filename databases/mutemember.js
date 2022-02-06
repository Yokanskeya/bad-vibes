const { Schema, model } = require("mongoose");

module.exports = model(
  "Mute-Members",
  new Schema({
    Guild: String,
    Users: Array,
    Role: String,
  })
);