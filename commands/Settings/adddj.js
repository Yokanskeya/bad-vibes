const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const ee = require(`${process.cwd()}/botconfig/embed`);
const GuildSchema = require('../../databases/settings');
module.exports = {
  name: `adddj`,
  aliases: [`adddjrole`],
  category: `Settings`,
  description: `Let's you define a DJ ROLE`,
  usage: `adddj <@role>`,
  memberpermissions: [`ADMINISTRATOR`],
  type: "music",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let role = message.mentions.roles.filter(role => role.guild.id == message.guild.id).first();
    if (!role)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["adddj"]["variable1"]))
        ]
      });
    try {
      message.guild.roles.cache.get(role.id);
    } catch {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["adddj"]["variable2"]))
        ]
      });
    }

    GuildSchema.findOne({ GuildId : message.guild.id }, async (err, data) => {
      if (!data.DjRoles) {
        data.DjRoles = role.id;
        await data.save();

        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.color)
            .setFooter(client.getFooter(es))
            .setThumbnail(es.thumb ? es.footericon : null)
            .setTitle(eval(client.la[ls]["cmds"]["settings"]["adddj"]["variable3"]))
          ]
        });
      } else {
        let djname = message.guild.roles.cache.get(data.DjRoles);
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setThumbnail(es.thumb ? es.footericon : null)
            .setTitle(eval(client.la[ls]["cmds"]["settings"]["adddj"]["variable4"]))
            .setDescription(eval(client.la[ls]["cmds"]["settings"]["adddj"]["variable5"]))
          ]
        });
      }
    })
  }
};