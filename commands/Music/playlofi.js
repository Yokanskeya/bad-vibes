const {
    MessageEmbed
  } = require(`discord.js`);
  const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
  const playermanager = require(`${process.cwd()}/handlers/playermanager`);
  module.exports = {
    name: `playlofi`,
    category: `Music`,
    aliases: [`lofi`],
    description: `Plays an awesome Lofi music`,
    usage: `playlofi`,
    parameters: {
      "type": "music",
      'djole': false,
      "activeplayer": false,
      "previoussong": false
    },
    type: "queuesong",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
      let link = "https://www.youtube.com/watch?v=5qap5aO4i9A&ab_channel=LofiGirl";

      if (args[0]) {
        //default
        if (args[0].toLowerCase().startsWith("d")) link = "https://www.youtube.com/watch?v=5qap5aO4i9A&ab_channel=LofiGirl";
        //lofi indo
        if (args[0].toLowerCase().startsWith("indo")) link = "https://www.youtube.com/watch?v=s1OY1MlgYuI&list=PL4b5Xf5AbHM9wxOfVzwnGCr1GOsQMZwd0";
        //lofi mix
        if (args[0].toLowerCase().startsWith('mix')) link = 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM?si=82ac265bece14fd8';
        //lofi work
        if (args[0].toLowerCase().startsWith('work')) link = 'https://open.spotify.com/playlist/1KO1bi4AvXdMetRhkk8j1e?si=d5a4b360f2914c33';
        //lofi jazz
        if (args[0].toLowerCase().startsWith('jazz')) link = 'https://open.spotify.com/playlist/2Al9G2jrWkwDlRFMZaw1GX?si=cae236272a6440ed';
        //lofi sad
        if (args[0].toLowerCase().startsWith('sad')) link = 'https://open.spotify.com/playlist/1nVWPImtwYUYdvCTPHTtpJ?si=b6bc562862854518';
        //lofi remix
        if (args[0].toLowerCase().startsWith('remix')) link = 'https://open.spotify.com/playlist/4waGPisNYsbwUQzud0qdc0?si=cf2420f41c104d12';
        //lofi chill
        if (args[0].toLowerCase().startsWith('chill')) link = 'https://open.spotify.com/playlist/2LIq3v1ZvSeLtTV6T8Axa6?si=f4e8cd4650534e52';
      }

      const msg = await message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.color)
          .setAuthor(client.getAuthor(`Loading '${args[0] ? args[0] : "Default"}' Lofi Music`, "https://imgur.com/xutrSuq.gif", link))
          .setTitle(eval(client.la[ls]["cmds"]["music"]["playlofi"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["music"]["playlofi"]["variable2"]))
          .addField(eval(client.la[ls]["cmds"]["music"]["playlofi"]["variablex_3"]), eval(client.la[ls]["cmds"]["music"]["playlofi"]["variable3"]))
        ]
      })
      setTimeout(() => {
        msg.delete()
      }, 6000)
      //play the SONG from YOUTUBE
      playermanager(client, message, Array(link), `song:youtube`, false, "songoftheday");
    }
  };
  