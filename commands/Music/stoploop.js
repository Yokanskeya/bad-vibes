const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `stoploop`,
  category: `Music`,
  aliases: [`offloop`, `disableloop`],
  description: `Stops and disables the Loop`,
  usage: `stoploop`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "queuesong",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //stop both loops
    player.setTrackRepeat(false);
    player.setQueueRepeat(false);
    //send info
    return message.reply({
      embeds: [
        new MessageEmbed()
        .setTitle(client.la[ls].cmds.music.loop.queue.disabled)
        .setColor(es.color)
        .setDescription(client.la[ls].cmds.music.loop.andsong)
      ]
    })

  }
};