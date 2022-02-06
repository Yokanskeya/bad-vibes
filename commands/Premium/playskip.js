const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const playermanager = require(`${process.cwd()}/handlers/playermanager`);
module.exports = {
  name: `playskip`,
  category: `Premium`,
  aliases: [`ps`],
  description: `Plays a song instantly from youtube, which means skips current track and plays next song`,
  usage: `playskip <Song / URL>`,
  parameters: {
    "type": "music",
    "activeplayer": false,
    "check_dj": true,
    "previoussong": false
  },
  type: "song",
  premium: true,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //if no args return error
    if (!args[0])
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["premium"]["playskip"]["variable1"]))
          .setFooter(client.getFooter(es))
        ]
      });

    if (args.join("").includes("soundcloud")) {
      message.reply({
        embeds: [
          new MessageEmbed().setColor(es.color)
          .setTitle(eval(client.la[ls]["cmds"]["premium"]["playskip"]["soundcloud"]))
          .setDescription(`\`\`\`${String(args.join(" ")).substr(0, 2000)}\`\`\``)
          .setFooter(client.getFooter(es))
        ]
      })
      playermanager(client, message, args, `skiptrack:soundcloud`);
    } else if (args.join("").includes("spotify")) {
      message.reply({
        embeds: [
          new MessageEmbed().setColor(es.color)
          .setTitle(eval(client.la[ls]["cmds"]["premium"]["playskip"]["spotify"]))
          .setDescription(`\`\`\`${String(args.join(" ")).substr(0, 2000)}\`\`\``)
          .setFooter(client.getFooter(es))
        ]
      })
      playermanager(client, message, args, `skiptrack:raw`);
    } else if (args.join("").includes("apple")) {
      message.reply({
        embeds: [
          new MessageEmbed().setColor(es.color)
          .setTitle(eval(client.la[ls]["cmds"]["premium"]["playskip"]["apple"]))
          .setDescription(`\`\`\`${String(args.join(" ")).substr(0, 2000)}\`\`\``)
          .setFooter(client.getFooter(es))
        ]
      })
      playermanager(client, message, args, `skiptrack:raw`);
    } else {
      message.reply({
        embeds: [
          new MessageEmbed().setColor(es.color)
          .setTitle(eval(client.la[ls]["cmds"]["premium"]["playskip"]["youtube"]))
          .setDescription(`\`\`\`${String(args.join(" ")).substr(0, 2000)}\`\`\``)
          .setFooter(client.getFooter(es))
        ]
      })
      //play from YOUTUBE
      playermanager(client, message, args, `skiptrack:youtube`);
    }
  }
};