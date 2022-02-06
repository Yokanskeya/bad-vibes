const {
  MessageEmbed, MessageReaction, User, UserFlags,
} = require("discord.js");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  autoplay,
} = require(`${process.cwd()}/handlers/functions`);
const SettingsSchema = require ('../../databases/settings');
let USED = false;
module.exports = {
  name: "skip",
  category: `Music`,
  aliases: ["voteskip", "s", "vs"],
  description: "Skips the current song",
  usage: "skip",
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": false,
    "previoussong": false
  },
  type: "song",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let user = client.manager.get(message.guild.id);
    const { channel } = message.member.voice;

    //if the member is not in a channel, return
    if (!channel) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].common.join_vc)
        ]
      });
    }

    if (!player) {
      if (message.guild.me.voice.channel) {
        try {
          message.guild.me.voice.disconnect();
        } catch {}
        message.reply({
          embeds: [new MessageEmbed()
            .setTitle(client.la[ls].cmds.music.skip.title)
            .setColor(es.color)
          ]
        });
        return message.react(emoji.react.stop).catch((e) => {})
      } else {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(client.la[ls].common.nothing_playing)
          ]
        });
      }
      return
    }

    if (channel.id !== player.voiceChannel)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].common.wrong_vc)
          .setDescription(eval(client.la[ls]["cmds"]["music"]["skip"]["variable1"]))
        ]
      });
    
    //if dj role not setup
    let ss = await SettingsSchema.findOne({ GuildId : message.guild.id });
    if(ss.DjRoles === "") {
      if (player.get("autoplay")) return autoplay(client, player, "skip");
      user.stop();
      //send success message
      message.reply({
          embeds: [new MessageEmbed()
              .setTitle(client.la[ls].cmds.music.skip.title2)
              .setColor(es.color)
          ]
      });
      return message.react(emoji.react.skip_track).catch((e) => {})
    }

    const DJRole = message.member.roles.cache.get(ss.DjRoles);
    const Admin = message.member.permissions.has("MANAGE_CHANNELS");

    try {
      const guildID = message.guild.id;
      const player = client.manager.players.get(guildID)
      if (player && channel){
        if(player.voiceChannel === channel.id){
          //if dj role & admin & member voice === 1
          const members = channel.members.filter(m => !m.user.bot);
          if (DJRole || Admin || members.size === 1){
            if (player.get("autoplay")) return autoplay(client, player, "skip");
              user.stop();
              //send success message
              message.reply({
                  embeds: [new MessageEmbed()
                      .setTitle(client.la[ls].cmds.music.skip.title2)
                      .setColor(es.color)
                  ]
              });
              return message.react(emoji.react.skip_track).catch((e) => {})
          }
          //if not dj role & admin & member voice === 1
          else {
            if (!USED){
              USED = true;
              const votesRequired = Math.ceil(members.size * .6);
              const voteEmbed = new MessageEmbed()
              .setTitle (eval(client.la[ls]["cmds"]["music"]["skip"]["variable2"]))
              .setColor(es.succescolor)
              .setFooter(eval(client.la[ls]["cmds"]["music"]["skip"]["variable3"]))
              const msg = await message.channel.send({
                  embeds : [voteEmbed]
              })
              const msgr = await msg.react(`👍`);
          
              const filter = (reaction, user) => {
                if(user.bot) return false;
                const { channel } = message.guild.members.cache.get(user.id).voice;
                if (channel) {
                  if (channel.id === player.voiceChannel) {
                    return ['👍'].includes(reaction.emoji.name);
                  } 
                  return false;
                } else {
                  return false;
                } 
              } 
              try {
                const reactions = await msg.awaitReactions({ 
                    filter, 
                    max: votesRequired, 
                    time: 60000,
                    errors: ['time'] 
                  });
                const totalVotes = reactions.get('👍').users.cache.filter(u => !u.bot);
                if (totalVotes.size >= votesRequired) {
                  message.react(emoji.react.skip_track).catch((e) => {})
                  message.reply({
                      embeds: [new MessageEmbed()
                          .setTitle(client.la[ls].cmds.music.skip.title2)
                          .setColor(es.color)
                      ]
                  });
                  await user.stop();
                  await msg.delete()
                  USED = false;
                }
              } catch {
                  msg.edit({
                      embeds: [
                          // voteEmbed.setTitle(":x: | Command cannot be used because timeout."),
                          voteEmbed.setFooter(client.getFooter(eval(client.la[ls]["cmds"]["music"]["skip"]["variable4"]))).setColor(es.wrongcolor)
                      ]
                  })
                  await msgr.remove();
                  USED = false;
              }
            } 
            else {
              return message.channel.send({
                    embeds: [new MessageEmbed()
                      .setColor(es.wrongcolor)
                      .setThumbnail(es.thumb ? url.img.ERROR : null)
                      .setTitle(eval(client.la[ls]["cmds"]["music"]["skip"]["variable5"]))
                    ]
                });
            }
          }
        }
      }
    } catch (e) {
      console.log(e.stack ? String(e.stack).grey : String(e).grey)
      return message.reply({
          embeds: [new MessageEmbed()
              .setColor("RED")
              .setTitle(eval(client.la[ls]["cmds"]["music"]["skip"]["variable6"]))
              .setDescription(`\`\`\`${e.message ? e.message : String(e).grey.substr(0, 2000)}\`\`\``)
          ]
      }).catch(() => {})
    }
  }
};