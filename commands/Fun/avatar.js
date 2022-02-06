const { MessageEmbed} = require('discord.js');

module.exports = {
    name: "avatar",
    aliases: ["ava"],
    category: "Fun",
    description: "Showing your discord member avatars.",
    usage: "avatar @user",
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
        if (!message.mentions.users.first()) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setTitle("Your avatar:")
                    .setImage(message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setColor("RANDOM")
                    .setFooter(client.getFooter(es))
                ],
            });
        } else {
            const user = message.mentions.users.first();
            
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setTitle(`${user.tag}'s avatar`)
                    .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setColor("RANDOM")
                    .setFooter(client.getFooter(es))
                ],
            });
        };
    }
};