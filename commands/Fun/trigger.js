const { MessageEmbed, MessageAttachment} = require('discord.js');
const canva = require('canvacord');

module.exports = {
    name: "trigger",
    aliases: [],
    category: "Fun",
    description: "Trigger yourself or the mentioned user",
    usage: "trigger",
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
        const { member, mentions } = message

                const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
              let xavatar = target.user.displayAvatarURL({dynamic: false, format: "png"})

        
                let ximage = await canva.Canvas.trigger(xavatar)

                let xtriggered = new MessageAttachment(ximage, "triggered.gif")
                
                message.reply({files: [xtriggered]})
    }
}