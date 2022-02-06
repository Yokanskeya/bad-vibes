const { MessageButton, MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const settings = require (`${process.cwd()}/botconfig/settings.json`);
const ee = require (`${process.cwd()}/botconfig/embed`);
const url = require (`${process.cwd()}/botconfig/url.json`);
const MusicSchema = require ('../../databases/musicsettings');
const StatsSchema = require ('../../databases/stats');
const SettingsSchema = require ('../../databases/settings');
module.exports = {
  name: "setupinfo",
  category: "Info",
  aliases: ["setup"],
  cooldown: 0,
  usage: "setup",
  description: "Information for All Setups",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    message.reply({
      embeds: [ new MessageEmbed()
        .setAuthor(client.getAuthor(client.getAuthor(`${client.user.username}`, url.img.icon, url.website.web)))
        .setTitle(client.la[ls].cmds.info.setupinfo.title)
        .addField(client.la[ls].cmds.info.setupinfo.field1.title, eval(client.la[ls].cmds.info.setupinfo.field1.value))
        .addField(client.la[ls].cmds.info.setupinfo.field2.title, eval(client.la[ls].cmds.info.setupinfo.field2.value))
        .addField(client.la[ls].cmds.info.setupinfo.field3.title, eval(client.la[ls].cmds.info.setupinfo.field3.value))
        .addField(client.la[ls].cmds.info.setupinfo.field4.title, eval(client.la[ls].cmds.info.setupinfo.field4.value))
        .addField(client.la[ls].cmds.info.setupinfo.field5.title, eval(client.la[ls].cmds.info.setupinfo.field5.value))
        .setColor(es.color)
        .setFooter(client.getFooter(es))
      ]
    });
  },
};