const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `leave`,
  category: `Music`,
  aliases: ["dis", "disconnect", "voteleave", "votedis", "vleave", "vdis", "vdisconnect"],
  description: `Remove bots from voice channel`,
  usage: `leave`,
  parameters: {
    "type": "music",
    "activeplayer": false,
    "check_dj": true,
    "previoussong": false
  },
  type: "song",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    if(player) player.destroy();
    // message.reply(eval(client.la[ls]["cmds"]["music"]["leave"]["var1"]))
    return message.react(emoji.react.SUCCESS).catch((e) => {})
  }
};