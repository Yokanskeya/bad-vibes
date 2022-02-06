const { MessageEmbed, Util } = require ('discord.js');
const Schema = require('../../databases/reaction-roles');
const emojis = require('../../botconfig/emojis.json');
const ee = require('../../botconfig/embed');
const url = require ('../../botconfig/url.json');

module.exports = {
    name: "setup-reactionrole",
    aliases: ["react-add", "reactadd", "roleadd", "role-add"],
    category: `Settings`,
    description: "Add roles in database bot",
    usage: "react-role-add <@roles> <emoji> <description>",
    memberpermissions: [`ADMINISTRATOR`],
    type: "bot",
    cooldown: 10,
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => { 
        let role = await message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

        if (!role) return message.reply({
            embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setThumbnail(es.thumb ? url.img.ERROR : null)
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-reactionrole"]["var1"]))
            ],
        });

        let myrole = message.guild.roles.cache.find(role => role.name == client.user.username);
        let [, emoji] = args;
        // checking role position
        try {
            if (role.position > myrole.position) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setThumbnail(es.thumb ? url.img.ERROR : null)
                        .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-reactionrole"]["var2"]))
                        .setDescription(eval(client.la[ls]["cmds"]["settings"]["setup-reactionrole"]["var3"]))
                    ],
                })
            }
        } catch (e) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setThumbnail(es.thumb ? url.img.ERROR : null)
                    .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-reactionrole"]["var4"]))
                    .setDescription(eval(client.la[ls]["cmds"]["settings"]["setup-reactionrole"]["var5"]))
                ]
            })
        }
        if (!emoji) return message.reply({
            embeds:[ new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setThumbnail(es.thumb ? url.img.ERROR : null)
                .setAuthor(client.getAuthor(eval(client.la[ls]["cmds"]["settings"]["setup-reactionrole"]["var6"])))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["setup-reactionrole"]["var7"]))
            ],
        });

        let rolename = args.slice(2).join(' ');

        if(!rolename) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setThumbnail(es.thumb ? url.img.ERROR : null)
                    .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-reactionrole"]["var8"]))
                    .setDescription(eval(client.la[ls]["cmds"]["settings"]["setup-reactionrole"]["var9"]))
                ]
            })
        }

        const parsedEmoji = Util.parseEmoji(emoji);
    
        Schema.findOne({ GuildId: message.guild.id }, async (err, data) => {
            if (data) {
                data.RolesId[parsedEmoji.name] = [
                    role.id,
                    {
                        id: parsedEmoji.id,
                        raw: emoji,
                        name: rolename,
                    },
                ];
                await Schema.findOneAndUpdate({ GuildId: message.guild.id }, data);
            } else {
                new Schema({
                    GuildId: message.guild.id,
                    Message: 0,
                    RolesId: {
                        [parsedEmoji.name]: [
                            role.id,
                            {
                                id: parsedEmoji.id,
                                raw: emoji,
                                name: rolename,
                            },
                        ],
                    },
                }).save();
            }

            message.reply({
                embeds: [ new MessageEmbed()
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                    .setThumbnail(es.thumb ? es.footericon : null)
                    .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-reactionrole"]["var10"]))
                ],
            });
        });
    }
};