const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `vibrate`,
  category: `Filter`,
  aliases: [],
  description: `Applies a Vibrate Filter`,
  usage: `vibrate`,
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
      vibrato: {
        "frequency": 4.0, // 0 < x
        "depth": 0.75 // 0 < x ≤ 1
      },
    });
    player.set("filter", "💯 Vibrato");
    if (!message.channel) return;
    return message.channel.send({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["filter"]["vibrato"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["filter"]["vibrato"]["variable2"]))
      ]
    });
  }
};