const Discord = require("discord.js")
const {
  MessageEmbed
} = require("discord.js")
const config = require(`${process.cwd()}/botconfig/config.json`);
const settings = require(`${process.cwd()}/botconfig/settings.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const ss = require('../databases/settings');
module.exports = async (client, message, args, type, slashCommand = false, extras = false) => {
  let method = type.includes(":") ? type.split(":") : Array(type)
  if (!message.guild) return;
  //start typing
  //just visual for the console
  let ssSchema = await ss.findOne({ GuildId: message.guild.id });
  let ls = ssSchema.Language;
  let es = ssSchema.Embed;

  let {
    channel
  } = message.member.voice;
  const permissions = channel.permissionsFor(client.user);

  if (!permissions.has("CONNECT")) {
    if (slashCommand) {
      return slashCommand.reply({
        ephemeral: true,
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["handlers"]["playermanagerjs"]["playermanager"]["variable1"]))
        ]
      }).catch((e) => console.log(String(e).grey));
    }
    return message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["handlers"]["playermanagerjs"]["playermanager"]["variable1"]))
      ]
    }).catch((e) => console.log(String(e).grey));
  }

  if (!permissions.has("SPEAK")) {
    if (slashCommand) {
      return slashCommand.reply({
        ephemeral: true,
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["handlers"]["playermanagerjs"]["playermanager"]["variable2"]))
        ]
      }).catch((e) => console.log(String(e).grey));
    }
    return message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["handlers"]["playermanagerjs"]["playermanager"]["variable2"]))
      ]
    }).catch((e) => console.log(String(e).grey));
  }

  if (method[0] === "song") {
    require("./playermanagers/song")(client, message, args, type, slashCommand, extras);
  } else if (method[0] === "request") {
    require("./playermanagers/request")(client, message, args, type, slashCommand);
  } else if (method[0] === "playlist") {
    require("./playermanagers/playlist")(client, message, args, type, slashCommand);
  } else if (method[0] === "similar") {
    require("./playermanagers/similar")(client, message, args, type, slashCommand);
  } else if (method[0] === "search") {
    require("./playermanagers/search")(client, message, args, type, slashCommand);
  } else if (method[0] === "skiptrack") {
    require("./playermanagers/skiptrack")(client, message, args, type, slashCommand);
  } else if (method[0] === "playtop") {
    require("./playermanagers/playtop")(client, message, args, type, slashCommand)
  } else {
    if (slashCommand) {
      return slashCommand.reply({
        ephemeral: true,
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["handlers"]["playermanagerjs"]["playermanager"]["variable3"]))
        ]
      }).catch((e) => console.log(String(e).grey));
    }
    return message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["handlers"]["playermanagerjs"]["playermanager"]["variable3"]))
      ]
    }).catch((e) => console.log(String(e).grey));
  }
}