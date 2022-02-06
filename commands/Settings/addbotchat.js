const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const GuildSchema = require('../../databases/settings');
module.exports = {
  name: `addbotchat`,
  aliases: [`addbotchannel`],
  category: `Settings`,
  description: `Let's you enable a bot only chat where the community is allowed to use commands`,
  usage: `addbotchat <#text-channels>`,
  memberpermissions: [`ADMINISTRATOR`],
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //get the channel from the Ping
    let channel = message.mentions.channels.filter(ch => ch.guild.id == message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
    //if no channel pinged return error
    if (!channel)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["addbotchat"]["var1"]))
        ]
      });
    //try to find it, just incase user pings channel from different server
    try {
      message.guild.channels.cache.get(channel.id)
    } catch {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["addbotchat"]["var2"]))
        ]
      });
    }
    client.Settings.findOne({ GuildId: message.guild.id }, async (err, data) => {
      if (data.BotChannel.includes(channel.id)) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["settings"]["addbotchat"]["var3"]))
            .setDescription(eval(client.la[ls]["cmds"]["settings"]["addbotchat"]["varjoin"]))
          ]
        })
      } else {
        data.BotChannel.push(channel.id)
        await data.save();
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.color)
            .setTitle(eval(client.la[ls]["cmds"]["settings"]["addbotchat"]["var4"]))
            .setDescription(eval(client.la[ls]["cmds"]["settings"]["addbotchat"]["varjoin"]))
          ]
        });
      }
    });
  }
};