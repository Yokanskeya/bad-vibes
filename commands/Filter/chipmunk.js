const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `chipmunk`,
  category: `Filter`,
  aliases: [],
  description: `Applies a Chipmunk Filter`,
  usage: `chipmunk`,
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
        "speed": 1.05,
        "pitch": 1.35,
        "rate": 1.25
      },
    });
    player.set("filter", "🐿️ Chipmunk");
    if (!message.channel) return;
    return message.channel.send({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["filter"]["chipmunk"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["filter"]["chipmunk"]["variable2"]))
      ]
    });
  }
};