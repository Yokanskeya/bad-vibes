const { MessageEmbed } = require("discord.js");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const GreetingSchema = require('../../databases/greetingmsg');
const SettingsSchema = require('../../databases/settings');
const ee = require('../../botconfig/embed')

module.exports = {
    name: "togglegreeting",
    category: `Settings`,
    aliases: ["tglgreeting", "greeting"],
    cooldown: 10,
    usage: "togglegreeting",
    description: "Enable or disable Greeting Messages when new members join the server. Default [DISABLE].",
    memberpermissions: ["ADMINISTRATOR"],
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
        let greeting = await client.Greetingmsg.findOne({ GuildId: message.guild.id });
        if (!greeting) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setThumbnail(es.thumb ? es.footericon : null)
                    .setTitle(eval(client.la[ls]["cmds"]["settings"]["togglegreeting"]["var1"]))
                    .setDescription(eval(client.la[ls]["cmds"]["settings"]["togglegreeting"]["var2"]))
                ]
            })
        }
        SettingsSchema.findOne({ GuildId: message.guild.id }, async (err, ss) => {
            if (ss) {
                if (!ss.Greeting) {
                    ss.Greeting = true;
                    await ss.save();
                } else {
                    ss.Greeting = false;
                    await ss.save();
                }
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                        .setThumbnail(es.thumb ? es.footericon : null)
                        .setTitle(`${emoji.msg.SUCCESS} Greeting Message Successfully __${ss.Greeting ? `ENABLED` : `DISABLED`}__ `)
                        .setDescription(`Now i will ${ss.Greeting ? `` : `not`} send Greeting Message if a new members joined!`)
                    ],
                });
            }
        });
    }
};