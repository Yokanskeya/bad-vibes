const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `autoplay`,
  category: `Premium`,
  aliases: [`ap`, `toggleauto`, `toggleautoplay`, `toggleap`],
  description: `Toggles Autoplay on/off [DEFAULT: off]`,
  usage: `autoplay`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "queue",
  premium: true,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //toggle autoplay
    player.set(`autoplay`, !player.get(`autoplay`))
    await client.Settings.findOne({ GuildId : message.guild.id }, async(err, data) => {
      if (data) {
        if (data.AutoPlay === false) {
          data.AutoPlay = true,
          data.save();
        } else {
          data.AutoPlay = false,
          data.save();
        }
      }
    }).clone();
    //react with emojis
    message.react(emoji.react.enabled)
    //Send Success Message
    return message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setThumbnail(es.thumb ? es.footericon : null)
        .setTitle(eval(client.la[ls]["cmds"]["premium"]["autoplay"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["premium"]["autoplay"]["variable2"]))
        .setFooter(client.getFooter(es))
      ]
    });
  }
};
