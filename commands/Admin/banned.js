const {
  MessageEmbed
} = require('discord.js');
const emoji = require('../../botconfig/emojis.json');
const url = require('../../botconfig/url.json');
const ee = require('../../botconfig/embed')
const mm = require('../../databases/mutemember');
module.exports = {
  name: "banned",
  aliases: ["ban", "banuser", "banneduser", "bannedmember", "banmember"],
  category: "Admin",
  description: "Banned member form server",
  usage: "banned <@user>",
  memberpermissions: [`ADMINISTRATOR`],
  type: "server",
  cooldown: 10,

  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ');

    if (!member) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["banned"]["var1"]))
        ]
      });
    }

    if (!reason) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["banned"]["var2"]))
          .setDescription(eval(client.la[ls]["cmds"]["admin"]["banned"]["var3"]))
        ]
      });
    }

    if (member.id == message.author.id) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["banned"]["var4"]))
        ]
      });
    }

    if (member.id == client.user.id) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["banned"]["var5"]))
        ]
      });
    }
    const admin = member.permissions.has("ADMINISTRATOR")
    if (admin) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["banned"]["var6"]))
        ]
      });
    }

    let msgembed = new MessageEmbed()
      .setColor(es.wrongcolor)
      .setTitle(eval(client.la[ls]["cmds"]["admin"]["banned"]["var7"]))
      .setDescription(eval(client.la[ls]["cmds"]["admin"]["banned"]["var8"]))

    let themsg = await message.reply({
      embeds: [msgembed]
    }).then((msg) => {
      msg.channel.awaitMessages({
          filter: m => m.author.id === message.author.id,
          max: 1,
          time: 30 * 1000,
          errors: ['time']
        })
        .then(async collected => {
          if (collected.first().content.toLowerCase() === `yes`) {
            await member.ban({
              reason: reason,
            }).then(() => {
              member.send({
                embeds: [new MessageEmbed()
                  .setColor(es.succescolor)
                  .setTitle(eval(client.la[ls]["cmds"]["admin"]["banned"]["var9"]))
                  .addField(eval(client.la[ls]["cmds"]["admin"]["banned"]["var10"]), `\`\`\`yml\n${reason}\`\`\``)
                  .setFooter(client.getFooter(eval(client.la[ls]["cmds"]["admin"]["banned"]["var11"]), message.author.displayAvatarURL({
                    dynamic: true
                  })))
                ]
              })
              themsg.edit({
                embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["admin"]["banned"]["var12"]))
                ]
              })
              message.react(emoji.react.SUCCESS);
            })
          }
        }).catch(e => {
          message.channel.send({
            embeds: [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["admin"]["banned"]["err"]))
            ]
          });
        })
    });
  }
};