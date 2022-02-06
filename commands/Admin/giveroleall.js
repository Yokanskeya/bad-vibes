const {
  MessageEmbed
} = require('discord.js');
const emoji = require('../../botconfig/emojis.json');
const ee = require('../../botconfig/embed');
const url = require('../../botconfig/url.json');
module.exports = {
  name: "giveroleall",
  aliases: ["send-role-all", "give-role-all"],
  category: "Admin",
  description: "Give roles to all members",
  usage: "giveroleall <@role>",
  memberpermissions: [`ADMINISTRATOR`],
  type: "server",
  cooldown: 10,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let role = await message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!role) return message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle(eval(client.la[ls]["cmds"]["admin"]["giveroleall"]["var1"]))
      ],
    });
    let myrole = message.guild.roles.cache.find(role => role.name == client.user.username);
    try {
      if (role.position > myrole.position) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["admin"]["giveroleall"]["var2"]))
            .setDescription(eval(client.la[ls]["cmds"]["admin"]["giveroleall"]["var3"]))
          ],
        })
      }
    } catch (error) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["giveroleall"]["var4"]))
          .setDescription(eval(client.la[ls]["cmds"]["admin"]["giveroleall"]["var5"]))
        ]
      })
    }
    try {
      message.guild.members.fetch()
        .then((members) => {
          (members).filter(b => !b.user.bot)
            .forEach((m) => {
              m.roles.add(role)
            });
        })
    } catch (e) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["giveroleall"]["var6"]))
          .setDescription(`\`\`\`${e.message ? e.message : String(e).grey.substr(0, 2000)}\`\`\``)
        ]
      })
    }
    return message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["admin"]["giveroleall"]["var7"]))
      ]
    })
  }
};