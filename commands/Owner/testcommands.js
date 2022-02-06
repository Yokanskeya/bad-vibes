const { MessageEmbed } = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const url = require(`${process.cwd()}/botconfig/url.json`);
const ee = require(`${process.cwd()}/botconfig/embed`);

module.exports = {
    name: `testcmd`,
    type: "info",
    category: "Owner",
    aliases: [`tc`],
    description: `Restart bot`,
    usage: `resetbot`,
    cooldown: 0,
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
        const embed = new MessageEmbed()
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(`LUMINOUS_VIVID_PINK`)
        .setTitle(`<:K_logo:917295875619962880> Hai, ${client.user.username} here! <:K_logo:917295875619962880>`)
        .setDescription(`❓ Run \`${config.prefix}help\` to the see all commands I have. \n\n💿 Run \`${config.prefix}setup-music\` for Setup a Music Request Channel. \n\n🤖 Run \`${config.prefix}adddj\` for setting DJ Role. \n\n🎶 Want to listen to music? Run \`${config.prefix}play\`.`)
        .addFields(
        {
            name: "🌐",
            value: `┕[[Website]](${url.website.web})`,
            inline: true,
        },
        {
            name: "🏠",
            value: `┕[[Support]](${url.website.supportserver})`,
            inline: true,
        },
        {
            name: `<:K_logo:917295875619962880>`,
            value: `┕[[Invite]](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=identify%20email%20guilds%20bot%20applications.commands)`,
            inline: true,
        }
        )
        .setFooter(client.getFooter(`${client.user.username} | By: Lukman_Nov#5797`))
        .setTimestamp()

        message.channel.send({
            embeds : [embed]
        })
    }
}