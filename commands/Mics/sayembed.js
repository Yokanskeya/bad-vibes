const {
  MessageEmbed,
} = require(`discord.js`);
const emoji = require('../../botconfig/emojis.json')
const url = require('../../botconfig/url.json')
module.exports = {
  name: `sayembed`,
  aliases: ["embedsend", "embed", "sendembed"],
  category: `Mics`,
  description: `Create and Send the custom Embed`,
  usage: `sayembed`,
  memberpermissions: [`ADMINISTRATOR`],
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let msg = await message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var1"]))
      ]
    })
    client.Embedsettings.findOne({
      GuildId: message.guild.id
    }, async (err, data) => {
      if (!data)
        new client.Embedsettings({
          GuildId: message.guild.id,
          Color: "",
          Footer: "",
          Title: "",
          Description: "",
          Thumbnail: "",
        }).save();
    });
    let dbembed = await client.Embedsettings.findOne({
      GuildId: message.guild.id
    });

    let channel = message.mentions.channels.first();

    if (!channel) return message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setThumbnail(es.thumb ? es.footericon : null)
        .setTitle(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var2"]))
      ]
    })

    const timeout = new MessageEmbed()
      .setTitle(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var3"]))
      .setColor(es.wrongcolor)
      .setDescription(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var4"]).substr(0, 2000))

    const msgErr = new MessageEmbed()
      .setColor(es.color)
      .setThumbnail(es.thumb ? es.footericon : null)
      .setTitle(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var5"]))

    let msgSend = await msg.edit({
      content: eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var6"]),
      embeds: [msgErr]
    });

    await msgSend.channel.awaitMessages({
      filter: m => m.author.id === message.author.id,
      max: 1,
      time: 90000,
      errors: ["time"]
    }).then(async (collected) => {
      var title = collected.first().content;
      if (title.toLowerCase() == "cancel") return message.reply(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["cancel"]))
      dbembed.Title = title;
      await dbembed.save()
      await msgSend.edit({
        embeds: [
          msgErr.setTitle(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var7"]))
          .setDescription(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var25"]))
          .addField(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var8"]), `\`\`\`${title}\`\`\``)
          .setFooter(client.getFooter(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var9"]), es.footericon))
        ]
      })
      await msgSend.channel.awaitMessages({
        filter: m => m.author.id === message.author.id,
        max: 1,
        time: 90000,
        errors: ["time"]
      }).then(async (collected) => {
        var description = collected.first().content;
        if (description.toLowerCase() == "cancel") return message.reply(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["calcel"]))
        if (description === "null") description = null;
        dbembed.Description = description;
        await dbembed.save()
        await msgSend.edit({
          embeds: [
            msgErr.setTitle(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var10"]))
            .setDescription(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var11"]))
            .addField(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var12"]), `\`\`\`${description}\`\`\``)
            .setFooter(client.getFooter(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var13"]), es.footericon))
          ]
        })
        await msgSend.channel.awaitMessages({
          filter: m => m.author.id === message.author.id,
          max: 1,
          time: 90000,
          errors: ["time"]
        }).then(async (collected) => {
          var color = collected.first().content;
          if (color.toLowerCase() == "cancel") return message.reply(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["cancel"]))
          if (color.length > 6 && !color.includes("#")) return message.reply(`Color not valid!`)
          dbembed.Color = color;
          await dbembed.save()
          await msgSend.edit({
            embeds: [
              msgErr.setTitle(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var14"]))
              .setDescription(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var15"]))
              .addField(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var16"]), `\`\`\`${color}\`\`\``)
              .setFooter(client.getFooter(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var17"]), es.footericon))
            ]
          })
          await msgSend.channel.awaitMessages({
            filter: m => m.author.id === message.author.id,
            max: 1,
            time: 90000,
            errors: ["time"]
          }).then(async (collected) => {
            var footer = collected.first().content;
            if (footer.toLowerCase() == "cancel") return message.reply(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["cancel"]))
            if (footer === "null") footer = null;
            dbembed.Footer = footer;
            await dbembed.save()
            await msgSend.edit({
              embeds: [
                msgErr.setTitle(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var18"]))
                .setDescription(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var19"]))
                .addField(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var20"]), `\`\`\`${footer}\`\`\``)
                .setFooter(client.getFooter(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var21"]), es.footericon))

              ]
            })
            await msgSend.channel.awaitMessages({
              filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            }).then(async (collected) => {
              var img = collected.first().content;
              if (img.toLowerCase() == "cancel") return message.reply(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["cancel"]))
              if (img === "null") img = null;
              dbembed.Image = img;
              await dbembed.save()
              msgSend.delete().catch(() => {});
              try {
                if (dbembed.Description == null) {
                  message.reply({
                    content: eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var22"]),
                    embeds: [new MessageEmbed()
                      .setColor(dbembed.Color)
                      .setFooter(client.getFooter(dbembed.Footer ? dbembed.Footer : '', dbembed.Footer ? dbembed.Image : null))
                      .setTitle(dbembed.Title)
                      .setThumbnail(dbembed.Image ? dbembed.Image : null)
                    ]
                  });
                } else
                if (dbembed.Footer == null) {
                  message.reply({
                    content: eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var22"]),
                    embeds: [new MessageEmbed()
                      .setColor(dbembed.Color)
                      .setTitle(dbembed.Title)
                      .setDescription(dbembed.Description)
                      .setThumbnail(dbembed.Image ? dbembed.Image : null)
                    ]
                  });
                } else
                if (dbembed.Footer == null && dbembed.Description == null) {
                  message.reply({
                    content: eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var22"]),
                    embeds: [new MessageEmbed()
                      .setColor(dbembed.Color)
                      .setTitle(dbembed.Title)
                      .setThumbnail(dbembed.Image ? dbembed.Image : null)
                    ]
                  });
                } else {
                  message.reply({
                    content: eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var22"]),
                    embeds: [new MessageEmbed()
                      .setColor(dbembed.Color)
                      .setFooter(dbembed.Footer ? dbembed.Footer : '', dbembed.Footer ? dbembed.Image : null)
                      .setTitle(dbembed.Title)
                      .setDescription(dbembed.Description ? dbembed.Description : '')
                      .setThumbnail(dbembed.Image ? dbembed.Image : null)
                    ]
                  });

                }
              } catch (e) {
                return message.channel.send({
                  embeds: [
                    new MessageEmbed()
                    .setColor("RED")
                    .setTitle("❌ An error occurred")
                    .setDescription(`\`\`\`${e.message ? e.message : String(e).grey.substr(0, 2000)}\`\`\``)
                  ]
                })
              }
              await msgSend.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              }).then(async (collected) => {
                var ask = collected.first().content;
                if (ask.toLowerCase() == "yes") {
                  await message.channel.bulkDelete(7).catch(() => {});
                  message.reply({
                    embeds: [new MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var23"]))
                      .setColor(es.color)
                    ]
                  })
                  if (dbembed.Description == null) {
                    return await channel.send({
                      embeds: [new MessageEmbed()
                        .setColor(dbembed.Color)
                        .setFooter(dbembed.Footer ? dbembed.Footer : '', dbembed.Footer ? dbembed.Image : null)
                        .setTitle(dbembed.Title)
                        .setThumbnail(dbembed.Image ? dbembed.Image : null)
                      ]
                    });
                  } else
                  if (dbembed.Footer == null) {
                    return await channel.send({
                      embeds: [new MessageEmbed()
                        .setColor(dbembed.Color)
                        .setTitle(dbembed.Title)
                        .setDescription(dbembed.Description)
                        .setThumbnail(dbembed.Image ? dbembed.Image : null)
                      ]
                    });
                  } else
                  if (dbembed.Footer == null && dbembed.Description == null) {
                    return await channel.send({
                      embeds: [new MessageEmbed()
                        .setColor(dbembed.Color)
                        .setTitle(dbembed.Title)
                        .setThumbnail(dbembed.Image ? dbembed.Image : null)
                      ]
                    });
                  } else
                    return await channel.send({
                      embeds: [new MessageEmbed()
                        .setColor(dbembed.Color)
                        .setFooter(dbembed.Footer ? dbembed.Footer : '', dbembed.Footer ? dbembed.Image : null)
                        .setTitle(dbembed.Title)
                        .setDescription(dbembed.Description ? dbembed.Description : '')
                        .setThumbnail(dbembed.Image ? dbembed.Image : null)
                      ]
                    })
                }
                if (ask.toLowerCase() == "cancel") {
                  await message.channel.bulkDelete(7).catch(() => {});
                  return message.reply({
                    embeds: [new MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["misc"]["sayembed"]["var24"]))
                      .setColor(es.color)
                    ]
                  })
                }
                return;
              }).catch(e => {
                let timeouterror = e;
                if (timeouterror)
                  return message.reply({
                    embeds: [timeout]
                  });
              });
            }).catch(e => {
              let timeouterror = e;
              if (timeouterror)
                return message.reply({
                  embeds: [timeout]
                });
            });
          }).catch(e => {
            let timeouterror = e;
            if (timeouterror)
              return message.reply({
                embeds: [timeout]
              });
          });
        }).catch(e => {
          let timeouterror = e;
          if (timeouterror)
            return message.reply({
              embeds: [timeout]
            });
        });
      }).catch(e => {
        let timeouterror = e;
        if (timeouterror)
          return message.reply({
            embeds: [timeout]
          });
      });
    }).catch(e => {
      let timeouterror = e;
      if (timeouterror)
        return message.reply({
          embeds: [timeout]
        });
    });
  }
}