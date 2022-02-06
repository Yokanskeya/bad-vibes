const {
  MessageEmbed,
  Message
} = require('discord.js');
const emoji = require('../../botconfig/emojis.json');
const url = require('../../botconfig/url.json');
const ee = require('../../botconfig/embed')
const AutoRoleSchema = require('../../databases/autorole');
const SettingsSchema = require('../../databases/settings');
module.exports = {
  name: "autorole",
  aliases: [],
  category: "Admin",
  description: "Assign an automatic role when a new member joins the server.",
  usage: "autorole <@role>",
  memberpermissions: [`ADMINISTRATOR`],
  type: "server",
  cooldown: 10,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let role = await message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!role) return message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.color).setFooter(client.getFooter(es))
        .setThumbnail(es.thumb ? url.img.ERROR : null)
        .setTitle(eval(client.la[ls]["cmds"]["admin"]["autorole"]["var1"]))
      ],
    });
    let myrole = message.guild.roles.cache.find(role => role.name == client.user.username);
    // checking role position
    try {
      if (role.position > myrole.position) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["admin"]["autorole"]["var2"]))
            .setDescription(eval(client.la[ls]["cmds"]["admin"]["autorole"]["var3"]))
          ],
        })
      }
    } catch (error) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["autorole"]["var4"]))
          .setDescription(eval(client.la[ls]["cmds"]["admin"]["autorole"]["var5"]))
        ]
      })
    }
    let ss = await client.Settings.findOne({ GuildId : message.guild.id });
    AutoRoleSchema.findOne({ GuildId: message.guild.id }, async (err, data) => {
      if (!data) {
        new AutoRoleSchema({
          GuildId: message.guild.id,
          RoleId: role.id
        }).save();
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.color)
            .setDescription(eval(client.la[ls]["cmds"]["admin"]["autorole"]["var6"]))
          ]
        })
      } else {
        if (data.RoleId.length > 5) {
          let added = await message.guild.roles.cache.get(data.RoleId);
          return message.reply({
            embeds: [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["admin"]["autorole"]["var7"]))
              .setDescription(eval(client.la[ls]["cmds"]["admin"]["autorole"]["var8"]))
            ]
          })
        } else {
          data.RoleId = role.id
          data.save();
          ss.autorole = true;
          await ss.save();
          return message.reply({
            embeds: [new MessageEmbed()
              .setColor(es.color)
              .setTitle(eval(client.la[ls]["cmds"]["admin"]["autorole"]["var9"]))
              .setDescription(eval(client.la[ls]["cmds"]["admin"]["autorole"]["var10"]))
            ]
          })
        }
      }
    })
  }
};