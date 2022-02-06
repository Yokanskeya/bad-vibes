const { MessageEmbed } = require ('discord.js');
const emoji = require('../../botconfig/emojis.json');
const ee = require('../../botconfig/embed')
const mm = require('../../databases/mutemember');
const url = require('../../botconfig/url.json');
module.exports = {
  name: "mute",
  aliases: ["mutemember", "muteuser"],
  category: "Admin",
  description: "Muted a user.",
  usage: "mute <@user>",
  memberpermissions: [`ADMINISTRATOR`],
  type: "server",
  cooldown: 10,
    
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => { 
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ');
    if (!member) {
      return message.reply({
          embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["mute"]["var1"]))
          ]
      });
    }
    if (member.id == message.author.id) {
      return message.reply({
          embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["mute"]["var2"]))
          ]
      });
    }
    if (member.id == client.user.id) {
      return message.reply({
          embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["mute"]["var3"]))
          ]
      });
    }
    if (!reason) {
      return message.reply({
          embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["mute"]["var4"]))
          .setDescription(eval(client.la[ls]["cmds"]["admin"]["mute"]["var5"]))
          ]
      });
    }
    const admin = member.permissions.has("ADMINISTRATOR")
        if(admin) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(eval(client.la[ls]["cmds"]["admin"]["mute"]["var6"]))
                ]
            });
        }

    const role = message.guild.roles.cache.find(role => role.name === "Muted");
    const msgEmbed = new MessageEmbed()
    .setColor(es.wrongcolor)
    .setTitle(eval(client.la[ls]["cmds"]["admin"]["mute"]["var7"]))

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
            msgEmbed.setTitle(eval(client.la[ls]["cmds"]["admin"]["mute"]["var8"]))
            .setColor(es.succescolor)
          ]  
        })
      } catch (err) {
        console.log(err)
      }
    }
    mm.findOne({ Guild: message.guild.id }, async (err, data) => {
      let role2 = await message.guild.roles.cache.find(role => role.name === "Muted");
      if (member.roles.cache.has(role2.id)) {
      let mutedmember = data.Users.map(m => `<@${m}>`);
        return message.reply({ 
          embeds : [new MessageEmbed()
            .setColor(es.succescolor)
            .setTitle(eval(client.la[ls]["cmds"]["admin"]["mute"]["var9"]))
            .setDescription(eval(client.la[ls]["cmds"]["admin"]["mute"]["var10"]))
          ]
        });
      }
      await member.roles.add(role2);
      if (!data) {
        new mm({
          Guild: message.guild.id,
          Users: member.id,
        }).save();
      } else {
        data.Users.push(member.id);
        data.save();
      }

      await member.send({
        embeds: [new MessageEmbed()
          .setColor(es.succescolor)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["mute"]["var11"]))
          .addField(eval(client.la[ls]["cmds"]["admin"]["mute"]["var12"]), `\`\`\`yml\n${reason}\`\`\``)
          .setFooter(client.getFooter(eval(client.la[ls]["cmds"]["admin"]["mute"]["var13"]), message.author.displayAvatarURL({dynamic: true})))
        ]
      })
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.succescolor)
          .setFooter(client.getFooter(eval(client.la[ls]["cmds"]["admin"]["mute"]["var14"]), message.author.displayAvatarURL({dynamic: true})))
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["mute"]["var15"]))
          .addField(eval(client.la[ls]["cmds"]["admin"]["mute"]["var16"]), `\`\`\`yml\n${reason}\`\`\``)
        ]
      })
    });
  }
};