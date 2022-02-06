const {
  MessageEmbed
} = require('discord.js');
const emoji = require('../../botconfig/emojis.json');
const ee = require('../../botconfig/embed')
const config = require('../../botconfig/config.json');
const url = require('../../botconfig/url.json');
module.exports = {
  name: "vckick",
  aliases: ["voicekick"],
  category: "Admin",
  description: "Kick out a member form voice channels",
  usage: "vckick <@user>",
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
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["vckick"]["var1"]))
        ]
      });
    }
    // if (!reason) {
    //   return message.reply({
    //     embeds: [new MessageEmbed()
    //       .setColor(es.wrongcolor)
    //       .setThumbnail(es.thumb ? url.img.ERROR : null)
    //       .setFooter(client.getFooter(es))
    //       .setTitle(eval(client.la[ls]["cmds"]["admin"]["vckick"]["var2"]))
    //       .setDescription(eval(client.la[ls]["cmds"]["admin"]["vckick"]["var3"]))
    //     ]
    //   });
    // }
    if (member.id == message.author.id) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["vckick"]["var4"]))
        ]
      });
    }
    if (member.id == client.user.id) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["vckick"]["var5"]))
        ]
      });
    }
    const admin = member.permissions.has("ADMINISTRATOR")
    if (admin) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["vckick"]["var6"]))
        ]
      });
    }
    let { channel } = member.voice;
    if (!channel) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["vckick"]["var7"]))
        ]
      });
    }
    await member.voice.disconnect();
    await message.react(emoji.react.SUCCESS)
    // return message.channel.send(eval(client.la[ls]["cmds"]["admin"]["vckick"]["var8"]))
  }
};