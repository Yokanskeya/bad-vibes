const playermanager = require(`${process.cwd()}/handlers/playermanager`);
module.exports = {
  name: `addprevious`,
  category: `Premium`,
  aliases: [`addp`, `addpre`, `addprevius`, `addprevios`],
  description: `Adds the previous song to the Queue again!`,
  usage: `addprevious`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "previoussong": true
  },
  type: "queue",
  premium: true,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //adds/plays it
    playermanager(client, message, Array(player.queue.previous.uri), player.queue.previous.uri.includes(`soundcloud`) ? `song:soundcloud` : `song:raw`);
  }
};
