const {
  MessageEmbed,
  MessageButton,
  MessageSelectMenu,
  MessageActionRow
} = require(`discord.js`);
const emoji = require('../../botconfig/emojis.json');
const ee = require('../../botconfig/embed')
const config = require('../../botconfig/config.json');
const settings = require('../../botconfig/settings.json');
const url = require('../../botconfig/url.json');

const {
  databasing,
  leveling
} = require(`${process.cwd()}/handlers/functions`);
const ms = require('ms');

module.exports = {
  name: "reset",
  aliases: ["hardreset", "reset-setup", "setup-reset"],
  category: `Settings`,
  description: `Resets of the Setups as well as the prefix!`,
  usage: `reset -->  Follow the Steps`,
  memberpermissions: [`ADMINISTRATOR`],
  type: "bot",
  cooldown: 10,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let menuoptions = [{
        value: 'HARD RESET',
        description: client.la[ls]["cmds"]["settings"]["reset"]["menuoptions"]["var1"],
        emoji: '0️⃣'
      },
      {
        value: 'DJ Role',
        description: client.la[ls]["cmds"]["settings"]["reset"]["menuoptions"]["var2"],
        emoji: '1️⃣'
      },
      {
        value: 'Prefix',
        description: client.la[ls]["cmds"]["settings"]["reset"]["menuoptions"]["var3"],
        emoji: '2️⃣'
      },
      {
        value: 'Music Setup',
        description: client.la[ls]["cmds"]["settings"]["reset"]["menuoptions"]["var4"],
        emoji: '3️⃣'
      },
      {
        value: 'Bot Channel Chat',
        description: client.la[ls]["cmds"]["settings"]["reset"]["menuoptions"]["var5"],
        emoji: '4️⃣'
      },
      {
        value: 'Auto Role',
        description: client.la[ls]["cmds"]["settings"]["reset"]["menuoptions"]["var6"],
        emoji: '5️⃣'
      },
      {
        value: 'Pruning Message',
        description: client.la[ls]["cmds"]["settings"]["reset"]["menuoptions"]["var7"],
        emoji: '6️⃣'
      },
      {
        value: 'Auto Play',
        description: client.la[ls]["cmds"]["settings"]["reset"]["menuoptions"]["var8"],
        emoji: '7️⃣'
      },
      {
        value: 'Equalizer',
        description: client.la[ls]["cmds"]["settings"]["reset"]["menuoptions"]["var9"],
        emoji: '8️⃣'
      },
      {
        value: 'Volume',
        description: client.la[ls]["cmds"]["settings"]["reset"]["menuoptions"]["var10"],
        emoji: '9️⃣'
      },
      {
        value: 'Reaction Roles',
        description: client.la[ls]["cmds"]["settings"]["reset"]["menuoptions"]["var11"],
        emoji: '🔟'
      },
      {
        value: 'Greeting Message',
        description: client.la[ls]["cmds"]["settings"]["reset"]["menuoptions"]["var12"],
        emoji: '✅'
      },
      {
        value: 'Leave Message',
        description: client.la[ls]["cmds"]["settings"]["reset"]["menuoptions"]["var13"],
        emoji: '✅'
      },
      // {
      //     value: 'Leveling System',
      //     description: client.la[ls]["cmds"]["settings"]["reset"]["menuoptions"]["var13"],
      //     emoji: '✅'
      // }
    ]

    let timeactive = 120000
    let timedelete = 6000

    let MenuEmbed = new MessageEmbed()
      .setColor(es.color)
      .setFooter(client.getFooter(es))
      .setThumbnail(es.thumb ? es.footericon : null)
      .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["var1"]))
      .setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["var2"]))

    let Selection = new MessageSelectMenu()
      .setPlaceholder(`Reset Menu Options`)
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

    var menumsg = await message.reply({
      embeds: [MenuEmbed],
      components: [new MessageActionRow().addComponents(Selection)]
    })

    setTimeout(() => {
      menumsg.edit({
        embeds: [MenuEmbed.setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["var3"])).setColor(es.wrongcolor).setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["var4"]))],
        components: []
      }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, timedelete);
      });
    }, timeactive);

    let used1 = false;

    //function to handle the menuselection
    function menuselection(menu) {
      let menuoptiondata = menuoptions.find(v => v.value == menu.values[0])
      let menuoptionindex = menuoptions.findIndex(v => v.value == menu.values[0])
      if (menu.values[0] == "Cancel")
        return menu.reply(`${emoji.msg.SUCCESS}`)
      menu.deferUpdate();
      used1 = false;
      handle_the_picks(menuoptionindex, menuoptiondata)
    }
    //Event
    client.on('interactionCreate', (menu) => {
      if (menu.message.id === menumsg.id) {
        if (menu.user.id === cmduser.id) {
          if (used1) return menu.reply({
            content: eval(client.la[ls]["cmds"]["settings"]["reset"]["var5"]),
            ephemeral: true
          })
          menuselection(menu);
        } else menu.reply({
          content: eval(client.la[ls]["cmds"]["settings"]["reset"]["var6"]),
          ephemeral: true
        });
      }
    });

    async function handle_the_picks(menuoptionindex, menuoptiondata) {
      var autorole = await client.Autorolesettings.findOne({
        GuildId: message.guild.id
      });
      var embed = await client.Embedsettings.findOne({
        guildId: message.guild.id
      });
      var greetingmsg = await client.Greetingmsg.findOne({
        GuildId: message.guild.id
      });
      var membercount = await client.Membercount.findOne({
        GuildId: message.guild.id
      });
      var mute = await client.Mutesettings.findOne({
        GuildId: message.guild.id
      });
      var premium = await client.Premium.findOne({
        GuildId: message.guild.id
      });
      var reactionrole = await client.reactrole.findOne({
        GuildId: message.guild.id
      });
      var dbsettings = await client.Settings.findOne({
        GuildId: message.guild.id
      });
      var stats = await client.stats.findOne({
        GuildId: message.guild.id
      });
      var musicsettings = await client.Musicsettings.findOne({
        guildId: message.guild.id
      });
      var levelingS = await client.leveling.findOne({
        GuildId: message.guild.id
      });
      var leaveMessage = await client.leaveMessage.findOne({
        GuildId: message.guild.id
      });

      switch (menuoptionindex) {
        // HARD RESET
        case 0: {
          let used3 = false;
          let yes = new MessageButton().setStyle('SUCCESS').setCustomId('1').setLabel("Yes").setEmoji(`👍`).setDisabled(false)
          let no = new MessageButton().setStyle('DANGER').setCustomId('2').setLabel("No").setEmoji(`👎`).setDisabled(false)

          let component = [
            new MessageActionRow().addComponents([
              yes,
              no,
            ]),
          ]
          let msg = [
            new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["var7"]))
            .setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["var8"]))
            .setFooter(client.getFooter(eval(client.la[ls]["cmds"]["settings"]["reset"]["var9"])), client.user.displayAvatarURL())
            // .setFooter(eval(client.la[ls]["cmds"]["settings"]["reset"]["var9"]), es.footericon)

          ]
          var tempmsg = await menumsg.reply({
            embeds: msg,
            components: component,
          })
          const collector = tempmsg.createMessageComponentCollector({
            filter: i => i.isButton() && i.message.author.id == client.user.id && i.user,
            // time: 30000,
            // errors: ['time']
          })

          collector.on('collect', async i => {
            try {
              if (i.isButton()) {
                if (i.user.id !== message.author.id)
                  return i.reply({
                    content: eval(client.la[ls]["cmds"]["settings"]["reset"]["var10"]),
                    ephemeral: true
                  });
                if (used3) {
                  return i.reply({
                    content: eval(client.la[ls]["cmds"]["settings"]["reset"]["var11"]),
                    ephemeral: true
                  })
                }
                if (i.customId == "1") {
                  used3 = true;
                  try {
                    if (autorole) await autorole.delete();
                    if (embed) await embed.delete();
                    if (greetingmsg.ChannelId.length > 5 && greetingmsg.Message) await greetingmsg.delete();
                    if (membercount) await membercount.delete();
                    if (mute) await mute.delete();
                    if (premium) {
                      premium.BotAFK = false;
                      premium.BotAFKVc = "";
                      premium.BotAFKCh = "";
                      await premium.save();
                    }
                    if (reactionrole) await reactionrole.delete();
                    if (dbsettings) await dbsettings.delete();
                    if (stats) await stats.delete();
                    if (musicsettings.channelId.length > 5) {
                      let ch = await message.guild.channels.cache.get(musicsettings.channelId);
                      ch.clone().then(c => {
                        c.setPosition(ch.position)
                      });
                      ch.delete();
                      await musicsettings.delete();
                    }
                    if (leaveMessage.ChannelId.length > 5 && leaveMessage.Message) await leaveMessage.delete();
                    await databasing(client, message.guild.id, message.author.id)
                  } catch (e) {
                    return message.channel.send({
                      embeds: [new MessageEmbed()
                        .setColor("RED")
                        .setTitle("❌ An error occurred")
                        .setDescription(`\`\`\`yml\n${e.message ? e.message : String(e).grey.substr(0, 2000)}\`\`\``)
                      ]
                    })
                  }
                  //send the success message
                  return tempmsg.edit({
                    embeds: [new MessageEmbed()
                      .setColor(es.succescolor)
                      .setFooter(client.getFooter(es))
                      .setThumbnail(es.thumb ? es.footericon : null)
                      .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["var12"]))
                      .setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["var13"]))
                    ],
                    components: [],
                  }).then((msg) => {
                    setTimeout(() => {
                      msg.delete().catch(() => {});
                    }, 6000);
                  })
                }
                //no
                else if (i.customId == "2") {
                  used3 = true;
                  return tempmsg.edit({
                    embeds: [new MessageEmbed()
                      .setColor(es.wrongcolor)
                      .setThumbnail(es.thumb ? es.footericon : null)
                      .setFooter(client.getFooter(es))
                      .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["var14"]))
                    ],
                    components: [],
                  })
                }
              }
            } catch (e) {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              console.log(String(e).italic.italic.grey.dim)
            }
          })
          return;
        }
        // DJ role
        case 1: {
          if (dbsettings.DjRoles.length > 5) {
            dbsettings.DjRoles = "";
            await dbsettings.save();
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.succescolor)
                .setFooter(client.getFooter(es))
                .setThumbnail(es.thumb ? es.footericon : null)
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["var16"]))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["var17"]))
              ],
              ephemeral: true
            }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 6000);
            });
          } else {
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setThumbnail(es.thumb ? url.img.ERROR : null)
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["noset"]))
              ],
            }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 6000);
            });
          }
        }
        //Prefix
        case 2: {
          dbsettings.Prefix = prefix,
            await dbsettings.save();

          return menumsg.reply({
            embeds: [new MessageEmbed()
              .setColor(es.succescolor)
              .setFooter(client.getFooter(es))
              .setThumbnail(es.thumb ? es.footericon : null)
              .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["var18"]))
              .setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["var19"]))
            ],
            ephemeral: true
          }).then((msg) => {
            setTimeout(() => {
              msg.delete();
            }, 6000);
          });
        }
        // Music Settings
        case 3: {
          let ch = await message.guild.channels.cache.get(musicsettings.channelId);
          if (musicsettings.channelId.length > 5) {
            ch.clone().then(c => {
              c.setPosition(ch.position)
            });
            ch.delete();
            musicsettings.delete();
            await databasing(client, message.guild.id, message.author.id)
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.succescolor)
                .setFooter(client.getFooter(es))
                .setThumbnail(es.thumb ? es.footericon : null)
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["var20"]))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["var21"]))
              ],
              ephemeral: true
            }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 6000);
            });
          } else {
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setThumbnail(es.thumb ? url.img.ERROR : null)
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["noset"]))
              ],
            }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 6000);
            });
          }
        }
        // Botchannel
        case 4: {
          if (dbsettings.BotChannel.length > 5) {
            dbsettings.BotChannel = "",
              dbsettings.save();
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.succescolor)
                .setFooter(client.getFooter(es))
                .setThumbnail(es.thumb ? es.footericon : null)
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["var22"]))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["var23"]))
              ],
            }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 6000);
            });
          } else {
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setThumbnail(es.thumb ? url.img.ERROR : null)
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["noset"]))
              ],
            }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 6000);
            });
          }
        }
        // AutoRole
        case 5: {
          if (autorole) {
            dbsettings.AutoRole = settings.autorole;
            dbsettings.save();
            await autorole.delete();
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.succescolor)
                .setFooter(client.getFooter(es))
                .setThumbnail(es.thumb ? es.footericon : null)
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["var24"]))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["var25"]))
              ],
              ephemeral: true
            }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 6000);
            });
          } else {
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setThumbnail(es.thumb ? url.img.ERROR : null)
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["noset"]))
              ],
            }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 6000);
            });
          }
        }
        // Pruning
        case 6: {
          dbsettings.Pruning = settings.default_db_data.pruning;
          dbsettings.save();
          return menumsg.reply({
            embeds: [new MessageEmbed()
              .setColor(es.succescolor)
              .setFooter(client.getFooter(es))
              .setThumbnail(es.thumb ? es.footericon : null)
              .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["var26"]))
              .setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["var27"]))
            ],
            ephemeral: true
          }).then((msg) => {
            setTimeout(() => {
              msg.delete();
            }, 6000);
          });
        }
        // Autoplay
        case 7: {
          if (premium) {
            dbsettings.AutoPlay = settings.default_db_data.defaultautoplay;
            dbsettings.save();
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.succescolor)
                .setFooter(client.getFooter(es))
                .setThumbnail(es.thumb ? es.footericon : null)
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["var28"]))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["var29"]))
              ],
              ephemeral: true
            }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 6000);
            });
          } else {
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(`${emoji.msg.ERROR} Your Guild Not Premium!`)
              ]
            })
          }
        }
        // Equalizer
        case 8: {
          if (premium) {

            dbsettings.Eq = settings.default_db_data.defaultequalizer;
            dbsettings.save();
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.succescolor)
                .setFooter(client.getFooter(es))
                .setThumbnail(es.thumb ? es.footericon : null)
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["var30"]))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["var31"]))
              ],
              ephemeral: true
            }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 6000);
            });
          } else {
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(`${emoji.msg.ERROR} Your Guild Not Premium!`)
              ]
            })
          }
        }
        //volume
        case 9: {
          if (premium) {
            dbsettings.Volume = settings.default_db_data.defaultvolume;
            dbsettings.save();
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.succescolor)
                .setFooter(client.getFooter(es))
                .setThumbnail(es.thumb ? es.footericon : null)
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["var32"]))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["var33"]))
              ],
              ephemeral: true
            }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 6000);
            });
          } else {
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(`${emoji.msg.ERROR} Your Guild Not Premium!`)
              ]
            })
          }
        }
        // Reaction Role
        case 10: {
          if (reactionrole) {
            await reactionrole.delete();
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.succescolor)
                .setFooter(client.getFooter(es))
                .setThumbnail(es.thumb ? es.footericon : null)
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["var34"]))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["var35"]))
              ],
              ephemeral: true
            }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 6000);
            });
          } else {
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["noset"]))
              ],
            }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 6000);
            });
          }
        }
        // Greeting Message
        case 11: {
          if (greetingmsg.ChannelId.length > 5 && greetingmsg.Message) {
            await greetingmsg.delete();
            dbsettings.Greeting = settings.default_db_data.greeting,
              dbsettings.save();
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.succescolor)
                .setFooter(client.getFooter(es))
                .setThumbnail(es.thumb ? es.footericon : null)
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["var36"]))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["var37"]))
              ],
              ephemeral: true
            }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 6000);
            });
          } else {
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["noset"]))
              ],
            }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 6000);
            });
          }
        }
        // Leave Message
        case 12: {
          if (leaveMessage.ChannelId.length > 5 && leaveMessage.Message) {
            await leaveMessage.delete();
            await databasing(client, message.guild.id, message.author.id)
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.succescolor)
                .setFooter(client.getFooter(es))
                .setThumbnail(es.thumb ? es.footericon : null)
                .setTitle(`${emoji.msg.SUCCESS} Greeting Message in this server has been reset!`)
                .setDescription(`If you want to change it, run the command \`${prefix}setup-leavemessage\``)
              ],
              ephemeral: true
            }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 6000);
            });
          } else {
            return menumsg.reply({
              embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["noset"]))
              ],
            }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 6000);
            });
          }
        }
      }
    }
  }
}