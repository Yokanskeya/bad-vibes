const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `pause`,
  category: `Music`,
  aliases: [`break`],
  description: `Pauses the Current Song`,
  usage: `pause`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "song",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //if the player is paused return error
    if (!player.playing)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["pause"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["music"]["pause"]["variable2"]))
        ]
      });
    //pause the player
    player.pause(true);
    //return success message
    message.react(emoji.react.pause).catch(e => {});
  }
};