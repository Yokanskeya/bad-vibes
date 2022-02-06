const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed`);
const emoji = require(`../../botconfig/emojis.json`);
const url = require('../../botconfig/url.json')
const redeem = require('../../botconfig/redeem.json');
const day = require("dayjs");
const PremiumSchema = require('../../databases/premium');

module.exports = {
    name: "redeem",
    category: "Info",
    aliases: ["redeem-premium", "premium-redeem"],
    cooldown: 360,
    usage: "redeem",
    description: "Redeem code for get Kucluck Premium for free.",
    memberpermissions: [`ADMINISTRATOR`],
    type: "server",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
        PremiumSchema.findOne({ GuildId : message.guild.id}, async (err, data) => {
            if(data) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle(eval(client.la[ls].cmds.info.redeem.title1))
                        .setThumbnail(es.thumb ? url.img.coin : null)
                    ]
                })
            } else {
                const Expire = day(redeem.exp).valueOf();
                message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                        .setAuthor(client.getAuthor(client.user.username, url.img.coin, url.website.web))
                        .setTitle(eval(client.la[ls].cmds.info.redeem.title2))
                        .setDescription(eval(client.la[ls].cmds.info.redeem.description1))
                        .addFields(
                            {
                              name: client.la[ls].cmds.info.redeem.field1.title,
                              value: eval(client.la[ls].cmds.info.redeem.field1.value),
                              inline: true,
                            },
                            {
                              name: client.la[ls].cmds.info.redeem.field2.title,
                              value: eval(client.la[ls].cmds.info.redeem.field2.value),
                              inline: true,
                            },
                            {
                              name: eval(client.la[ls].cmds.info.redeem.field3.title),
                              value: eval(client.la[ls].cmds.info.redeem.field3.value),
                              inline: true,
                            }
                        )
                        .setTimestamp()
                        .setThumbnail(es.thumb ? url.img.coin : null)
                    ]
                }).then((msg) => {
                    msg.channel.awaitMessages({
                        filter: m => m.author.id === message.author.id,
                        max: 1,
                        time: 30 * 1000,
                        errors: ['time']
                      })
                      .then(async collected => {
                        if (collected.first().content.toLowerCase() === redeem.code ) {
                            if(Date.now() > Expire) {
                                return message.reply({
                                    embeds: [new MessageEmbed()
                                        .setColor(es.wrongcolor)
                                        .setFooter(client.getFooter(es))
                                        .setTitle(eval(client.la[ls].cmds.info.redeem.title3))
                                        .setDescription(eval(client.la[ls].cmds.info.redeem.description2))
                                    ]
                                });
                            } else {
                                let theowner = "NO OWNER DATA! ID: ";
                                await message.guild.fetchOwner().then(({
                                    user
                                }) => {
                                    theowner = user;
                                }).catch(() => {})
                                let embed = new MessageEmbed()
                                .setColor("GREEN")
                                .setTitle(client.la[ls].cmds.info.redeem.title4)
                                .addField("Guild Info", `>>> \`\`\`${message.guild.name} (${message.guild.id})\`\`\``)
                                .addField("Owner Info", `>>> \`\`\`${theowner ? `${theowner.tag} (${theowner.id})` : `${theowner} (${message.guild.ownerId})`}\`\`\``)
                                .addField("Member Count", `>>> \`\`\`${message.guild.memberCount}\`\`\``)
                                .addField("Requested By:", `>>> \`\`\`${message.author.tag} (${message.author.id})\`\`\``)
                                .setThumbnail(message.guild.iconURL({
                                    dynamic: true
                                }))
                                .setFooter(client.getFooter(`${message.author.id}-${message.guild.id}`, message.author.displayAvatarURL({
                                    dynamic: true
                                })))
                                .setTimestamp()
                                for (const owner of config.ownerIDS) {
                                    client.users.fetch(owner).then(user => {
                                      user.send({
                                        embeds: [embed],
                                      }).catch(() => {});
                                    }).catch(() => {});
                                  }
                                return message.reply({
                                    embeds: [new MessageEmbed()
                                        .setColor(es.color)
                                        .setFooter(client.getFooter(es))
                                        .setTitle(eval(client.la[ls].cmds.info.redeem.title5))
                                        .setDescription(eval(client.la[ls].cmds.info.redeem.description3))
                                    ]
                                });
                            }
                        } else {
                            message.channel.send({
                                embeds: [new MessageEmbed()
                                  .setColor(es.wrongcolor)
                                  .setFooter(client.getFooter(es))
                                  .setTitle(eval(client.la[ls].cmds.info.redeem.title6))
                                ]
                            });
                        }
                      }).catch(e => {
                        message.channel.send({
                            embeds: [new MessageEmbed()
                              .setColor(es.wrongcolor)
                              .setFooter(client.getFooter(es))
                              .setTitle(eval(client.la[ls].cmds.info.redeem.title7))
                            ]
                        });
                    })
                });
            }
        })
    }
}