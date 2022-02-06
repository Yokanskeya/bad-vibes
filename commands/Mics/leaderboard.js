const {
    MessageEmbed,
    MessageAttachment
  } = require("discord.js")
const canvacord = require("canvacord");
const Canvas = require("canvas");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const url = require(`${process.cwd()}/botconfig/url.json`);
const {
    delay
} = require(`${process.cwd()}/handlers/functions`)
module.exports = {
    name: "leaderboard",
    category: "Mics",
    aliases: [],
    usage: "leaderboard",
    description: "Show a leaderboard leveling system by Bad Vibes",
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
        //some databasing and math
      const filtered = client.points.filter(p => p.guild === message.guild.id).array();
      const sorted = filtered.sort((a, b) => b.points - a.points);
      const top10 = sorted.splice(0, 10);
      const embed = new MessageEmbed()
      .setColor(es.color)
      .setFooter(client.getFooter(es))
      .setThumbnail(es.thumb ? es.footericon : null)
      .setAuthor(client.getAuthor(message.guild.name, url.img.icon, url.website.web))
      .setTitle(`Top 10 Ranking:`)
      .setTimestamp()

      //set counter to 0
      let i = 0;
      //get rank 
      for (const data of top10) {
        await delay(15); try {
          i++;
          embed.addField(`**${i}**. ${client.users.cache.get(data.user).tag}`, `Level: \`${data.level}\` | Points: \`${Math.floor(data.points * 100) / 100}\``);
        } catch {
          i++; //if usernot found just do this
          embed.addField(`**${i}**. ${client.users.cache.get(data.user)}`, `Level: \`${data.level}\` | Points: \`${Math.floor(data.points * 100) / 100}\``);
        }
      }
      //schick das embed
      return message.channel.send({embeds : [embed]});
    }   
}