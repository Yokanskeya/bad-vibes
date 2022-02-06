const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `loopqueue`,
  category: `Premium`,
  aliases: [`repeatqueue`, `lq`, `rq`, `loopqu`, `repeatqu`],
  description: `Repeats the Queue`,
  usage: `loopqueue`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "queue",
  premium: true,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //define the Embed
    const embed = new MessageEmbed()
      .setTitle(player.queueRepeat ? client.la[ls].cmds.premium.loop.queue.disabled : client.la[ls].cmds.premium.loop.queue.enabled)
      .setColor(es.color)
      .setFooter(client.getFooter(es))

    //If trackrepeat was active add informational message + disable it
    if (player.trackRepeat) {
      embed.setDescription(client.la[ls].cmds.premium.loop.andsong);
      player.setTrackRepeat(false);
    }
    //change Queue Mode
    player.setQueueRepeat(!player.queueRepeat);
    //Send Success Message
    return message.reply({
      embeds: [embed]
    });
  }
};
