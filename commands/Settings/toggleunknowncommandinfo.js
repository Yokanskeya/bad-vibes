const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: "toggleunknowncommandinfo",
  aliases: ["toggleunknowncmdinfo", "toggleunknowninfo", "unknowncmdinfo", "unknowninfo", "unknowncommandinfo"],
  category: `Settings`,
  description: "Toggles if the Bot should send you an Informational Message, when the Command is NOT FOUND",
  usage: "toggleunknowncommandinfo",
  type: "bot",
  cooldown: 10,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    client.Settings.findOne({ GuildId : message.guild.id }, async (err, data) => {
      if (data) {
        if (data.Unkowncmdmessage) {
          data.Unkowncmdmessage = false;
          await data.save();
        } else {
          data.Unkowncmdmessage = true; 
          await data.save();
        }
      }
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.color)
          .setThumbnail(es.thumb ? es.footericon : null)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["toggleunknowncommandinfo"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggleunknowncommandinfo"]["variable2"]).substr(0, 2048))
        ]
      });
    })
  }
};