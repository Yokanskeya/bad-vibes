const config = require(`${process.cwd()}/botconfig/config.json`);
const settings = require(`${process.cwd()}/botconfig/settings.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const ee = require(`${process.cwd()}/botconfig/embed`);
const Discord = require("discord.js");
const url = require(`${process.cwd()}/botconfig/url`);
const {
  MessageEmbed
} = require("discord.js");
const {
  escapeRegex,
  delay,
  databasing,
  handlemsg,
  leveling,
  isMessageDeleted
} = require(`${process.cwd()}/handlers/functions`);
const premiumGuildSchema = require("../../databases/premium");
const SettingsSchema = require('../../databases/settings');
const MusicSchema = require('../../databases/musicsettings');
const StatsSchema = require('../../databases/stats');
const StastGSchema = require('../../databases/statsGlobal');
const levelingSystem = require('../../databases/leveling-system');
module.exports = async (client, message) => {
      try {
        if (!message.guild || message.guild.available === false || !message.channel || message.webhookId) return;
        if (message.channel.partial) await message.channel.fetch().catch(() => {});
        if (message.member.partial) await message.member.fetch().catch(() => {});
        let stsG = await StastGSchema.findOne({
          BotId: client.user.id
        }).clone();
        let sts = await StatsSchema.findOne({
          GuildId: message.guild.id
        }).clone();
        let ss = await SettingsSchema.findOne({
          GuildId: message.guild.id
        }).clone();
        let ms = await MusicSchema.findOne({
          guildId: message.guild.id
        }).clone();
        databasing(client, message.guild.id, message.author.id);
        let premiumguild = await premiumGuildSchema.findOne({
          GuildId: message.guild.id
        }).clone();
        // if the message  author is a bot, return aka ignore the inputs
        if (message.author.bot) return;
        let es = await ss.Embed;
        let ls = await ss.Language;
        let unkowncmdmessage = await ss.Unkowncmdmessage;
        let botchannels = await ss.BotChannel;
        let prefix = await ss.Prefix;

        let guild = client.guilds.cache.get(message.guild.id);
        if (premiumguild && !premiumguild.Permanent && Date.now() > premiumguild.Expire) {
          premiumguild.delete().catch(() => {});
          guild.fetchOwner().then(owner => {
            owner.send(`Thanks for subscribe __**Bad Vibes Premium**__.\n\nNow **Bad Vibes Premium** has __**expired**__ in __**${message.guild.name}**__`).catch(() => {});
          }).catch(() => {});
          if (ss.AutoPlay) {
            ss.AutoPlay = false
            ss.save();
          }
        }
        leveling(client, message, message.guild.id, message.author.id);
        var not_allowed = false;
        //if not in the database for some reason use the default prefix
        if (prefix === null) prefix = config.prefix;
        //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
        //if its not that then return
        if (!prefixRegex.test(message.content)) return;
        //now define the right prefix either ping or not ping
        const [, matchedPrefix] = message.content.match(prefixRegex);
        //CHECK PERMISSIONS
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS))
          return message.reply(`❌ **I am missing the Permission to USE EXTERNAL EMOJIS**`)
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS))
          return message.reply(`❌ **I am missing the Permission to EMBED LINKS (Sending Embeds)**`)
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.ADD_REACTIONS))
          return message.reply(`❌ **I am missing the Permission to ADD REACTIONS**`)

        if (!botchannels || !Array.isArray(botchannels)) botchannels = [];
        if (botchannels.toString() !== "") {
          if (!botchannels.includes(message.channel.id) && !message.member.permissions.has("ADMINISTRATOR"))
            for (const channelId of botchannels) {
              let channel = message.guild.channels.cache.get(channelId);
              if (!channel) {
                ss.BotChannel.remove(channelId)
                await ss.save();
              }
              try {
                message.react("❌").catch(e => {
                  console.log(String(e).grey);
                });
              } catch {}
              not_allowed = true;
              return message.reply({
                embeds: [new MessageEmbed()
                  .setColor(es.wrongcolor)
                  .setTitle(`${emoji.msg.ERROR} You Not in the Bot channels!`)
                  .setDescription(`>>> **There is a Bot chat setup in this GUILD! Try using the Bot Commands here:** \n>${botchannels.map(c=>`<#${c}>`).join(", ")}`)
                ]
              })
            }
        }
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const djname = await message.guild.roles.cache.get(ss.DjRoles);
        const cmd = args.shift().toLowerCase();
        if (cmd.length === 0) {
          if (matchedPrefix.includes(client.user.id)) {
            return message.reply({
              embeds: [new MessageEmbed()
                .setColor(es.color)
                .setTitle(`Yes? ${client.user.username} Here!`)
                .setDescription(`>>> Prefix in this server is: \`${prefix}\``)
              ]
            })
          }
          return;
        }
        let command = client.commands.get(cmd);
        if (!command) command = client.commands.get(client.aliases.get(cmd));
        if (command) {
          if (command.owner) {
            if (!config.ownerIDS.some(r => r.includes(message.author.id))) {
              message.react("❌").catch(() => {})
              return message.reply(`${emoji.msg.ERROR} Your Not Allowed to use this commands!`).then(msg => {
                setTimeout(() => {
                  msg.delete().catch(() => {});
                }, 6000)
              }).catch(() => {})
            }
          }
          if (command.premium) {
            if (!premiumguild) {
              message.react("❌").catch(() => {})
              return message.reply(`${emoji.msg.ERROR} **Your guild is not premium** \n Let's a subscribe Bad Vibes Premium for use the Premium Commands.\n\n Premium Info: \n> ${config.websiteSettings.domain}premium`);
            }
          }
          var musicData = ms.channelId;
          if (musicData.channel && musicData.channel == message.channel.id) {
            return message.reply(`${emoji.msg.ERROR} **Please use a Command Somewhere else!**`).then(msg => {
              setTimeout(() => {
                msg.delete().catch(() => {});
              }, 3000)
            }).catch(() => {})
          }
          if (command.length == 0) {
            if (unkowncmdmessage) {
              message.reply({
                embeds: [
                  new Discord.MessageEmbed()
                  .setColor(es.wrongcolor)
                  .setTitle(handlemsg(client.la[ls].common.unknowncmd.title, {
                    prefix: prefix
                  }))
                  .setDescription(handlemsg(client.la[ls].common.unknowncmd.description, {
                    prefix: prefix
                  }))
                ]
              }).then(msg => {
                setTimeout(() => {
                  msg.delete().catch(() => {});
                }, 5000)
              }).catch(() => {})
            }
            return;
          }
          if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
            client.cooldowns.set(command.name, new Discord.Collection());
          }
          const now = Date.now(); //get the current time
          const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
          const cooldownAmount = (command.cooldown || 1) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
          if (timestamps.has(message.author.id)) { //if the user is on cooldown
            let expirationTime = timestamps.get(message.author.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
            if (now < expirationTime) { //if he is still on cooldonw
              let timeLeft = (expirationTime - now) / 1000; //get the lefttime
              if (timeLeft < 1) timeLeft = Math.round(timeLeft)
              if (timeLeft && timeLeft != 0) {
                not_allowed = true;
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTitle(handlemsg(client.la[ls].common.cooldown, {
                      time: timeLeft.toFixed(1),
                      commandname: command.name
                    }))
                  ]
                }).catch(() => {}) //send an information message
              }
            }
          }
          timestamps.set(message.author.id, now); //if he is not on cooldown, set it to the cooldown
          setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); //set a timeout function with the cooldown, so it gets deleted later on again
          try {
            sts.Commands += 1; //counting our Database stats for SERVER
            sts.save();
            stsG.Commands += 1; //counting our Database Stats for GLOBAL
            stsG.save();
            if (command.memberpermissions) {
              if (!message.member.permissions.has(command.memberpermissions)) {
                not_allowed = true;
                try {
                  message.react("❌").catch(() => {})
                } catch {}
                message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTitle(client.la[ls].common.permissions.title)
                    .setDescription(`${client.la[ls].common.permissions.description}\n> \`${command.memberpermissions.join("`, ``")}\``)
              ]
            }).then(msg => {
              setTimeout(() => {
                msg.delete().catch(() => {});
              }, 5000)
            }).catch(()=>{})
          }
        }
        const player = client.manager.players.get(message.guild.id);
        if(player && player.node && !player.node.connected) await player.node.connect();
        if(message.guild.me.voice.channel && player) {
          if(!player.queue) await player.destroy();
          await delay(500);
        }
        if(command.parameters) {
          if(command.parameters.type == "music") {
            const { channel } = message.member.voice;
            const mechannel = message.guild.me.voice.channel;
            if (!channel) {
              not_allowed = true;
              message.react("❌").catch(() => {})
              return message.reply({
                embeds: [new MessageEmbed()
                  .setColor(es.wrongcolor)
                  .setTitle(client.la[ls].common.join_vc)
                ]
              }).catch(()=>{})
            }
            if(message.member.voice.selfDeaf || message.member.voice.deaf) {
              message.react("❌").catch(() => {})
              return message.reply({embeds : [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(client.la[ls].common.deaf)
              ]});
            }
            //If there is no player, then kick the bot out of the channel, if connected to
            if(!player && mechannel) {
              await message.guild.me.voice.disconnect().catch(()=>{})
              await delay(350);
            }
            if(player && player.queue && player.queue.current && command.parameters.check_dj){
              if (ss.DjRoles.length > 10) {
                if (!message.member.roles.cache.get(ss.DjRoles) && !message.member.permissions.has("ADMINISTRATOR")) {
                  not_allowed = true;
                  message.react("❌").catch(() => {})
                  return message.reply({
                    embeds: [new MessageEmbed()
                      .setColor(es.wrongcolor)
                      .setTitle(eval(client.la[ls]["common"]["not_DJ"]))
                      .setDescription(`>>> **DJ - ROLE: **\n> <@&${ss.DjRoles}>`)
                    ]
                  }).then(msg => {
                    setTimeout(() => {
                      msg.delete().catch(() => {});
                    }, 12000);
                  });
                }
              }
            }
            //if no player available return error | aka not playing anything
            if(command.parameters.activeplayer){
              if (!player){
                not_allowed = true;
                message.react("❌").catch(() => {})
                return message.reply({embeds: [new MessageEmbed()
                  .setColor(es.wrongcolor)
                  .setTitle(client.la[ls].common.nothing_playing)]}).catch(()=>{})
              }
              if (!mechannel){
                if(player) try{ await player.destroy(); await delay(350); }catch{ }
                not_allowed = true;
                message.react("❌").catch(() => {})
                return message.reply({embeds: [new MessageEmbed()
                  .setColor(es.wrongcolor)
                  .setTitle(client.la[ls].common.not_connected)]}).catch(()=>{})
              }
              if(!player.queue || !player.queue.current){
                return message.reply({embeds : [new MessageEmbed()
                  .setColor(es.wrongcolor)
                  .setTitle("❌ There is no current Queue / Song Playing!")
                ]}).catch(()=>{})
              }
            }
            //if no previoussong
            if(command.parameters.previoussong){
              if (!player.queue.previous || player.queue.previous === null){
                not_allowed = true;
                message.react("❌").catch(() => {})
                return message.reply({embeds: [new MessageEmbed()
                  .setColor(es.wrongcolor)
                  .setTitle(client.la[ls].common.nothing_playing)]}).catch(()=>{})
              }
            }
            //if not in the same channel --> return
            if (player && channel.id !== player.voiceChannel && !command.parameters.notsamechannel){
              message.react("❌").catch(() => {})
              return message.reply({
                embeds: [new MessageEmbed()
                  .setColor(es.wrongcolor)
                  .setTitle(client.la[ls].common.wrong_vc)
                  .setDescription(`Channel: <#${player.voiceChannel}> `)
                ]
              }).catch(()=>{})
            }
            //if not in the same channel --> return
            if (mechannel && channel.id !== mechannel.id && !command.parameters.notsamechannel) {
              message.react("❌").catch(() => {})
              return message.reply({embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(client.la[ls].common.wrong_vc)
                .setDescription(`Channel: <#${mechannel.id}>`)
              ]}).catch(()=>{})
            }
          }
        }
        if (not_allowed) return true;
        //Execute the Command
        command.run(client, message, args, message.member, args.join(" "), prefix, player, es, ls);
      } catch (e) {
        console.log(e.stack ? String(e.stack).grey : String(e).grey)
        return message.reply({embeds: [
          new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].common.somethingwentwrong)
          .setDescription(`\`\`\`${e.message ? e.message : e.stack ? String(e.stack).grey.substr(0, 2000) : String(e).grey.substr(0, 2000)}\`\`\``)
        ]
      }).then(msg => {
        setTimeout(() => {
          msg.delete().catch(() => {});
        }, 5000)
      }).catch(() => {});
    }
  } else {
    if (unkowncmdmessage) {
        message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(handlemsg(client.la[ls].common.unknowncmd.title, {
              prefix: prefix
            }))
            .setDescription(handlemsg(client.la[ls].common.unknowncmd.description, {
              prefix: prefix
            }))
          ]
        }).then(msg => {
          setTimeout(() => {
            msg.delete().catch(() => {});
          }, 5000)
        }).catch(() => {});
      }
      return
    }
  } catch (e) {
    console.log(e.stack ? String(e.stack).grey : String(e).grey)
    return message.channel.send({
      embeds: [
        new MessageEmbed()
        .setColor("RED")
        .setTitle("❌ An error occurred")
        .setDescription(`\`\`\`yml\n${e.message ? e.message : String(e).grey.substr(0, 2000)}\`\`\``)
      ]
    }).catch(() => {})
  }
}