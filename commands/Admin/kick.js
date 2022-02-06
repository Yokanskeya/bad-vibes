const {
  MessageEmbed
} = require('discord.js');
const emoji = require('../../botconfig/emojis.json');
const ee = require('../../botconfig/embed')
const url = require('../../botconfig/url.json');
module.exports = {
  name: "kick",
  aliases: ["kickuser", "kickmember"],
  category: "Admin",
  description: "Kick out a member form server",
  usage: "kick <@user>",
  memberpermissions: [`ADMINISTRATOR`],
  type: "server",
  cooldown: 5,

  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ');
    if (!member) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["kick"]["var1"]))
        ]
      });
    }
    if (!reason) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["kick"]["var2"]))
          .setDescription(eval(client.la[ls]["cmds"]["admin"]["kick"]["var3"]))
        ]
      });
    }
    if (member.id == message.author.id) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["kick"]["var4"]))
        ]
      });
    }
    if (member.id == client.user.id) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["kick"]["var5"]))
        ]
      });
    }
    const admin = member.permissions.has("ADMINISTRATOR")
    if (admin) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["kick"]["var6"]))
        ]
      });
    }
    let msgembed = new MessageEmbed()
      .setColor(es.wrongcolor)
      .setTitle(eval(client.la[ls]["cmds"]["admin"]["kick"]["var7"]))
      .setDescription(eval(client.la[ls]["cmds"]["admin"]["kick"]["var8"]))
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
            await member.kick({
              reason: reason,
            }).then(() => {
              member.send({
                embeds: [new MessageEmbed()
                  .setColor(es.succescolor)
                  .setFooter(client.getFooter(eval(client.la[ls]["cmds"]["admin"]["kick"]["var9"]), message.author.displayAvatarURL({
                    dynamic: true
                  })))
                  .setTitle(eval(client.la[ls]["cmds"]["admin"]["kick"]["var10"]))
                  .addField(eval(client.la[ls]["cmds"]["admin"]["kick"]["var11"]), `\`\`\`yml\n${reason}\`\`\``)
                ]
              })
              return message.reply({
                embeds: [new MessageEmbed()
                  .setColor(es.succescolor)
                  .setFooter(client.getFooter(eval(client.la[ls]["cmds"]["admin"]["kick"]["var12"]), message.author.displayAvatarURL({
                    dynamic: true
                  })))
                  .setTitle(eval(client.la[ls]["cmds"]["admin"]["kick"]["var13"]))
                  .addField(eval(client.la[ls]["cmds"]["admin"]["kick"]["var14"]), `\`\`\`yml\n${reason}\`\`\``)
                ],
              })
            })
          }
        }).catch(e => {
          message.channel.send({
            embeds: [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["admin"]["kick"]["var15"]))
            ]
          });
        })
    });
  }
};