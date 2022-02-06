const { MessageEmbed } = require("discord.js");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const GreetingSchema = require('../../databases/greetingmsg');
const SettingsSchema = require('../../databases/settings');
const ee = require('../../botconfig/embed')
const url = require('../../botconfig/url.json')

module.exports = {
    name: "setup-greeting",
    category: `Settings`,
    aliases: ["greetingset", "greetingsetup"],
    cooldown: 10,
    usage: "greetingset <#text-channel> <messages>",
    description: "Setting your welcome message in your server",
    memberpermissions: ["ADMINISTRATOR"],
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
        const channel = message.mentions.channels.first();
        const msg = args.slice(1).join(' ')

        if (!channel) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setThumbnail(es.thumb ? url.img.ERROR : null)
                    .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["err"]["var1"]))
                    .addField(eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["err"]["var2"]), eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["err"]["var2x"]))
                    .addField(eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["err"]["var3"]), eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["err"]["var3x"]))
                    .addField(eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["err"]["var4"]), eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["err"]["var4x"]))
                ],
            })
        }
        if (!msg) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setThumbnail(es.thumb ? url.img.ERROR : null)
                    .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["err"]["var1"]))
                    .addField(eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["err"]["var2"]), eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["err"]["var2x"]))
                    .addField(eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["err"]["var3"]), eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["err"]["var3x"]))
                    .addField(eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["err"]["var4"]), eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["err"]["var4x"]))
                ],
            })
        }

        GreetingSchema.findOne({ GuildId: message.guild.id }, async (err, data) => {
            if(!data) {
                new GreetingSchema({
                    GuildId: message.guild.id,
                    ChannelId: channel.id,
                    Message: msg,
                    // Channelmsg: channel2
                }).save();
                SettingsSchema.findOne({ GuildId: message.guild.id }, async (err, ss) => {
                    if (ss) {
                        if (!ss.Greeting) {
                            ss.Greeting = true;
                            await ss.save();
                        } else if (ss.Greeting === false) {
                            ss.Greeting = true;
                            await ss.save();
                        }
                    }
                });
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(es.color)
                        .setThumbnail(es.thumb ? es.footericon : null)
                        .setFooter(client.getFooter(es))
                        .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["var1"]))
                        .setDescription(eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["var2"]))
                    ],
                });
            } else {
                data.ChannelId = await data.ChannelId;
                data.Message = await data.Message;
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setThumbnail(es.thumb ? url.img.ERROR : null)
                        .setFooter(client.getFooter(es))
                        .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["var3"]))
                        .setDescription(eval(client.la[ls]["cmds"]["settings"]["setup-greeting"]["var4"]))
                    ],
                });
            }
        });
    }
};