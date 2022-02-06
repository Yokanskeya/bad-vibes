const { MessageEmbed, MessageSelectMenu, MessageActionRow, Message } = require ('discord.js');
const emoji = require('../../botconfig/emojis.json');
const ee = require('../../botconfig/embed')
const config = require ('../../botconfig/config.json');
module.exports = {
    name: "setup-regionvc",
    aliases: ["regionvc"],
    category: `Settings`,
    description: "Change the RTC Region in voice channels",
    usage: "regionvc",
    memberpermissions: [`ADMINISTRATOR`],
    type: "bot",
    cooldown: 5,
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => { 
        const { channel } = message.member.voice;
        if (!channel) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["var1"]))
                ]
            })
        }

        let region = {
            "automatic" : 'Automatic',
            "brazil" : 'Brazil',
            "hongkong" : 'Hongkong',
            "india" : 'India',
            "japan" : 'Japan',
            "rotterdam" : 'Rotterdam',
            "russia" : 'Russia',
            "singapore" : 'Singapore',
            "southafrica" : 'South Africa',
            "sydney" : 'Sydney',
            "us_west" : 'US West',
            "us_central" : 'US Central',
            "us_east" : 'US East',
            "us_south" : 'US South',
        }

        let menuoptions = [
            {
                value: region.automatic,
                description: "Change the region RTC to (Automatic)",
                emoji: emoji.kucluck.number.kosong
            },
            {
                value: region.brazil,
                description: "Change the region RTC to (Brazil)",
                emoji: emoji.kucluck.number.satu
            },
            {
                value: region.hongkong,
                description: "Change the region RTC to (Hongkong)",
                emoji: emoji.kucluck.number.dua
            },
            {
                value: region.india,
                description: "Change the region RTC to (India)",
                emoji: emoji.kucluck.number.tiga
            },
            {
                value: region.japan,
                description: "Change the region RTC to (Japan)",
                emoji: emoji.kucluck.number.empat
            },
            {
                value: region.rotterdam,
                description: "Change the region RTC to (Rotterdam)",
                emoji: emoji.kucluck.number.lima
            },
            {
                value: region.russia,
                description: "Change the region RTC to (Russia)",
                emoji: emoji.kucluck.number.enam
            },
            {
                value: region.singapore,
                description: "Change the region RTC to (Singapore)",
                emoji: emoji.kucluck.number.tujuh
            },
            {
                value: region.southafrica,
                description: "Change the region RTC to (South Africa)",
                emoji: emoji.kucluck.number.delapan
            },
            {
                value: region.sydney,
                description: "Change the region RTC to (Sydney)",
                emoji: emoji.kucluck.number.sembilan
            },
            {
                value: region.us_west,
                description: "Change the region RTC to (US West)",
                emoji: emoji.kucluck.number.sepuluh
            },
            {
                value: region.us_central,
                description: "Change the region RTC to (US Central)",
                emoji: emoji.kucluck.number.sebelas
            },
            {
                value: region.us_east,
                description: "Change the region RTC to (US East)",
                emoji: emoji.kucluck.number.duabelas
            },
            {
                value: region.us_south,
                description: "Change the region RTC to (US South)",
                emoji: emoji.kucluck.number.tigabelas
            },
        ]

        let MenuEmbed = new MessageEmbed()
        .setColor(es.color)
        .setFooter(client.getFooter(es))
        .setThumbnail(es.thumb ? es.footericon : null)
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["var2"]))

        let Selection = new MessageSelectMenu()
        .setPlaceholder(`Click me to select the region RTC!`)
        .setCustomId('MenuSelection')
        .setMaxValues(1).setMinValues(1)
        .addOptions(
            menuoptions.map(option => {
                let Obj = {
                label: option.label ? option.label.substr(0, 50) : option.value.substr(0, 50),
                value: option.value.substr(0, 50),
                description: option.description.substr(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
        )

        let menumsg = await message.reply({
            embeds: [MenuEmbed],
            components: [new MessageActionRow().addComponents(Selection)]
        })

        let used1 = false;

        //function to handle the menuselection
        function menuselection(menu) {
            let menuoptiondata = menuoptions.find(v => v.value == menu.values[0])
            let menuoptionindex = menuoptions.findIndex(v => v.value == menu.values[0])
            if (menu.values[0] == "Cancel") 
            return menu.reply(`${emoji.msg.SUCCESS}`)
            menu.deferUpdate();
            used1 = true;
            handle_the_picks(menuoptionindex, menuoptiondata)
        }
        //Event
        client.on('interactionCreate', (menu) => {
            if (menu.message.id === menumsg.id) {
                if (menu.user.id === cmduser.id) {
                    if (used1) return menu.reply({
                        content: eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["var3"]),
                        ephemeral: true
                    })
                    menuselection(menu);
                } else menu.reply({
                    content: eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["var4"]),
                    ephemeral: true
                });
            }
        });

        async function handle_the_picks(menuoptionindex, menuoptiondata) {
            switch (menuoptionindex) {
                case 0: {
                    message.react(emoji.react.SUCCESS)
                    channel.setRTCRegion();
                    return menumsg.edit({
                        embeds: [new MessageEmbed()
                            .setColor(es.succescolor)
                            .setFooter(client.getFooter(es))
                            .setThumbnail(es.thumb ? es.footericon : null)
                            .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["succes"]))
                        ],
                        components: []
                    })
                }
                case 1: {
                    message.react(emoji.react.SUCCESS)
                    channel.setRTCRegion('brazil');
                    return menumsg.edit({
                        embeds: [new MessageEmbed()
                            .setColor(es.succescolor)
                            .setFooter(client.getFooter(es))
                            .setThumbnail(es.thumb ? es.footericon : null)
                            .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["succes"]))
                        ],
                        components: []
                    })
                }
                case 2: {
                    message.react(emoji.react.SUCCESS)
                    channel.setRTCRegion('hongkong');
                    return menumsg.edit({
                        embeds: [new MessageEmbed()
                            .setColor(es.succescolor)
                            .setFooter(client.getFooter(es))
                            .setThumbnail(es.thumb ? es.footericon : null)
                            .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["succes"]))
                        ],
                        components: []
                    })
                }
                case 3: {
                    message.react(emoji.react.SUCCESS)
                    channel.setRTCRegion('india');
                    return menumsg.edit({
                        embeds: [new MessageEmbed()
                            .setColor(es.succescolor)
                            .setFooter(client.getFooter(es))
                            .setThumbnail(es.thumb ? es.footericon : null)
                            .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["succes"]))
                        ],
                        components: []
                    })
                }
                case 4: {
                    message.react(emoji.react.SUCCESS)
                    channel.setRTCRegion('japan');
                    return menumsg.edit({
                        embeds: [new MessageEmbed()
                            .setColor(es.succescolor)
                            .setFooter(client.getFooter(es))
                            .setThumbnail(es.thumb ? es.footericon : null)
                            .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["succes"]))
                        ],
                        components: []
                    })
                }
                case 5: {
                    message.react(emoji.react.SUCCESS)
                    channel.setRTCRegion('rotterdam');
                    return menumsg.edit({
                        embeds: [new MessageEmbed()
                            .setColor(es.succescolor)
                            .setFooter(client.getFooter(es))
                            .setThumbnail(es.thumb ? es.footericon : null)
                            .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["succes"]))
                        ],
                        components: []
                    })
                }
                case 6: {
                    message.react(emoji.react.SUCCESS)
                    channel.setRTCRegion('russia');
                    return menumsg.edit({
                        embeds: [new MessageEmbed()
                            .setColor(es.succescolor)
                            .setFooter(client.getFooter(es))
                            .setThumbnail(es.thumb ? es.footericon : null)
                            .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["succes"]))
                        ],
                        components: []
                    })
                }
                case 7: {
                    message.react(emoji.react.SUCCESS)
                    channel.setRTCRegion('singapore');
                    return menumsg.edit({
                        embeds: [new MessageEmbed()
                            .setColor(es.succescolor)
                            .setFooter(client.getFooter(es))
                            .setThumbnail(es.thumb ? es.footericon : null)
                            .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["succes"]))
                        ],
                        components: []
                    })
                }
                case 8: {
                    message.react(emoji.react.SUCCESS)
                    channel.setRTCRegion('southafrica');
                    return menumsg.edit({
                        embeds: [new MessageEmbed()
                            .setColor(es.succescolor)
                            .setFooter(client.getFooter(es))
                            .setThumbnail(es.thumb ? es.footericon : null)
                            .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["succes"]))
                        ],
                        components: []
                    })
                }
                case 9: {
                    message.react(emoji.react.SUCCESS)
                    channel.setRTCRegion('sydney');
                    return menumsg.edit({
                        embeds: [new MessageEmbed()
                            .setColor(es.succescolor)
                            .setFooter(client.getFooter(es))
                            .setThumbnail(es.thumb ? es.footericon : null)
                            .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["succes"]))
                        ],
                        components: []
                    })
                }
                case 10: {
                    message.react(emoji.react.SUCCESS);
                    channel.setRTCRegion('us-west');
                    return menumsg.edit({
                        embeds: [new MessageEmbed()
                            .setColor(es.succescolor)
                            .setFooter(client.getFooter(es))
                            .setThumbnail(es.thumb ? es.footericon : null)
                            .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["succes"]))
                        ],
                        components: []
                    })
                }
                case 11: {
                    message.react(emoji.react.SUCCESS)
                    channel.setRTCRegion('us-central');
                    return menumsg.edit({
                        embeds: [new MessageEmbed()
                            .setColor(es.succescolor)
                            .setFooter(client.getFooter(es))
                            .setThumbnail(es.thumb ? es.footericon : null)
                            .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["succes"]))
                        ],
                        components: []
                    })
                }
                case 12: {
                    message.react(emoji.react.SUCCESS)
                    channel.setRTCRegion('us-east');
                    return menumsg.edit({
                        embeds: [new MessageEmbed()
                            .setColor(es.succescolor)
                            .setFooter(client.getFooter(es))
                            .setThumbnail(es.thumb ? es.footericon : null)
                            .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["succes"]))
                        ],
                        components: []
                    })
                }
                case 13: {
                    message.react(emoji.react.SUCCESS)
                    channel.setRTCRegion('us-south');
                    return menumsg.edit({
                        embeds: [new MessageEmbed()
                            .setColor(es.succescolor)
                            .setFooter(client.getFooter(es))
                            .setThumbnail(es.thumb ? es.footericon : null)
                            .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-regionvc"]["succes"]))
                        ],
                        components: []
                    })
                }
            }
        }
    }   
};