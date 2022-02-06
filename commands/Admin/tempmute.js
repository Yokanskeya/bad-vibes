const { MessageEmbed } = require ('discord.js');
const emoji = require('../../botconfig/emojis.json');
const ee = require('../../botconfig/embed')
const mm = require('../../databases/mutemember');
const url = require('../../botconfig/url.json');
const ms = require("ms");
module.exports = {
  name: "tempmute",
  aliases: ["tempmutemember", "tempmuteuser"],
  category: "Admin",
  description: "Temporarily mute your discord member.",
  usage: "tempmute <@user> <m/h/d>",
  memberpermissions: [`ADMINISTRATOR`],
  type: "bot",
  cooldown: 10,
    
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => { 
    const member = message.mentions.members.first();
    const reason = args.slice(2).join(' ');
    const time = args[1];

    if (!member) {
      return message.reply({
          embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var1"]))
          ]
      });
    }
    
    if (member.id == message.author.id) {
      return message.reply({
          embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var2"]))
          ]
      });
    }

    if (member.id == client.user.id) {
      return message.reply({
          embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var3"]))
          ]
      });
    }

    if (!time) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var4"]))
          .setDescription(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var5"]))
          .addField(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var6"]), eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var7"]))
        ]
      });
    }

    if (!reason) {
      return message.reply({
          embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var8"]))
          .setDescription(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var9"]))
          ]
      });
    }
    const admin = member.permissions.has("ADMINISTRATOR")
        if(admin) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var10"]))
                ]
            });
        }

    const role = message.guild.roles.cache.find(role => role.name === "Muted");
    const msgEmbed = new MessageEmbed()
    .setColor(es.wrongcolor)
    .setTitle(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var11"]))

    if (!role) {
      const msg = await message.channel.send({ 
        embeds: [msgEmbed],
      });
      try {
        let muterole = await message.guild.roles.create({
          name: 'Muted',
          permissions: []
        });
        message.guild.channels.cache.filter(c => c.type === "GUILD_TEXT").forEach(async (channel, id) => {
          await channel.permissionOverwrites.create(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
            SEND_TTS_MESSAGES: false,
          });
        });
        message.guild.channels.cache.filter(c => c.type === "GUILD_VOICE").forEach(async (channel, id) => {
          await channel.permissionOverwrites.create(muterole, {
            CONNECT: false,
          });
        });
        msg.edit({
          embeds: [
            msgEmbed.setTitle(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var12"]))
            .setColor(es.succescolor)
          ]  
        })
      } catch (err) {
        console.log(err)
      }
    }

    let role2 = await message.guild.roles.cache.find(role => role.name === "Muted");
      if (member.roles.cache.has(role2.id)) {
      let mutedmember = data.Users.map(m => `<@${m}>`);
        return message.reply({ 
          embeds : [new MessageEmbed()
            .setColor(es.succescolor)
            .setTitle(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var13"]))
            .setDescription(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var14"]))
          ]
        });
      }

    await member.roles.add(role2);
    await message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.succescolor)
        .setFooter(client.getFooter(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var15"]), message.author.displayAvatarURL({dynamic: true})))
        .setTitle(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var16"]))
        .addField(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var17"]), `\`\`\`yml\n${reason}\`\`\``)
        .addField(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var18"]), `\`\`\`yml\n${time}\`\`\``)
      ]
    })

    setTimeout(async () => {
      await member.roles.remove(role2);
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.succescolor)
          .setFooter(client.getFooter(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var19"]), client.user.displayAvatarURL({dynamic: true})))
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["tempmute"]["var20"]))
        ]
      })
    }, ms(time));
  }
};