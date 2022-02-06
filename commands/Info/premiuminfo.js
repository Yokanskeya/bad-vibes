const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed`);
const emoji = require(`../../botconfig/emojis.json`);
const url = require('../../botconfig/url.json')
const redeem = require('../../botconfig/redeem.json');
const day = require("dayjs");
const PremiumSchema = require('../../databases/premium');

module.exports = {
    name: "premiuminfo",
    category: "Info",
    aliases: ["premium-info", "premi-info", "premiinfo"],
    cooldown: 5,
    usage: "premiuminfo",
    description: "Get information about Bad Vibes Premium!",
    type: "server",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
        let btn = new MessageButton().setStyle('LINK').setEmoji(emoji.kucluck.logoCoin).setLabel(client.la[ls].cmds.info.premiuminfo.variabel1).setURL(url.website.premium);

        let row = new MessageActionRow().addComponents([
            btn
        ])
        
        let msg = new MessageEmbed()
        .setColor(es.color)
        .setFooter(client.getFooter(es))
        .setAuthor(client.getAuthor(client.user.username, url.img.coin, url.website.web))
        .setTitle(client.la[ls].cmds.info.premiuminfo.title1)
        .setThumbnail(url.img.coin)
        .setDescription(client.la[ls].cmds.info.premiuminfo.description1)
        .setImage("https://cdn.discordapp.com/attachments/939276089220542464/939325134676819968/unknown.png")
        
        .setTimestamp()

        var tempmsg = await message.channel.send({
            embeds: [msg],
            components: [row]
        })
    }
}