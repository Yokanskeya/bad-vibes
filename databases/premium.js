const m = require("mongoose");

module.exports = m.model(
  "premium-guild",
  new m.Schema({
    GuildId: String,
    GuildName: String,
    Expire: Number,
    Permanent: Boolean,
    DateExp: String,
    BotAFK : Boolean,
    BotAFKVc : String,
    BotAFKCh : String,
  })
);
