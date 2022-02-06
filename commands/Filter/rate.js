const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `rate`,
  category: `Filter`,
  aliases: [],
  description: `Allows you to change the SPEED of the TRACK`,
  usage: `rate <Multiplicator>   |   Multiplicator could be: 0  -  3`,
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
          .setTitle(eval(client.la[ls]["cmds"]["filter"]["rate"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["filter"]["rate"]["variable2"]))
        ]
      });
    if (isNaN(args[0]))
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["filter"]["rate"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["filter"]["rate"]["variable4"]))
        ]
      });
    if (Number(args[0]) >= 3 || Number(args[0]) <= 0)
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["filter"]["rate"]["variable5"]))
          .setDescription(eval(client.la[ls]["cmds"]["filter"]["rate"]["variable6"]))
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
        "speed": Number(args[0]),
        "pitch": 1.0,
        "rate": 1.0
      },
    });
    player.set("filter", "📉 Rate");
    player.set("filtervalue", Number(args[0]));
    if (!message.channel) return;
    return message.channel.send({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["filter"]["rate"]["variable7"]))
        .setDescription(eval(client.la[ls]["cmds"]["filter"]["rate"]["variable8"]))
      ]
    });
  }
};