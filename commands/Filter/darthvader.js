const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `darthvader`,
  category: `Filter`,
  aliases: [`dv`],
  description: `Applies a Darthvader Filter`,
  usage: `darthvader`,
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
        "speed": 0.975,
        "pitch": 0.5,
        "rate": 0.8
      },
    });
    player.set("filter", "👾 Darth Vader");
    if (!message.channel) return;
    return message.channel.send({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["filter"]["darthvader"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["filter"]["darthvader"]["variable2"]))
      ]
    });

  }
};