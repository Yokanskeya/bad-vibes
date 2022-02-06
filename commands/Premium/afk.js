const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const settings = require('../../botconfig/settings.json');
const ps = require('../../databases/premium');
module.exports = {
  name: "afk",
  category: `Premium`,
  cooldown: 10,
  aliases: ["24/7", "afkmusic"],
  usage: "afk",
  description: "Toggles if the Current Queue should be stated on 'afk' or not [DEFAULT: false]",
  memberpermissions: ["ADMINISTRATOR"],
  parameters: {
    "type": "music",
    "activeplayer": false,
    "check_dj": true,
  },
  type: "music",
  premium: true,
  run: async (client, message, args, user, text, prefix, player, es, ls) => {

    if(!player) {
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle(eval(client.la[ls]["cmds"]["premium"]["afk"]["var1"]))
        .setFooter(client.getFooter(es))
      ]}).catch(()=>{})
    }
    //set the player afk
    player.set(`afk`, !player.get(`afk`))

    let channel = message.channel.id

    ps.findOne({ GuildId : message.guild.id}, async (err, data) => {
      if (data){
        if (data.BotAFK === false) {
          data.BotAFK = true;
          data.BotAFKVc = player.voiceChannel;
          data.BotAFKCh = channel;
          await data.save();
        } else {
          data.BotAFK = false;
          data.BotAFKVc = "";
          data.BotAFKCh = "";
          await data.save();
        }
      }
      message.react(emoji.react.enabled)
      return message.reply({
        embeds: [new MessageEmbed()
          .setFooter(client.getFooter(es))
          .setColor(es.color)
          .setThumbnail(es.thumb ? es.footericon : null)
          .setTitle(eval(client.la[ls].cmds.premium.afk.var2))
          .setDescription(eval(client.la[ls]["cmds"]["premium"]["afk"]["var3"]))
        ]
      });
    });
  }
}
