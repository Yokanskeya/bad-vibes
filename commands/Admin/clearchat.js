const { MessageEmbed } = require ('discord.js');
const emoji = require('../../botconfig/emojis.json');
const ee = require('../../botconfig/embed')
const config = require ('../../botconfig/config.json');
const url = require ('../../botconfig/url.json');

module.exports = {
    name: "clearchat",
    aliases: ["cc", "endchat"],
    category: "Admin",
    description: "Delete some messages that are on the text channel you choose message limit 99 and less than 14 days.",
    usage: "clearchat <1-99>",
    memberpermissions: [`ADMINISTRATOR`],
    type: "server",
    cooldown: 5,
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => { 
        if (parseInt(args[0]) > 99) 
        return message.reply({
            embeds: [ new MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(eval(client.la[ls]["cmds"]["admin"]["clearchat"]["variable1"]))
            ],
        });
        if (!args[0]) {
            let themsg = message.reply({
                embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTitle(eval(client.la[ls]["cmds"]["admin"]["clearchat"]["variable2"]))
                  .setDescription(eval(client.la[ls]["cmds"]["admin"]["clearchat"]["variable3"]))
                ]
              }).then((msg) => {
                msg.channel.awaitMessages({
                    filter: m => m.author.id === message.author.id,
                    max: 1,
                    time: 30 * 1000,
                    errors: ['time']
                  })
                  .then(async collected => {
                    if (collected.first().content.toLowerCase() === `yes`) {

                        message.channel.bulkDelete(99)
                        .then(async () => {
                            const success = await message.channel.send({
                                embeds: [ new MessageEmbed()
                                    .setColor(es.color)
                                    .setTitle(eval(client.la[ls]["cmds"]["admin"]["clearchat"]["variable4"]))
                                ],
                            }).then(
                                setTimeout(() => {
                                    success.delete()
                                }, 4000)
                            );
                        }).catch(e => {
                            return message.channel.send({
                                embeds: [ new MessageEmbed()
                                    .setColor(es.color)
                                    .setTitle(eval(client.la[ls]["cmds"]["admin"]["clearchat"]["variable5"]))
                                    .setDescription(eval(client.la[ls]["cmds"]["admin"]["clearchat"]["variable6"]))
                                ],
                            })
                        })
                    }
                  }).catch(e => {
                    message.channel.send({
                        embeds: [new MessageEmbed()
                          .setColor(es.wrongcolor)
                          .setTitle(eval(client.la[ls]["cmds"]["admin"]["clearchat"]["variable7"]))
                        ]
                    });
                })
            });
        } else {
            message.channel.bulkDelete(parseInt(args[0]) + 1)
            .then(async () => {
                const success = await message.channel.send({
                    embeds: [ new MessageEmbed()
                        .setColor(es.color)
                        .setTitle(eval(client.la[ls]["cmds"]["admin"]["clearchat"]["variable8"]))
                    ],
                }).then(
                    setTimeout(() => {
                        success.delete()
                    }, 4000)
                );
            }).catch(e => {
                return message.channel.send({
                    embeds: [ new MessageEmbed()
                        .setColor(es.color)
                        .setTitle(eval(client.la[ls]["cmds"]["admin"]["clearchat"]["variable9"]))
                        .setDescription(eval(client.la[ls]["cmds"]["admin"]["clearchat"]["variable10"]))
                    ],
                })
            });
        }
    }
};