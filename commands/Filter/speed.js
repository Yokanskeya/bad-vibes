const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `speed`,
  category: `Filter`,
  aliases: [],
  description: `Allows you to change the SPEED of the TRACK`,
  usage: `speed <Multiplicator>   |   Multiplicator could be: 0  -  3`,
  parameters: {
    "type": "music",
    "check_dj": true,
    "activeplayer": true,
    "previoussong": false
  },
  type: "music",
  cooldown: 30,
  premium: true,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    if (!args.length)
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["filter"]["speed"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["filter"]["speed"]["variable2"]))
        ]
      });
    if (isNaN(args[0]))
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["filter"]["speed"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["filter"]["speed"]["variable4"]))
        ]
      });
    if (Number(args[0]) >= 3 || Number(args[0]) <= 0)
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["filter"]["speed"]["variable5"]))
          .setDescription(eval(client.la[ls]["cmds"]["filter"]["speed"]["variable6"]))
        ]
      });
    player.node.send({
      op: "filters",
      guildId: message.guild.id,
      equalizer: player.bands.map((gain, index) => {
        var Obj = {
          "band": 0,
          "gain": 0,
        };
        Obj.band = Number(index);
        Obj.gain = Number(gain)
        return Obj;
      }),
      timescale: {
        "speed": 1.0,
        "pitch": 1.0,
        "rate": Number(args[0])
      },
    });
    player.set("filter", "⏱ Speed");
    player.set("filtervalue", Number(args[0]));
    if (!message.channel) return;
    return message.channel.send({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["filter"]["speed"]["variable7"]))
        .setDescription(eval(client.la[ls]["cmds"]["filter"]["speed"]["variable8"]))
      ]
    });
  }
};