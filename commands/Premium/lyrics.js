const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");
const lyricsFinder = require("lyrics-finder");
const pagination = require('../../handlers/pagination')
const _ = require("lodash");
const premiums = ("", "");
const url = require('../../botconfig/url.json')

module.exports = {
  name: "lyrics",
  category: `Premium`,
  description: "Shows the lyrics of the song searched.",
  usage: "[Song Name]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["ly"],
  premium: true,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let SongTitle = args.join(" ");
    let SearchString = args.join(" ");
    if (!args[0] && !player)
      return message.reply({
        embeds: [new MessageEmbed() 
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setThumbnail(es.thumb ? url.img.ERROR : null)
          .setTitle(client.la[ls]["cmds"]["premium"]["lyrics"]["var1"])
        ]
      });
    if (!args[0]) SongTitle = player.queue.current.title;
    SongTitle = SongTitle.replace(
      /lyrics|lyric|lyrical|official music video|\(official music video\)|audio|official|official video|official video hd|official hd video|offical video music|\(offical video music\)|extended|hd|(\[.+\])/gi,
      ""
    );

    let lyrics = await lyricsFinder(SongTitle);
    if (!lyrics)
    return message.reply({
      embeds: [new MessageEmbed() 
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setThumbnail(es.thumb ? url.img.ERROR : null)
        .setTitle(eval(client.la[ls]["cmds"]["premium"]["lyrics"]["var2"]))
      ]
    });
    lyrics = lyrics.split("\n"); //spliting into lines
    let SplitedLyrics = _.chunk(lyrics, 40); //45 lines each page

    var pages = SplitedLyrics.map((ly) => {
      let em = 
        new MessageEmbed()
          .setAuthor(client.getAuthor(`Lyrics for: ${SongTitle}`, url.img.icon))
          .setColor(es.color)
          .setDescription(ly.join("\n"))
        

      if (args.join(" ") !== SongTitle)
        em.setThumbnail(player.queue.current.displayThumbnail());

      return em;
    });

    // if (!pages.length || pages.length === 1)
      return message.reply({ embeds : [pages[0]]});
    // else return pagination(client, message, { embeds : [pages[0]]});
  },
};
