const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `cleareq`,
  category: `Filter`,
  aliases: [`ceq`, `reseteq`, `clearequalizer`, `resetequalizer`, `restoreequalizer`, `req`],
  description: `Clears the Equalizer`,
  usage: `clearEQ`,
  parameters: {
    "type": "music",
    "check_dj": true,
    "activeplayer": true,
    "previoussong": false
  },
  type: "music",
  cooldown: 5,
  premium: true,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    player.clearEQ();
    player.set("eq", "💣 None");
    return message.channel.send({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["filter"]["cleareq"]["variable1"]))
        .addField(eval(client.la[ls]["cmds"]["filter"]["cleareq"]["variablex_2"]), eval(client.la[ls]["cmds"]["filter"]["cleareq"]["variable2"]))
        .addField(eval(client.la[ls]["cmds"]["filter"]["cleareq"]["variablex_3"]), eval(client.la[ls]["cmds"]["filter"]["cleareq"]["variable2"]))
        .setDescription(eval(client.la[ls]["cmds"]["filter"]["cleareq"]["variable4"]))
      ]
    });
  }
};