const { MessageEmbed } = require("discord.js");
const moment = require('moment')
const url = require('../../botconfig/url.json');
module.exports = {
    name: "serverinfo",
    category: "Info",
    aliases: ["si", "infoserver"],
    cooldown: 10,
    usage: "serverinfo",
    description: "Get the all information your server",
    type: "server",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
        let embed = new MessageEmbed()
            .setColor(es.color)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setAuthor(client.getAuthor(message.guild.name + " Information", es.footericon, `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=identify%20email%20guilds%20bot%20applications.commands`))
            .setDescription(`\`\`\`yml\nServer Name: ${message.guild.name}\nServer ID: ${message.guild.id}\nOwner: ${(await message.client.users.fetch(message.guild.ownerId)).tag}\nServer Create at: ${moment(message.guild.createdTimestamp).format('LLL')} \`\`\``)
            .addField(`🧑‍🤝‍🧑 Members Count`, `\`\`\`yml\nUsers: ${message.guild.members.cache.filter(member => !member.user.bot).size.toString()}\nBots: ${message.guild.members.cache.filter(member => member.user.bot).size.toString()}\nTotal: ${message.guild.memberCount.toString()}\`\`\``, true)
            .addField(`🗣️ Channels`,`\`\`\`yml\nCategory: ${message.guild.channels.cache.filter(channel => channel.type === 'GUILD_CATEGORY').size.toString()}\nText: ${message.guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size.toString()}\nVoice: ${message.guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size.toString()}\`\`\``, true)
            .addField(`🛡️ Roles:`, `\`\`\`yml\nAdmins: ${message.guild.roles.cache.filter(role => role.permissions.has('ADMINISTRATOR')).size.toString()}\nTotal: ${message.guild.roles.cache.size.toString()}\`\`\``)
            .addField(`🖼️ Emojis`, `\`\`\`yml\nNon-Animated: ${message.guild.emojis.cache.size.toString()}\nAnimated: ${message.guild.emojis.cache.filter(emoji => emoji.animated).size.toString()}\`\`\``, true)
            .addField(`🚀 Boosted:`, `\`\`\`yml\nBoost Level: ${message.guild.premiumTier.toString()}\nTotal Boosts: ${message.guild.premiumSubscriptionCount.toString()}\`\`\``)
            .setFooter(client.getFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true})))
        message.channel.send({embeds: [embed]});
    }
}