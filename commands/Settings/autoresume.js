const {
  MessageEmbed
} = require("discord.js");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const settingSchema = require('../../databases/settings');
module.exports = {
  name: "autoresume",
  category: `Settings`,
  aliases: ["toggleautoresume"],
  cooldown: 10,
  usage: "autoresume",
  description: "Toggles if the Auto-Resume-Function should be enabled or not",
  memberpermissions: ["ADMINISTRATOR"],
  type: "music",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    settingSchema.findOne({ GuildId : message.guild.id }, async (err, data) => {
        if(data) {
          if (data.Autoresume === true ) { 
            data.Autoresume = false;
            await data.save();
          } else { 
            data.Autoresume = true;
            await data.save();
          }
        return message.reply({
          embeds: [new MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.color)
            .setThumbnail(es.thumb ? es.footericon : null)
            .setTitle(eval(client.la[ls]["cmds"]["settings"]["autoresume"]["variable1"]))
            .setDescription(eval(client.la[ls]["cmds"]["settings"]["autoresume"]["variable2"]))
          ]
        });
      }
    });
  }
};