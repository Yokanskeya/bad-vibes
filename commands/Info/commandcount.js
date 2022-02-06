const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const url = require('../../botconfig/url.json');
const {
  duration,
  nFormatter,
  handlemsg
} = require(`${process.cwd()}/handlers/functions`)
const moment = require("moment")
const fs = require('fs')
module.exports = {
  name: "commandcount",
  category: "Info",
  aliases: ["cmdcount"],
  usage: "commandcount",
  description: "Shows the Amount of Commands",
  type: "bot",
  cooldown: 5,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let tempmsg = await message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setAuthor(client.getAuthor(handlemsg(client.la[ls].cmds.info.commandcount.tempmsg), url.img.loading, url.website.web))
      ]
    })
    let lines = 0
    let letters = 0
    var walk = function(dir) {
      var results = [];
      var list = fs.readdirSync(dir);
      list.forEach(function(file) {
        file = dir + '/' + file;
        if (!file.includes("node_modules")) {
          var stat = fs.statSync(file);
          if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
          } else {
            results.push(file);
          }
        }
      });
      return results;
    }
    for (const source of walk(process.cwd())) {
      try {
        let data = await fs.readFileSync(source, 'utf8')
        letters += await data.length;
        lines += await data.split('\n').length;
      } catch {}
    }

    await tempmsg.edit({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle(handlemsg(client.la[ls].cmds.info.commandcount.title, {
          cmdcount: client.commands.size
        }) + ` | **[\`${client.slashCommands.size}\`] Slashcommands**`)
        .setDescription(handlemsg(client.la[ls].cmds.info.commandcount.description, {
          catcount: client.categories.length,
          lines: lines,
          letters: nFormatter(letters, 4)
        }))
      ]
    });

  }
}