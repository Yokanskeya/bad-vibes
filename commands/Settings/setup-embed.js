var Discord = require(`discord.js`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
const {
  MessageButton,
  MessageActionRow,
  MessageEmbed,
} = require('discord.js');
var SettingsSchema = require('../../databases/settings');
module.exports = {
  name: "setup-embed",
  category: `Settings`,
  aliases: ["setupembed", "embed-setup", "embedsetup"],
  cooldown: 5,
  usage: "setup-embed  -->  Follow Steps",
  description: "Change the Look of your Embeds (Color, Image, Thumbnail, ...)",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    var timeouterror = false;
    let row = new MessageActionRow()
      .addComponents(
        new MessageButton().setStyle("SECONDARY").setCustomId("1").setEmoji("1️⃣"),
        new MessageButton().setStyle("SECONDARY").setCustomId("2").setEmoji("2️⃣"),
        new MessageButton().setStyle("SECONDARY").setCustomId("3").setEmoji("3️⃣"),
        new MessageButton().setStyle("SECONDARY").setCustomId("4").setEmoji("4️⃣"),
      )
    var tempmsg = await message.reply({
      components: [row],
      embeds: [new Discord.MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable1"]))
        .setColor(es.color)
        .setThumbnail(es.thumb ? es.footericon : null)
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable2"]))
        .setFooter(client.getFooter(es))
      ]
    })

    let data = await SettingsSchema.findOne({ GuildId : message.guild.id})
    //Create the collector
    const collector = tempmsg.createMessageComponentCollector({
      filter: i => i.isButton() && i.message.author.id == client.user.id && i.user,
      time: 90000
    })
    //Menu Collections
    collector.on('collect', async button => {
      if (button.user.id === cmduser.id) {
        collector.stop();
        button.deferUpdate();
        if (button.customId == "1") {
          tempmsg = await tempmsg.edit({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable5"]))
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
              .setDescription(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable6"]))
              .setFooter(client.getFooter(es))
            ]
          })
          await tempmsg.channel.awaitMessages({
              filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(collected => {
              var colors = collected.first().content;
              if (!colors) return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable7"]))
                  .setColor(es.wrongcolor)
                  .setDescription(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable8"]))
                  .setFooter(client.getFooter(es))
                ]
              });
              if (colors.length != 7 && !colors.includes("#")) return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable9"]))
                  .setColor(es.wrongcolor)
                  .setDescription(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable10"]))
                  .setFooter(client.getFooter(es))
                ]
              });
              try {
                data.Embed = {
                  color : colors,
                  wrongcolor : "RED",
                  succescolor : "GREEN",
                  thumb: true,
                  footertext: es.footertext,
                  footericon: es.footericon,
                }
                data.save();
                es = data.Embed;
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable11"]))
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                    .setFooter(client.getFooter(es))
                  ]
                });
              } catch (e) {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTitle(client.la[ls].common.erroroccur)
                    .setDescription(`\`\`\`${String(e.message ? e.message : e).substr(0, 2000)}\`\`\``)
                    .setFooter(client.getFooter(es))
                  ]
                });
              }
            })
            .catch(e => {
              timeouterror = e;
            })
          if (timeouterror)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable14"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });

        } else if (button.customId == "2") {
          tempmsg = await tempmsg.edit({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable15"]))
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
              .setDescription(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable16"]))
              .setFooter(client.getFooter(es))
            ]
          })
          await tempmsg.channel.awaitMessages({
              filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(collected => {
              var url = collected.first().content;

              function attachIsImage(msgAttach) {
                url = msgAttach.url;
                //True if this url is a png image.
                return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                  url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                  url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
              }

              if (collected.first().attachments.size > 0) {
                if (collected.first().attachments.every(attachIsImage)) {
                  try {
                    data.Embed = {
                      color : es.color,
                      wrongcolor : "RED",
                      succescolor : "GREEN",
                      thumb: true,
                      footertext: client.guilds.cache.get(message.guild.id) ? client.guilds.cache.get(message.guild.id).name : ee.footertext,
                      footericon: url
                    }
                    data.save();
                    es = data.Embed;
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable17"]))
                        .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  } catch (e) {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setTitle(client.la[ls].common.erroroccur)
                        .setDescription(`\`\`\`${String(e.message ? e.message : e).substr(0, 2000)}\`\`\``)
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }
                } else {
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable20"]))
                      .setColor(es.wrongcolor)
                      .setFooter(client.getFooter(es))
                    ]
                  });
                }
              } else if (!url.includes("http") && !(url.toLowerCase().includes("png") || url.toLowerCase().includes("gif") || url.toLowerCase().includes("jpg"))) {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable21"]))
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                  ]
                });
              } else {
                try {
                  data.Embed = {
                    color : es.color,
                    wrongcolor : "RED",
                    succescolor : "GREEN",
                    thumb: true,
                    footertext: client.guilds.cache.get(message.guild.id) ? client.guilds.cache.get(message.guild.id).name : ee.footertext,
                    footericon: url
                  }
                  data.save();
                  es = data.Embed;
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable22"]))
                      .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } catch (e) {
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setColor(es.wrongcolor)
                      .setTitle(client.la[ls].common.erroroccur)
                      .setDescription(`\`\`\`${String(e.message ? e.message : e).substr(0, 2000)}\`\`\``)
                      .setFooter(client.getFooter(es))
                    ]
                  });
                }
              }
            })
            .catch(e => {
              timeouterror = e;
            })
          if (timeouterror)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable25"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
        } else if (button.customId == "3") {
          tempmsg = await tempmsg.edit({
            embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable26"]))
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
              .setDescription(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable27"]))
              .setFooter(client.getFooter(es))
            ]
          })
          await tempmsg.channel.awaitMessages({
              filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(collected => {
              var text = collected.first().content;
              try {
                data.Embed = {
                  color : es.color,
                  wrongcolor : "RED",
                  succescolor : "GREEN",
                  thumb: true,
                  footertext: text,
                  footericon: es.footericon
                }
                data.save();
                es = data.Embed;
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(`<a:yess:927446817317204039>The new Embed Footer Text is:`.substr(0, 256))
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                    .setDescription(es.footertext)
                    .setFooter(client.getFooter(es))
                  ]
                });
              } catch (e) {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTitle(client.la[ls].common.erroroccur)
                    .setDescription(`\`\`\`${String(e.message ? e.message : e).substr(0, 2000)}\`\`\``)
                    .setFooter(client.getFooter(es))
                  ]
                });
              }
            })
            .catch(e => {
              timeouterror = e;
            })
          if (timeouterror)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable30"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(client.getFooter(es))
              ]
            });
        } else if (button.customId == "4") {
          try {
            data.Embed = {
              color : es.color,
              wrongcolor : "RED",
              succescolor : "GREEN",
              thumb: false,
              footertext: es.footertext,
              footericon: es.footericon
            }
            data.save();
            es = data.Embed;
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable31"]))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["setup-embed"]["variable32"]))
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                .setFooter(client.getFooter(es))
              ]
            });
          } catch (e) {
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(client.la[ls].common.erroroccur)
                .setDescription(`\`\`\`${String(e.message ? e.message : e).substr(0, 2000)}\`\`\``)
                .setFooter(client.getFooter(es))
              ]
            });
          }
        }
      } else button.reply({
        content: `${emoji.msg.ERROR} You are not allowed to do that! Only: <@${cmduser.id}>`,
        ephemeral: true
      });
    });
    //Once the Collections ended edit the menu message
    collector.on('end', collected => {
      tempmsg.edit({
        embeds: [tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`)],
        components: [],
        content: `${collected && collected.first() && collected.first().customId ? `${emoji.msg.SUCCSES} **Selected the \`${collected.first().customId}\`. Button**` : "❌ **NOTHING SELECTED - CANCELLED**" }`
      })
    });
  },
};
