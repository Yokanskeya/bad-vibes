const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const playermanager = require(`${process.cwd()}/handlers/playermanager`);
module.exports = {
  name: `playprevious`,
  category: `Music`,
  aliases: [`pp`, `ppre`, `playprevius`, `playprevios`],
  description: `Plays the Previous played Song and skips the current Song`,
  usage: `playprevious`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": true
  },
  type: "song",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {

    //plays it
    if (player.queue.previous.uri.includes("soundcloud")) {
      message.reply({
        embeds: [
          new MessageEmbed().setColor(es.color)
          .setTitle(`${emoji.msg.search} ${client.la[ls].cmds.music.playprevious.var} ${emoji.msg.soundcloud} Soundcloud`)
          .setDescription(`[${player.queue.previous.title}](${player.queue.previous.uri})`)
        ]
      })
      playermanager(client, message, Array(player.queue.previous.uri), `song:soundcloud`);
    } else if (player.queue.previous.uri.includes("spotify")) {
      message.reply({
        embeds: [
          new MessageEmbed().setColor(es.color)
          .setTitle(`${emoji.msg.search} ${client.la[ls].cmds.music.playprevious.var} ${emoji.msg.spotify} Spotify`)
          .setDescription(`[${player.queue.previous.title}](${player.queue.previous.uri})`)
        ]
      })
      playermanager(client, message, Array(player.queue.previous.uri), `song:raw`);
    } else if (player.queue.previous.uri.includes("apple")) {
      message.reply({
        embeds: [
          new MessageEmbed().setColor(es.color)
          .setTitle(`${emoji.msg.search} ${client.la[ls].cmds.music.playprevious.var} ${emoji.msg.apple} Apple-Music`)
          .setDescription(`[${player.queue.previous.title}](${player.queue.previous.uri})`)
        ]
      })
      playermanager(client, message, Array(player.queue.previous.uri), `song:raw`);
    } else {
      message.reply({
        embeds: [
          new MessageEmbed().setColor(es.color)
          .setTitle(`${emoji.msg.search} ${client.la[ls].cmds.music.playprevious.var} ${emoji.msg.youtube} Youtube`)
          .setDescription(`[${player.queue.previous.title}](${player.queue.previous.uri})`)
        ]
      })
      //play from YOUTUBE
      playermanager(client, message, Array(player.queue.previous.uri), `song:youtube`);
    }
  }
};