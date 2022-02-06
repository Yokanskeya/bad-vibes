const { MessageEmbed } = require ('discord.js');
const Schema = require('../../databases/reaction-roles');
const emoji = require('../../botconfig/emojis.json');
const ee = require('../../botconfig/embed')
const url = require('../../botconfig/url.json');

module.exports = {
    name: "sendreactionrole",
    aliases: ["role-send", "rolesend", "role-panel", "rolepanel"],
    category: `Settings`,
    description: "Send reaction for get auto roles.",
    usage: "role-send <@text-channel> <title embed>",
    memberpermissions: [`ADMINISTRATOR`],
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
      let channel = message.mentions.channels.first();
      let title = args.slice(1).join(' ');

      await Schema.findOne({ GuildId: message.guild.id }, async (err, data) => {
        if (!data) {
          message.reply({
            embeds: [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setThumbnail(es.thumb ? url.img.ERROR : null)
              .setTitle(eval(client.la[ls].cmds.settings.sendreactionrole.var1))
              .setDescription(eval(client.la[ls].cmds.settings.sendreactionrole.var2))
            ]
          })
        }
          
        const mapped = Object.keys(data.RolesId)
          .map((value, index) => {
            const role = message.guild.roles.cache.get(data.RolesId[value][0]);
            return `${index + 1}. ${data.RolesId[value][1].raw} = ${role} ${data.RolesId[value][1].name}`;
          })
          .join("\n\n");

        if (!channel) {
          return message.reply({
            embeds: [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setThumbnail(es.thumb ? url.img.ERROR : null)
              .setTitle(eval(client.la[ls].cmds.settings.sendreactionrole.var3))
              .setDescription(eval(client.la[ls].cmds.settings.sendreactionrole.err))
            ]
          })
        }
        if (!title) {
          return message.reply({
            embeds: [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setThumbnail(es.thumb ? url.img.ERROR : null)
              .setTitle(eval(client.la[ls].cmds.settings.sendreactionrole.var4))
              .setDescription(eval(client.la[ls].cmds.settings.sendreactionrole.err))
            ]
          })
        }

      message.react(emoji.react.SUCCESS)
      message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          .setThumbnail(es.thumb ? es.footericon : null)
          .setDescription(eval(client.la[ls].cmds.settings.sendreactionrole.var5))
        ]
      })
      channel.send({
          embeds: [ new MessageEmbed()
              .setTitle(title)
              .setDescription(mapped)
              .setFooter(client.getFooter(`${client.la[ls].cmds.settings.sendreactionrole.var6} ${es.footertext}\n${ee.footertext}`, client.user.displayAvatarURL()))
              .setThumbnail(es.thumb ? es.footericon : null)
              .setColor(es.color)
          ],
      })
      .then((msg) => {
        data.Message = msg.id;
        data.save();
        const reactions = Object.values(data.RolesId).map(
          (val) => val[1].id ?? val[1].raw
        );
        reactions.map((emojis) => msg.react(emojis));
      }).catch(() => {});
      }).clone();
    }
};  