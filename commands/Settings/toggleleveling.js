const {
    MessageEmbed
  } = require("discord.js");
  const config = require(`${process.cwd()}/botconfig/config.json`);
  var ee = require(`${process.cwd()}/botconfig/embed.json`);
  const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
  const levelingSystem = require('../../databases/leveling-system');
  module.exports = {
    name: "toggleleveling",
    aliases: ["togglelevel", "togglerank"],
    category: `Settings`,
    description: "Toggles Leveling System | Default: false aka not running the leveling system",
    usage: "toggleleveling",
    memberpermissions: ["ADMINISTRATOR"],
    type: "bot",
    cooldown: 10,
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
        let msg = await message.reply({
            embeds: [new MessageEmbed()
                .setColor(es.color)
                .setTitle(`⏳ Loading`)
            ],
        });
        await levelingSystem.findOne({ GuildId : message.guild.id }, async (err, data) => {
            if (data && data.status) {
                data.status = false;
                await data.save();
            } else {
                data.status = true;
                await data.save();
            }
            return msg.edit({
                embeds: [new MessageEmbed()
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                    .setThumbnail(es.thumb? es.footericon: null)
                    .setTitle(`${emoji.msg.SUCCESS} Leveling System has been __${data.status ? `ENABLED` : `DISABLED`}__ `)
                    .setDescription(`Now i will ${data.status ? `` : `not`} count the points of all members`)
                ]
            })
        }).clone();
    }
  };
