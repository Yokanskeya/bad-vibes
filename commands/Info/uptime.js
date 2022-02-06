const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  duration
} = require(`${process.cwd()}/handlers/functions`)
const moment = require("moment")
module.exports = {
  name: "uptime",
  category: "Info",
  aliases: [],
  usage: "uptime",
  description: "Returns the duration on how long the Bot is online",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let date = new Date()
    let timestamp = date.getTime() - Math.floor(client.uptime);
    message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["info"]["uptime"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["info"]["uptime"]["variable2"]))
        .addField(eval(client.la[ls]["cmds"]["info"]["uptime"]["variablex_3"]), eval(client.la[ls]["cmds"]["info"]["uptime"]["variable3"]))
      ]
    });
  }
}