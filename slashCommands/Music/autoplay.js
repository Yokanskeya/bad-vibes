const Discord = require(`discord.js`);
const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const playermanager = require(`${process.cwd()}/handlers/playermanager`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
const ss = require('../../databases/settings');
module.exports = {
  name: `autoplay`,
  description: `Toggles Autoplay on/off`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  premium: true,
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    
    // //
    // if (!client.settings.get(message.guild.id, "MUSIC")) {
    //   return interaction.reply({ephemeral: true, embed : [new MessageEmbed()
    //     .setColor(es.wrongcolor)
    //     .setFooter(es.footertext, es.footericon)
    //     .setTitle(client.la[ls].common.disabled.title)
    //     .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
    //   ]});
    // }
    await ss.findOne({ GuildId : message.guild.id }, async(err, data) => {
      if (data) {
        if (data.AutoPlay === "false") {
          data.AutoPlay = true,
          data.save();
        } else if (data.AutoPlay === "true") {
          data.AutoPlay = false,
          data.save();
        }
      }
    }).clone();
    //toggle autoplay
    try {
      //toggle autoplay
      player.set(`autoplay`, !player.get(`autoplay`))
      //Send Success Message
      return interaction.reply({embeds :[new MessageEmbed()
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["music"]["autoplay"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["music"]["autoplay"]["variable2"]))
      ]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
    }
  }
};