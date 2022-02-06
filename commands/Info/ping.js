const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  handlemsg,
  getRandomNum
} = require(`${process.cwd()}/handlers/functions`);
var cp = require('child_process');
module.exports = {
  name: "ping",
  category: "Info",
  aliases: ["latency"],
  cooldown: 2,
  usage: "ping",
  description: "Gives you information on how fast the Bot can respond to you",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let oldate = new Date().getMilliseconds()
    message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle(handlemsg(client.la[ls].cmds.info.ping.m1))
      ]
    }).then(msg => {
      let newtime = new Date().getMilliseconds() - oldate;
      if (newtime < 0) newtime *= -1;
      if (newtime > 10) newtime = Math.floor(newtime / 10);
      msg.edit({
        embeds: [new MessageEmbed()
          .setColor(es.color)
          .setTitle(`🏓 Pong~`)
          .setDescription(`>>> \`\`\`yml\n${handlemsg(client.la[ls].cmds.info.ping.m2, {
            botping: Math.floor(client.ws.ping + new Date().getMilliseconds() - oldate),
            ping: Math.floor(new Date().getMilliseconds() - oldate) + "ms",
            wsping: Math.floor(client.ws.ping)
          })}\`\`\``)
        ]
      });
    })

  }
}