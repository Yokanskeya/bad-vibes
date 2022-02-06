const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed`);
const emoji = require(`../../botconfig/emojis.json`);
const url = require('../../botconfig/url.json')
const redeem = require('../../botconfig/redeem.json');
const day = require("dayjs");
const PremiumSchema = require('../../databases/premium');

module.exports = {
    name: "premiumlist",
    category: "Info",
    aliases: ["premiumguildlist"],
    cooldown: 10,
    usage: "premiumlist",
    description: "Get the listing Premium Guild",
    type: "server",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
        PremiumSchema.find({ }, async (err, data) =>{
            let msg = await message.reply({
                embeds: [new MessageEmbed()
                    .setColor(es.succescolor)
                    .setTitle(client.la[ls].cmds.info.premiumlist.title1)
                ]
            })
            if (data) {
                const premiums = Object.keys(data)
                .map((value, index) => {
                    const expired = data[value].DateExp
                    return `${index + 1}. **${data[value].GuildName}** (${data[value].GuildId}) \n*${client.la[ls].cmds.info.premiumlist.variable1} (${expired ? expired : `${client.la[ls].cmds.info.premiumlist.variable2}` })*`;
                })
                .join("\n\n");

                return msg.edit({
                    embeds: [new MessageEmbed()
                        .setColor(es.succescolor)
                        .setTitle(client.la[ls].cmds.info.premiumlist.title2)
                        .setDescription(premiums)
                    ]
                });
            }
        })
    }
}