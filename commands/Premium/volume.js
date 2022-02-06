const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const SS = require('../../databases/settings');
module.exports = {
  name: `volume`,
  category: `Premium`,
  aliases: [`vol`],
  description: `Changes the Volume`,
  usage: `volume <0-150>`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "queuesong",
  premium: true,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //if the Volume Number is out of Range return error msg
    if (Number(args[0]) <= 0 || Number(args[0]) > 150)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["premium"]["volume"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["premium"]["volume"]["variable2"]))
          .setFooter(client.getFooter(es))
        ]
      });
    //if its not a Number return error msg
    if (isNaN(args[0]))
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["premium"]["volume"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["premium"]["volume"]["variable4"]))
          .setFooter(client.getFooter(es))
        ]
      });
    //change the volume
    player.setVolume(Number(args[0]));
    SS.findOne({ GuildId : message.guild.id }, async(err, data) => {
      if (data)
      data.Volume = args[0];
      data.save();
    })
    //send success message
    return message.reply({
      embeds: [new MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["premium"]["volume"]["variable5"]))
        .setDescription(eval(client.la[ls]["cmds"]["premium"]["volume"]["variable6"]))
        .setColor(es.color)
        .setFooter(client.getFooter(es))
      ]
    });

  }
};
