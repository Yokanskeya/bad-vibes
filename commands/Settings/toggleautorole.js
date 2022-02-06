const {
    MessageEmbed
  } = require("discord.js");
  const ee = require(`../../botconfig/embed`);
  const emoji = require(`../../botconfig/emojis.json`);
  const settingSchema = require('../../databases/settings');
  const settings = require('../../botconfig/settings.json');
  module.exports = {
    name: "toggleautorole",
    aliases: ["autorole-up"],
    category: `Settings`,
    description: "Enable or disable auto roles when new members join the server. Default DISABLE",
    usage: "toggleautorole",
    memberpermissions: ["ADMINISTRATOR"],
    type: "bot",
    cooldown: 10,
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
        let autorole = await client.Autorolesettings.findOne({ GuildId : message.guild.id });
        if (!autorole) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setThumbnail(es.thumb ? es.footericon : null)
                    .setTitle(eval(client.la[ls]["cmds"]["settings"]["toggleautorole"]["var1"]))
                    .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggleautorole"]["var2"]))
                ]
            })
        }
        settingSchema.findOne({ GuildId : message.guild.id}, async (err, data) => {
            if (!data.AutoRole){
                data.AutoRole = true
                await data.save();
            } else {
                data.AutoRole = false
                await data.save();
            }
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(es.succescolor)
                    .setFooter(client.getFooter(es))
                    .setThumbnail(es.thumb ? es.footericon : null)
                    .setTitle(eval(client.la[ls]["cmds"]["settings"]["toggleautorole"]["var3"]))
                    .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggleautorole"]["var4"]))
                ]
            })
        }) 
    }
};