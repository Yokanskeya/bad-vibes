const Discord = require("discord.js");
const colors = require("colors");
const enmap = require("enmap");
const canvacord = require("canvacord");
const fs = require("fs");
const config = require("./botconfig/config.json")

const client = new Discord.Client({
  fetchAllMembers: false,
  failIfNotExists: false,
  shards: "auto",
  allowedMentions: {
    parse: ["roles", "users"],
    repliedUser: false,
  },
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
  ],
  presence: {
    activity: {
      name: `${config.status.text}`.replace("{prefix}", config.prefix),
      type: config.status.type,
      url: config.status.url
    },
    status: "online"
  }
});

client.la = {}
var langs = fs.readdirSync("./languages")
for (const lang of langs.filter(file => file.endsWith(".json"))) {
  client.la[`${lang.split(".json").join("")}`] = require(`./languages/${lang}`)
}
Object.freeze(client.la)

client.setMaxListeners(25);
require('events').defaultMaxListeners = 25;

Array("extraevents", "loaddb", "clientvariables", "command", "events", "erelahandler", "slashCommands", "mongoose", "ownerFunctions").forEach(handler => {
  try {
    require(`./handlers/${handler}`)(client);
  } catch (e) {
    console.log(e.stack ? String(e.stack).grey : String(e).grey)
  }
});

client.on("ready", () => {
  require("./dashboard/index.js")(client);
})
client.login(process.env.token || config.token);