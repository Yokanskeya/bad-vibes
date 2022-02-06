var {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { musicSystem } = require ('../../handlers/functions');

module.exports = {
  name: "setup-music",
  category: `Settings`,
  aliases: ["setupmusic", "music-setup", "musicsetup"],
  cooldown: 10,
  usage: "setup-music <#text-channel>",
  description: "Setup a Music Request Channel",
  memberpermissions: ["ADMINISTRATOR"],
  type: "music",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let channel = message.mentions.channels.first();
    if (!channel) return message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-music"]["var6"]))
      ]
    })
    musicSystem(client, message.guild.id, channel.id);
  },
};