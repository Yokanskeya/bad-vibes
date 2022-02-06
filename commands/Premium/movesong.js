const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  arrayMove
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: `movesong`,
  category: `Premium`,
  aliases: [`mv`],
  description: `Move the song in queue`,
  usage: `movesong <from> <to>`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "queue",
  premium: true,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //if no FROM args return error
    if (!args[0])
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["premium"]["move"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["premium"]["move"]["variable2"]))
          .setFooter(client.getFooter(es))
        ]
      });
    //If no TO args return error
    if (!args[1])
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["premium"]["move"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["premium"]["move"]["variable4"]))
          .setFooter(client.getFooter(es))
        ]
      });
    //if its not a number or too big / too small return error
    if (isNaN(args[0]) || args[0] <= 1 || args[0] > player.queue.length)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["premium"]["move"]["variable5"]))
        ]
      });
    //get the new Song
    let song = player.queue[player.queue.length - 1];
    //move the Song to the first position using my selfmade Function and save it on an array
    let QueueArray = arrayMove(player.queue, player.queue.length - 1, 0);
    //clear teh Queue
    player.queue.clear();
    //now add every old song again
    for (const track of QueueArray)
      player.queue.add(track);
    //send informational message
    return message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["premium"]["move"]["variable6"]))
        .setThumbnail(song.displayThumbnail())
        .setDescription(eval(client.la[ls]["cmds"]["premium"]["move"]["variable7"]))
        .setFooter(client.getFooter(es))
      ]
    });
  }
};