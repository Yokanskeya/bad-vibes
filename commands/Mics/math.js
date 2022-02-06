const { MessageEmbed} = require('discord.js');
const math = require("mathjs");
const url = require('../../botconfig/url.json')

module.exports = {
    name: "math",
    aliases: ["calculator", "calculation"],
    category: "Mics",
    description: "Help you to calculate",
    usage: "math <calculation>",
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
        let content = args.join(' ');
        if (!content) {
        return message.reply({
            embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setThumbnail(es.thumb ? url.img.ERROR : null)
                .setTitle(eval(client.la[ls]["cmds"]["misc"]["math"]["var1"]))
                .addField(eval(client.la[ls]["cmds"]["misc"]["math"]["var2"]), eval(client.la[ls]["cmds"]["misc"]["math"]["var2x"]))
                .setTimestamp()
            ],
        });
        }
        message.reply(`**${math.evaluate(content)}**`);
    }
};