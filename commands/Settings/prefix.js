const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const settingSchema = require('../../databases/settings');
module.exports = {
  name: `prefix`,
  category: `Settings`,
  description: `Let's you change the Prefix of the BOT`,
  usage: `prefix <NEW PREFIX>`,
  memberpermissions: [`ADMINISTRATOR`],
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //if no args return error
    if (!args[0])
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable2"]))
        ]
      });
    //if there are multiple arguments
    if (args[1])
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable3"]))
        ]
      });
    //if the prefix is too long
    if (args[0].length > 5)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable4"]))
        ]
      });
    //set the new prefix
    settingSchema.findOne({ GuildId : message.guild.id }, async (err, data) => {
      if(data) {
        data.Prefix =  args[0];
        data.save();

        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable5"]))
          ]
        });
      }
    });
  }
};