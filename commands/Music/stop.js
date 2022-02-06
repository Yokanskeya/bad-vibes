const { MessageEmbed } = require('discord.js');
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const ee = require('../../botconfig/embed');
module.exports = {
  name: `stop`,
  category: `Music`,
  aliases: ["votestop", "vstop", "st"],
  description: `Stops current track and leaves the channel`,
  usage: `stop`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "song",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    player.queue.clear();
    player.stop();
    // await message.reply({
    //   embeds: [new MessageEmbed()
    //   .setColor(es.color)
    //   .setFooter(client.getFooter(es))
    //   .setThumbnail(es.thumb ? es.footericon : null)
    //   .setTitle(eval(client.la[ls]["cmds"]["music"]["stop"]["variable1"]))
    //   .setDescription(eval(client.la[ls]["cmds"]["music"]["stop"]["variable2"]))
    //   .setTimestamp()
    // ]})
    return message.react(emoji.react.stop).catch((e) => {})
  }
};