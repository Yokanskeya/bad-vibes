const mongoose = require('mongoose')

const autorole = new mongoose.Schema({
    GuildId: String,
    RoleId: String
})

module.exports = mongoose.model("autorole", autorole);