const {
    MessageEmbed,
    MessageButton,
    MessageActionRow
  } = require("discord.js")
  const config = require(`${process.cwd()}/botconfig/config.json`);
  var ee = require(`${process.cwd()}/botconfig/embed`);
  const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
  const url = require(`${process.cwd()}/botconfig/url.json`);
  const {
    handlemsg
  } = require(`${process.cwd()}/handlers/functions`)
  module.exports = {
    name: "report",
    category: "Mics",
    aliases: ["report", "issues", "bugs"],
    usage: "report <case>",
    description: "Report bugs in the bot",
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
        const channelReport = client.channels.cache.get(config.channel.Report);
      
          let query = args.join(" ");
          if (!query) return message.reply({
            embeds: [ new MessageEmbed ()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["misc"]["report"]["var1"]))
              .setDescription(eval(client.la[ls]["cmds"]["misc"]["report"]["var2"]))
            ]
          });
      
          channelReport.send({
              embeds: [ new MessageEmbed()
                .setTitle("New BUG!")
                .setColor("RED")
                .addField("Author", message.author.toString(), true)
                .addField("Guild", message.guild.name, true)
                .addField("Report", query)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter(client.getFooter(es))
            ],
          });
          return message.reply(eval(client.la[ls]["cmds"]["misc"]["report"]["var3"]))
    }
  }