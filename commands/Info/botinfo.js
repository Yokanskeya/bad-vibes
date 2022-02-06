const Discord = require("discord.js");
const moment = require("moment");
let os = require("os");
let cpuStat = require("cpu-stat");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  duration,
  handlemsg
} = require(`${process.cwd()}/handlers/functions`);
const {
  connected
} = require("process");
const StatsGSchema = require('../../databases/statsGlobal');
const StatsSchema = require('../../databases/stats');
module.exports = {
  name: "botinfo",
  aliases: ["info", "about", "stats"],
  category: "Info",
  description: "Sends detailed info about the client",
  usage: "botinfo",
  type: "bot",
  cooldown: 5,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    StatsGSchema.findOne({
      BotId: client.user.id
    }, async (err, data) => {
      StatsSchema.findOne({
        GuildId: message.guild.id
      }, async (err, data2) => {
        if (data) {
          if (data2) {
            let tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed().setColor(es.color)
                .setAuthor(client.getAuthor(client.la[ls].cmds.info.botinfo.loading, "https://cdn.discordapp.com/emojis/756773010123522058.gif", "https://discord.gg/wrTHfMqzaQ"))
              ]
            })
            cpuStat.usagePercent(function (e, percent, seconds) {
              if (e) {
                return console.log(e.stack ? String(e.stack).grey : String(e).grey);
              }
              let connectedchannelsamount = 0;
              let guilds = client.guilds.cache.map((guild) => guild);
              for (let i = 0; i < guilds.length; i++) {
                if (guilds[i].me.voice.channel) connectedchannelsamount += 1;
              }
              const totalGuilds = client.guilds.cache.size;
              const totalMembers = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)
              countertest = 0;
              const botinfo = new Discord.MessageEmbed()
                .setAuthor(client.getAuthor(client.user.tag + " Information", es.footericon, `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=identify%20email%20guilds%20bot%20applications.commands`))
                .setDescription(eval(client.la[ls]["cmds"]["info"]["botinfo"]["variable1"]))
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                .addField(client.la[ls].cmds.info.botinfo.field1.title, handlemsg(client.la[ls].cmds.info.botinfo.field1.value, {
                  totalGuilds: totalGuilds,
                  totalMembers: totalMembers,
                  connections: connectedchannelsamount,
                  connectedchannelsamount: connectedchannelsamount
                }), true)
                .addField(client.la[ls].cmds.info.botinfo.field2.title, `\`\`\`yml\nNode.js: ${process.version}\nDiscord.js: v${Discord.version}\nBot: v${require('../../package.json').version}\`\`\``, true)
                .addField(client.la[ls].cmds.info.botinfo.field3.title, handlemsg(client.la[ls].cmds.info.botinfo.field3.value, {
                  cpu: percent.toFixed(2),
                  ram: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
                }))
                .addField(client.la[ls].cmds.info.botinfo.field6.title, `\`\`\`yml\nGlobal Used: ${data.Commands}\nServer Used: ${data2.Commands}\`\`\``, true)
                .addField(client.la[ls].cmds.info.botinfo.field7.title, `\`\`\`yml\nGlobal Played: ${data.Songs}\nServer Played: ${data2.Songs}\`\`\``, true)
                .addField(client.la[ls].cmds.info.botinfo.field4.title, `\`\`\`yml\nName: adamkaisa#9997\nID: [863031982018920488]\`\`\``)
                .addField(client.la[ls].cmds.info.botinfo.field5.title, handlemsg(client.la[ls].cmds.info.botinfo.field5.value, {
                  invitelink: `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=identify%20email%20guilds%20bot%20applications.commands`
                }))
                .setFooter(client.getFooter(es));
              tempmsg.edit({
                embeds: [botinfo]
              });
            });
          }
        }
      });
    });
  },
};