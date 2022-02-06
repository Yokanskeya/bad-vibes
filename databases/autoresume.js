const mongoose = require('mongoose')

const autoresume = new mongoose.Schema({
    guild: String,
    voiceChannel: String,
    textChannel: String,
    queue: Object,
    current: Object,
    volume: String,
    queueRepeat: String,
    trackRepeat: String,
    playing: String,
    position: String,
    eq: String,
    filter: String,
    filtervalue: String,
    autoplay: String,
})

module.exports = mongoose.model("autoresume", autoresume);