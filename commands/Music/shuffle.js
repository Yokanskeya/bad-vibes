const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `shuffle`,
  category: `Music`,
  aliases: [`mix`],
  description: `Shuffles the Queue`,
  usage: `shuffle`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "queue",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //set into the player instance an old Queue, before the shuffle...
    player.set(`beforeshuffle`, player.queue.map(track => track));
    //shuffle the Queue
    player.queue.shuffle();
    //return success message
    return message.react(emoji.react.shuffle).catch((e) => {})
  }
};