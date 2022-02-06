const got = require('got');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "meme",
    aliases: ["memes"],
    category: "Fun",
    description: "Sends an epic meme.",
    usage: "meme",
    type: "bot",
    run: async (client, message, args) => {
        got('https://meme-api.herokuapp.com/gimme').then(res => {
            let content = JSON.parse(res.body)
            message.reply(
                {embeds: [new MessageEmbed()
                    .setTitle(content.title)
                    .setImage(content.url)
                    .setColor("RANDOM")
                    .setFooter(`${content.subreddit} ${content.postlink}`)]}
            )
        })
    }
}