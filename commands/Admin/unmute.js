const {
  MessageEmbed
} = require('discord.js');
const emoji = require('../../botconfig/emojis.json');
const url = require('../../botconfig/url.json');
const ee = require('../../botconfig/embed')
const mm = require('../../databases/mutemember');
module.exports = {
  name: "unmute",
  aliases: ["unmutemember", "unmuteuser"],
  category: "Admin",
  description: "Unmute your discord member.",
  usage: "unmute <@user>",
  memberpermissions: [`ADMINISTRATOR`],
  type: "server",
  cooldown: 0,

  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    const member = message.mentions.members.first();

    if (!member) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["unmute"]["var1"]))
        ]
      });
    }

    if (member.id == message.author.id) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["unmute"]["var2"]))
        ]
      });
    }
    if (member.id == client.user.id) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["unmute"]["var3"]))
        ]
      });
    }
    const role = message.guild.roles.cache.find(role => role.name === "Muted");
    mm.findOne({
      Guild: message.guild.id
    }, async (err, data) => {
      if (!data)
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["admin"]["unmute"]["var4"]))
          ]
        })

      const user = data.Users.findIndex((prop) => prop === member.id);
      //user -> ture => 0, 1, 2, 3
      //user -> false => -1
      if (user == -1)
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["admin"]["unmute"]["var5"]))
          ]
        })
      data.Users.splice(user, 1);
      data.save();

      await member.roles.remove(role);
      await member.send({
        embeds: [new MessageEmbed()
          .setColor(es.succescolor)
          .setFooter(client.getFooter(eval(client.la[ls]["cmds"]["admin"]["unmute"]["var6"]), message.author.displayAvatarURL({
            dynamic: true
          })))
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["unmute"]["var7"]))
        ]
      })

      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.succescolor)
          .setFooter(client.getFooter(eval(client.la[ls]["cmds"]["admin"]["unmute"]["var8"]), message.author.displayAvatarURL({
            dynamic: true
          })))
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["unmute"]["var9"]))
        ]
      })
    });
  }
};