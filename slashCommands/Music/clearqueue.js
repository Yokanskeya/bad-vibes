const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `clearqueue`,
  description: `Cleares the Queue`,
  cooldown: 10,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  premium: true,
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    
    // //
    // if (!client.settings.get(message.guild.id, "MUSIC")) {
    //   return interaction.reply({ephemeral: true, embed : [new MessageEmbed()
    //     .setColor(es.wrongcolor)
    //     .setFooter(es.footertext, es.footericon)
    //     .setTitle(client.la[ls].common.disabled.title)
    //     .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
    //   ]});
    // }
    try {
      //clear the QUEUE
      player.queue.clear();
      //Send Success Message
      interaction.reply({embeds : [new MessageEmbed()
        .setTitle(client.la[ls].cmds.music.clearqueue.title)
        .setColor(es.color)
      ]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
    }
  }
};