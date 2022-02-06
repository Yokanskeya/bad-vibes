const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const settingSchema = require('../../databases/settings');
module.exports = {
  name: "togglepruning",
  aliases: ["toggleplaymsg", "playmessage", "playmsg", "toggleprunning", "toggleplaymessage", "prunning", "toggeldebug", "debug"],
  category: `Settings`,
  description: "Toggles playmessage (same as pruning...). If its true a message of playing a new track will be sent, even if your afk. If false it wont send any message if a new Track plays! | Default: true aka send new Track information",
  usage: "pruning",
  memberpermissions: ["ADMINISTRATOR"],
  type: "music",
  cooldown: 10,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //switch the state
    settingSchema.findOne({ GuildId : message.guild.id }, async (err, data) => {
      if(data) {
        if (!data.Pruning) {
          data.Pruning = true;
          await data.save();
        } else {
          data.Pruning = false;
          await data.save();
        }
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.color)
            .setFooter(client.getFooter(es))
            .setThumbnail(es.thumb ? es.footericon : null)
            .setTitle(eval(client.la[ls]["cmds"]["settings"]["togglepruning"]["variable1"]))
            .setDescription(eval(client.la[ls]["cmds"]["settings"]["togglepruning"]["variable2"]))
          ]
        });
      }
    });
  }
};