const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageSelectMenu,
  MessageAttachment
} = require("discord.js")
const {
  check_if_dj,
  autoplay,
  escapeRegex,
  format,
  duration,
  createBar,
  delay,
  swap_pages2_interaction
} = require("../functions");
const ms = require("ms")
const config = require(`${process.cwd()}/botconfig/config.json`);
const settings = require('../../botconfig/settings.json');
const ee = require(`${process.cwd()}/botconfig/embed`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const url = require(`${process.cwd()}/botconfig/url.json`);
const playermanager = require(`${process.cwd()}/handlers/playermanager`);
const lyricsFinder = require("lyrics-finder");
const _ = require("lodash");
//we need to create the music system, somewhere...
module.exports = client => {
  client.on("interactionCreate", async (interaction) => {
    var {
      guild,
      message,
      channel,
      member,
      user
    } = interaction;
    if (!guild) return;
    const ss = await client.Settings.findOne({
      GuildId: guild.id
    })
    const ls = ss.Language;
    const es = ss.Embed;
    const autoresume = await client.autoresume.findOne({
      guild: guild.id
    })
    const premium = await client.Premium.findOne({
      GuildId: guild.id
    });
    const musicsystem = await client.Musicsettings.findOne({
      guildId: guild.id
    });

    if (!interaction.isButton() && !interaction.isSelectMenu()) return;
    if (!musicsystem) return
    var musicChannelId = await musicsystem.channelId;
    var musicChannelMessage = await musicsystem.messageId;
    if (!musicChannelId || musicChannelId.length < 5) return;
    if (!musicChannelMessage || musicChannelMessage.length < 5) return;
    if (!channel) channel = guild.channels.cache.get(interaction.channelId);
    if (!channel) return;
    if (musicChannelId != channel.id) return;
    if (musicChannelMessage != message.id) return;
    if (!member) member = guild.members.cache.get(user.id);
    if (!member) member = await guild.members.fetch(user.id).catch(() => {});
    if (!member) return;
    if (!member.voice.channel) return interaction.reply({
      ephemeral: true,
      content: client.la[ls]["common"]["join_vc"]
    })
    if (!member.voice.channel) {
      return interaction.reply({
        content: client.la[ls]["common"]["join_vc"],
        ephemeral: true
      })
    }
    var player = client.manager.players.get(interaction.guild.id);
    if (player && member.voice.channel.id !== player.voiceChannel) {
      return interaction.reply({
        content: client.la[ls]["common"]["wrong_vc"],
        ephemeral: true
      })
    }
    if (interaction.isButton()) {
      if (!player || !player.queue || !player.queue.current) {
        return interaction.reply({
          content: client.la[ls]["common"]["nothing_playing"],
          ephemeral: true
        })
      }
      //here i use my check_if_dj function to check if he is a dj if not then it returns true, and it shall stop!
      if (ss.DjRoles.length > 5) {
        if (player && interaction.customId != `LeaveVC` && !interaction.member.roles.cache.get(ss.DjRoles) && !interaction.member.permissions.has("ADMINISTRATOR")) {
          return interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["common"]["not_DJ"]))
              .setDescription(`>>> **DJ - ROLE:** \n> <@&${ss.DjRoles}>`)
            ],
            ephemeral: true
          });
        }
      }
      switch (interaction.customId) {
        case "Previous": {
          if (!player.queue.previous) return interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setTimestamp()
              .setTitle(`${emoji.msg.ERROR} Can't find the last song`)
              .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                dynamic: true
              })))
            ]
          });
          if (!premium) {
            return interaction.reply({
              content: eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["premium"]),
            })
          } else {
            if (player.queue.previous) {
              var QueueArray = [...player.queue];
              //clear teh Queue
              player.queue.clear();
              player.queue.add(player.queue.previous);
              //now add every old song again
              for (var track of QueueArray)
                player.queue.add(track);
              //skip the track
              player.stop();
            }
            interaction.reply({
              embeds: [new MessageEmbed()
                .setColor(es.color)
                .setTimestamp()
                .setTitle(`⏮️ Playing to the last Song!`)
                .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                  dynamic: true
                })))
              ]
            });
            var data = generateQueueEmbed(client, guild.id, es, ls, ss.DjRoles)
            message.edit(data).catch((e) => {
              //console.log(e.stack ? String(e.stack).grey : String(e).grey)
            });
          }
        }
        break;
      case "Pause": {
        if (!player.playing) {
          await player.pause(false);
          interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(es.color)
              .setTimestamp()
              .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var8"]))
              .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                dynamic: true
              })))
            ]
          })
        } else {
          //pause the player
          await player.pause(true);
          interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(es.color)
              .setTimestamp()
              .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var9"]))
              .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                dynamic: true
              })))
            ]
          })
        }
        //edit the message so that it's right!
        var data = generateQueueEmbed(client, guild.id, es, ls, ss.DjRoles)
        message.edit(data).catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      }
      break;
      case "Skip": {
        //if ther is nothing more to skip then stop music and leave the Channel
        if (player.queue.size === 0) {
          //if its on autoplay mode, then do autoplay before leaving...
          if (player.get("autoplay")) {
            interaction.reply({
              embeds: [new MessageEmbed()
                .setColor(es.color)
                .setTimestamp()
                .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var1"]))
                .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                  dynamic: true
                })))
              ]
            })
            return autoplay(client, player, "skip");
          }
          if (premium && premium.BotAFK) {
            interaction.reply({
              embeds: [new MessageEmbed()
                .setColor(es.color)
                .setTimestamp()
                .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var2"]))
                .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                  dynamic: true
                })))
              ]
            })
            await client.autoresume.findOneAndDelete({
              guild: guild.id
            });
            await player.stop();
            var data = generateQueueEmbed(client, guild.id, es, ls, ss.DjRoles, true)
            message.edit(data).catch((e) => {
              //console.log(e.stack ? String(e.stack).grey : String(e).grey)
            })
            return;
          }
          interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(es.color)
              .setTimestamp()
              .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var3"]))
              .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                dynamic: true
              })))
            ]
          })
          await player.destroy()
          //edit the message so that it's right!
          var data = generateQueueEmbed(client, guild.id, es, ls, ss.DjRoles, true)
          message.edit(data).catch((e) => {
            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
          })
          return
        }
        //skip the track
        await player.stop();
        interaction.reply({
          embeds: [new MessageEmbed()
            .setColor(es.color)
            .setTimestamp()
            .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var4"]))
            .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
              dynamic: true
            })))
          ]
        })
        //edit the message so that it's right!
        var data = generateQueueEmbed(client, guild.id, es, ls, ss.DjRoles)
        message.edit(data).catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      }
      break;
      case "Stop": {
        //Stop the player
        if (premium && premium.BotAFK) {
          interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(es.color)
              .setTimestamp()
              .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var5"]))
              .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                dynamic: true
              })))
            ]
          })
          if (player) {
            // await player.destroy();
            if (autoresume) await client.autoresume.findOneAndDelete({
              guild: guild.id
            })
            await player.queue.clear();
            await player.stop();
            //edit the message so that it's right!
            var data = generateQueueEmbed(client, guild.id, es, ls, ss.DjRoles, true)
            message.edit(data).catch((e) => {
              //console.log(e.stack ? String(e.stack).grey : String(e).grey)
            })
          } else {
            // edit the message so that it's right!
            var data = generateQueueEmbed(client, guild.id, es, ls, ss.DjRoles, true)
            message.edit(data).catch((e) => {
              //console.log(e.stack ? String(e.stack).grey : String(e).grey)
            })
          }
          return;
        }
        if (player.get("autoplay")) {
          player.destroy();
          return interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(es.color)
              .setTimestamp()
              .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var6"]))
              .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                dynamic: true
              })))
            ]
          })
        }

        interaction.reply({
          embeds: [new MessageEmbed()
            .setColor(es.color)
            .setTimestamp()
            .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var7"]))
            .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
              dynamic: true
            })))
          ]
        })
        if (player) {
          // await player.destroy();
          if (autoresume) await client.autoresume.findOneAndDelete({
            guild: guild.id
          })
          await player.queue.clear();
          await player.stop();
          //edit the message so that it's right!
          var data = generateQueueEmbed(client, guild.id, es, ls, ss.DjRoles, true)
          message.edit(data).catch((e) => {
            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
          })
        } else {
          // edit the message so that it's right!
          var data = generateQueueEmbed(client, guild.id, es, ls, ss.DjRoles, true)
          message.edit(data).catch((e) => {
            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
          })
        }
      }
      break;
      case "Leave": {
        await player.destroy();
        interaction.reply({
          embeds: [new MessageEmbed()
            .setColor(es.color)
            .setTimestamp()
            .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var18"]))
            .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
              dynamic: true
            })))
          ]
        })
      }
      break;

      case "VolUp": {
        if (!premium) {
          return interaction.reply({
            content: `${emoji.msg.ERROR} Your Guild not Premium`,
          })
        } else {
          var volumeup = player.volume + 10;
          if (volumeup > 150) volumeup = 0;
          player.setVolume(volumeup);
          interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(es.color)
              .setTimestamp()
              .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var16"]))
              .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                dynamic: true
              })))
            ]
          })
          ss.Volume = player.volume;
          ss.save();
        }
      }
      break;
      case "VolDown": {
        if (!premium) {
          return interaction.reply({
            content: eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["premium"]),
          })
        } else {
          var volumedown = player.volume - 10;
          if (volumedown < 0) volumedown = 0;
          await player.setVolume(volumedown);
          interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(es.color)
              .setTimestamp()
              .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var17"]))
              .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                dynamic: true
              })))
            ]
          })
          ss.Volume = player.volume;
          ss.save();
        }
      }
      break;
      case "Forward": {
        if (!premium) {
          return interaction.reply({
            content: `${emoji.msg.ERROR} Your Guild not Premium`,
          })
        } else {
          //get the seektime variable of the user input
          var seektime = Number(player.position) + 10 * 1000;
          //if the userinput is smaller then 0, then set the seektime to just the player.position
          if (10 <= 0) seektime = Number(player.position);
          //if the seektime is too big, then set it 1 sec earlier
          if (Number(seektime) >= player.queue.current.duration) seektime = player.queue.current.duration - 1000;
          //seek to the new Seek position
          player.seek(Number(seektime));
          interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(ee.color)
              .setTimestamp()
              .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var14"]))
              .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                dynamic: true
              })))
            ]
          })
          //edit the message so that it's right!
          var data = generateQueueEmbed(client, guild.id, es, ls, ss.DjRoles)
          message.edit(data).catch((e) => {
            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
          })
        }
      }
      break;
      case "Rewind": {
        if (!premium) {
          return interaction.reply({
            content: `${emoji.msg.ERROR} Your Guild not Premium`,
          })
        } else {
          var seektime = player.position - 10 * 1000;
          if (seektime >= player.queue.current.duration - player.position || seektime < 0) {
            seektime = 0;
          }
          //seek to the new Seek position
          player.seek(Number(seektime));
          interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(ee.color)
              .setTimestamp()
              .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var15"]))
              .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                dynamic: true
              })))
            ]
          })
          //edit the message so that it's right!
          var data = generateQueueEmbed(client, guild.id, es, ls, ss.DjRoles)
          message.edit(data).catch((e) => {
            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
          })
        }
      }
      break;

      case "Shuffle": {
        //set into the player instance an old Queue, before the shuffle...
        player.set(`beforeshuffle`, player.queue.map(track => track));
        //shuffle the Queue
        player.queue.shuffle();
        //Send Success Message
        interaction.reply({
          embeds: [new MessageEmbed()
            .setColor(es.color)
            .setTimestamp()
            .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var11"]))
            .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
              dynamic: true
            })))
          ]
        })
        //edit the message so that it's right!
        var data = generateQueueEmbed(client, guild.id, es, ls, ss.DjRoles)
        message.edit(data).catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      }
      break;
      case "Autoplay": {
        if (!premium) {
          return interaction.reply({
            content: `${emoji.msg.ERROR} Your Guild not Premium`,
          })
        } else {
          if (ss.AutoPlay === false) {
            ss.AutoPlay = true,
              ss.save();
          } else if (ss.AutoPlay === true) {
            ss.AutoPlay = false,
              ss.save();
          }
          //pause the player
          player.set(`autoplay`, !player.get(`autoplay`))
          interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(es.color)
              .setTimestamp()
              .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var10"]))
              .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                dynamic: true
              })))
            ]
          })
          // edit the message so that it's right!
          var data = generateQueueEmbed(client, guild.id, es, ls, ss.DjRoles)
          message.edit(data).catch((e) => {
            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
          })
        }
      }
      break;
      case "Queue": {
        if (!premium) {
          return interaction.reply({
            content: `${emoji.msg.ERROR} Your Guild not Premium`,
          })
        } else {
          //if there is active queue loop, disable it + add embed information
          if (player.trackRepeat) {
            player.setTrackRepeat(false);
          }
          //set track repeat to revers of old track repeat
          player.setQueueRepeat(!player.queueRepeat);
          interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(es.color)
              .setTimestamp()
              .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var13"]))
              .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                dynamic: true
              })))
            ]
          })
          //edit the message so that it's right!
          var data = generateQueueEmbed(client, guild.id, es, ls, ss.DjRoles)
          message.edit(data).catch((e) => {
            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
          })
        }
      }
      break;
      case "Song": {
        //if there is active queue loop, disable it + add embed information
        if (player.queueRepeat) {
          player.setQueueRepeat(false);
        }
        //set track repeat to revers of old track repeat
        player.setTrackRepeat(!player.trackRepeat);
        interaction.reply({
          embeds: [new MessageEmbed()
            .setColor(es.color)
            .setTimestamp()
            .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var12"]))
            .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
              dynamic: true
            })))
          ]
        })
        //edit the message so that it's right!
        var data = generateQueueEmbed(client, guild.id, es, ls, ss.DjRoles)
        message.edit(data).catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      }
      break;
      case "Lyrics": {
        if (!premium) {
          return interaction.reply({
            content: `${emoji.msg.ERROR} Your Guild not Premium`,
          })
        } else {
          SongTitle = player.queue.current.title;
          SongTitle = SongTitle.replace(/lyrics|lyric|lyrical|official music video|\(official music video\)|audio|official|official video|official video hd|official hdvideo|offical video music|\(offical video music\)|extended|hd|(\[.+\])/gi, "");
          let lyrics = await lyricsFinder(SongTitle);
          if (!lyrics) {
            return interaction.reply(`**No lyrics found for -** \`${SongTitle}\``);
          }
          lyrics = lyrics.split("\n"); //spliting into lines
          let SplitedLyrics = _.chunk(lyrics, 40); //45 lines each page
          let Pages = SplitedLyrics.map((ly) => {
            let em = new MessageEmbed()
              .setTitle(`${emoji.msg.lyrics} Lyrics for: ${SongTitle}`)
              .setColor(es.color)
              .setDescription(ly.join("\n"))
              .setThumbnail(player.queue.current.displayThumbnail())
            return em;
          })
          swap_pages2_interaction(client, interaction, Pages);
        }
      }
      break;
      }
    }
    if (interaction.isSelectMenu()) {
      let link = "https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF?si=f762f2da726d4b4d";
      if (interaction.values[0]) {
        //global hits
        if (interaction.values[0].toLowerCase().startsWith("glo")) link = "https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF?si=e54359b559c844d3";
        //indonesia hits
        if (interaction.values[0].toLowerCase().startsWith("ind")) link = "https://open.spotify.com/playlist/37i9dQZEVXbObFQZ3JLcXt?si=0942539d9ebf4468";
        //Pop hits indonesia
        if (interaction.values[0].toLowerCase().startsWith("hi")) link = "https://open.spotify.com/playlist/1OSkC3ByYxFpZvKZztth84?si=085dda9be8d44c6d";
        //Kpop hits
        if (interaction.values[0].toLowerCase().startsWith("k-p")) link = "https://open.spotify.com/playlist/37i9dQZF1DX9tPFwDMOaN1?si=eb1ec325027a47d0";
        //Kpop 2020 hits
        if (interaction.values[0].toLowerCase().startsWith("kpo")) link = "https://open.spotify.com/playlist/3kwb1LyzCSsLLacppOJQc8?si=0fba1c4443a048a3";
        //lofi
        if (interaction.values[0].toLowerCase().startsWith("lof")) link = "https://open.spotify.com/playlist/4Tgee3qSWkVC674ZgGVuaf?si=19905d3f6225400c";
        //moody mix
        if (interaction.values[0].toLowerCase().startsWith("moo")) link = "https://open.spotify.com/playlist/4ctyjX4W80K4DV0KdF3qgJ?si=c0436b96cdb74bc3";
        //ncs | no copyrighted music
        if (interaction.values[0].toLowerCase().startsWith("n")) link = "https://open.spotify.com/playlist/3es90g6Y7d405MW6SgsqgM?si=0a11af6c0c924b93";
        //pop
        if (interaction.values[0].toLowerCase().startsWith("p")) link = "https://open.spotify.com/playlist/4w78Satvtff0aiUekyDvhS?si=6ddd719968024210";
        //remixes from Magic Release
        if (interaction.values[0].toLowerCase().startsWith("re")) link = "https://www.youtube.com/watch?v=4sCRpf8jejk&list=PLYUn4Yaogdah0yflxzzXl71XNQmiflX8L"
        //rock
        if (interaction.values[0].toLowerCase().startsWith("ro")) link = "https://open.spotify.com/playlist/37i9dQZF1EQpj7X7UK8OOF?si=2b6358c1f85b47bd";
        //oldgaming
        if (interaction.values[0].toLowerCase().startsWith("o")) link = "https://www.youtube.com/watch?v=iFOAJ12lDDU&list=PLYUn4YaogdahPQPTnBGCrytV97h8ABEav"
        //gaming
        if (interaction.values[0].toLowerCase().startsWith("gam")) link = "https://open.spotify.com/playlist/37i9dQZF1DWYN9NBqvY7Tx?si=ac3e0450442540d7";
        //Charts
        if (interaction.values[0].toLowerCase().startsWith("cha")) link = "https://www.youtube.com/playlist?list=PLMC9KNkIncKvYin_USF1qoJQnIyMAfRxl"
        //Chill
        if (interaction.values[0].toLowerCase().startsWith("chi")) link = "https://open.spotify.com/playlist/6IKQrtMc4c00YzONcUt7QH?si=08aaa161835f4a33";
        //Jazz
        if (interaction.values[0].toLowerCase().startsWith("j")) link = "https://open.spotify.com/playlist/37i9dQZF1DXbOVU4mpMJjh?si=51a68490029244f8";
        //blues
        if (interaction.values[0].toLowerCase().startsWith("b")) link = "https://open.spotify.com/playlist/6Rq9OvQPtR41K0i5xeISkM?si=209752f810c54114";
        //strange-fruits
        if (interaction.values[0].toLowerCase().startsWith("s")) link = "https://open.spotify.com/playlist/6xGLprv9fmlMgeAMpW0x51?si=873d6f3102564e0b";
        //metal
        if (interaction.values[0].toLowerCase().startsWith("me")) link = "https://open.spotify.com/playlist/79QHayucQm6M4wUlUbhQNQ?si=6867122e0fde4325";
      }
      interaction.reply({
        embeds: [new MessageEmbed()
          .setColor(es.color)
          .setAuthor(client.getAuthor(`Loading '${interaction.values[0] ? interaction.values[0] : "Default"}' Music Mix`, "https://imgur.com/xutrSuq.gif", link))
          // .setTitle(eval(client.la[ls]["cmds"]["music"]["playmusicmix"]["variable1"]))
          // .setDescription(eval(client.la[ls]["cmds"]["music"]["playmusicmix"]["variable2"]))
          // .addField(eval(client.la[ls]["cmds"]["music"]["playmusicmix"]["variablex_3"]), eval(client.la[ls]["cmds"]["music"]["playmusicmix"]["variable3"]))
          .setFooter(client.getFooter(es))
        ]
      })
      //play the SONG from YOUTUBE
      playermanager(client, {
        guild,
        member,
        author: member.user,
        channel
      }, Array(link), `song:youtube`, interaction, "songoftheday");
    }
  })
  client.on("messageCreate", async message => {
    if (!message.guild) return;
    var data = await client.Musicsettings.findOne({
      guildId: message.guild.id
    }).clone();
    if (!data) return;
    const musicChannelId = data.channelId;
    if (!musicChannelId || musicChannelId.length < 5) return;
    if (musicChannelId != message.channel.id) return;

    const player = client.manager.players.get(message.guild.id);
    if (message.author.id === client.user.id) {
      await delay(3000);
      message.delete().catch(() => {})
    } else {
      message.delete().catch(() => {})
    }
    if (message.author.bot) return;
    const ss = await client.Settings.findOne({
      GuildId: message.guild.id
    });
    const prefix = ss.Prefix;
    //get the prefix regex system
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    var args;
    var cmd;
    if (prefixRegex.test(message.content)) {
      const [, matchedPrefix] = message.content.match(prefixRegex);
      args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
      cmd = args.shift().toLowerCase();
      if (cmd || cmd.length === 0) return
      var command = client.commands.get(cmd);
      if (!command) command = client.commands.get(client.aliases.get(cmd));
      if (command) return;
    }
    const {
      channel
    } = message.member.voice;
    if (!channel) return message.reply(client.la[ls]["common"]["join_vc"]).then(msg => {
      setTimeout(() => {
        try {
          msg.delete().catch(() => {});
        } catch (e) {}
      }, 5000)
    })
    if (player && channel.id !== player.voiceChannel) return message.reply(client.la[ls]["common"]["wrong_vc"]).then(msg => {
      setTimeout(() => {
        try {
          msg.delete().catch(() => {});
        } catch (e) {}
      }, 3000)
    })
    else {
      return playermanager(client, message, message.content.trim().split(/ +/), "request:song");
    }
  })
}

function generateQueueEmbed(client, guildId, es, ls, djroles, leave) {
  let guild = client.guilds.cache.get(guildId)
  if (!guild) return;
  var embeds = [
    new MessageEmbed()
    .setColor("DARK_RED")
    .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var19"])),
    new MessageEmbed()
    .setColor("DARK_RED")
    .setFooter(client.getFooter(`${ee.footertext}\n${client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var20"]}`, client.user.displayAvatarURL()))
    .setImage(guild.banner ? guild.bannerURL({
      size: 4096
    }) : "https://cdn.discordapp.com/attachments/784917578974756904/938482878252187678/New_BV_GIF.gif")
    .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["musicsystem"]["var21"]))
    .setDescription(`🔴 Youtube 🟢 Spotify 🟠 Soundcloud, ⚪️ iTunes, 💾 and direct MP3 Links!`)
    .addFields({
      name: "🌐",
      value: `┕[[Website]](${url.website.web})`,
      inline: true,
    }, {
      name: "🏠",
      value: `┕[[Support]](${url.website.supportserver})`,
      inline: true,
    }, {
      name: `📥`,
      value: `┕[[Invite]](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=identify%20email%20guilds%20bot%20applications.commands)`,
      inline: true,
    })
  ]
  const player = client.manager.players.get(guild.id);
  if (!leave && player && player.queue && player.queue.current) {
    embeds[1].setImage(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
      .setFooter(client.getFooter(`Requested by: ${player.queue.current.requester.tag}`, player.queue.current.requester.displayAvatarURL({
        dynamic: true
      })))
      .addField(`${emoji.msg.time} Duration: `, `┕\`${format(player.queue.current.duration).split(" | ")[0]}\` | \`${format(player.queue.current.duration).split(" | ")[1]}\``, true)
      .addField(`${emoji.msg.song_by} Song By: `, `┕\`${player.queue.current.author}\``, true)
      .addField(`${emoji.msg.repeat_mode} Queue length: `, `┕\`${player.queue.length} Songs\``, true)
      .addField(`${emoji.msg.raise_volume} Volume: `, `┕\`${player.volume}\``, true)
      .addField(`🎚 Equalizer: `, `┕\`${player.get(`eq`)}\``, true)
      .addField(`🎚 Filter: `, `┕\`${player.get(`filter`)}\``, true)
      .setAuthor(client.getAuthor(`${player.queue.current.title}`, "https://images-ext-1.discordapp.net/external/DkPCBVBHBDJC8xHHCF2G7-rJXnTwj_qs78udThL8Cy0/%3Fv%3D1/https/cdn.discordapp.com/emojis/859459305152708630.gif", player.queue.current.uri))
      .setColor("GREEN")
    delete embeds[1].description;
    delete embeds[1].title;
    //get the right tracks of the current tracks
    const tracks = player.queue;
    var maxTracks = 10; //tracks / Queue Page
    //get an array of quelist where 10 tracks is one index in the array
    var songs = tracks.slice(0, maxTracks);
    embeds[0] = new MessageEmbed()
      .setTitle(`📃 Queue of __${guild.name}__  -  [ ${player.queue.length} Tracks ]`)
      .setColor("GREEN")
      .setDescription(String(songs.map((track, index) => `**\` ${++index}. \` [${track.title.substr(0, 60).replace(/\[/igu, "\\[").replace(/\]/igu, "\\]")}](${track.uri})** - \`${track.isStream ? `LIVE STREAM` : format(track.duration).split(` | `)[0]}\`\n> *Requested by: __${track.requester.tag}__*`).join(`\n`)).substr(0, 2048));
    if (player.queue.length > 10)
      embeds[0].addField(`**\` N. \` *${player.queue.length > maxTracks ? player.queue.length - maxTracks : player.queue.length} other Tracks ...***`, `\u200b`)
    embeds[0].addField(`**__NOW PLAYING__**`, `**[${player.queue.current.title.substr(0, 60).replace(/\[/igu, "\\[").replace(/\]/igu, "\\]")}](${player.queue.current.uri})** - \`${player.queue.current.isStream ? `LIVE STREAM` : format(player.queue.current.duration).split(` | `)[0]}\`\n> *Requested by: __${player.queue.current.requester.tag}__*`)

  }
  var Emojis = [
    emoji.kucluck.number.kosong,
    emoji.kucluck.number.satu,
    emoji.kucluck.number.dua,
    emoji.kucluck.number.tiga,
    emoji.kucluck.number.empat,
    emoji.kucluck.number.lima,
    emoji.kucluck.number.enam,
    emoji.kucluck.number.tujuh,
    emoji.kucluck.number.delapan,
    emoji.kucluck.number.sembilan,
    emoji.kucluck.number.sepuluh,
    emoji.kucluck.number.sebelas,
    emoji.kucluck.number.duabelas,
    emoji.kucluck.number.tigabelas,
    emoji.kucluck.number.empatbelas,
    emoji.kucluck.number.limabelas,
    emoji.kucluck.number.enambelas,
    emoji.kucluck.number.tujuhbelas,
  ]
  //now we add the components!
  var musicmixMenu = new MessageSelectMenu()
    .setCustomId("MessageSelectMenu")
    .addOptions([
      "Global Hits", "Indonesia Hits", "Hits Indonesia 2015-2020", "K-pop Daebak", "Kpop 2022 Hits", "Lofi", "Moody Mix", "Pop", "Strange-Fruits", "Gaming", "Chill", "Rock", "Jazz", "Blues", "Metal", "Magic-Release", "NCS | No Copyright Music"
    ].map((t, index) => {
      return {
        label: t.substr(0, 25),
        value: t.substr(0, 25),
        description: `Load a Bad Vibes-Playlist: "${t}"`.substr(0, 50),
        emoji: Emojis[index]
      }
    }))
    .setPlaceholder("Playlist Selection by Bad Vibes")
  var previousbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Previous').setEmoji(`⏮️`).setLabel(`Previous`).setDisabled();
  var pausebutton = new MessageButton().setStyle('SECONDARY').setCustomId('Pause').setEmoji('⏸').setLabel(`Pause`).setDisabled();
  var skipbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Skip').setEmoji(`⏭`).setLabel(`Skip`).setDisabled();
  var stopbutton = new MessageButton().setStyle('DANGER').setCustomId('Stop').setEmoji(`⏹️`).setLabel(`Stop`).setDisabled();
  var leavebutton = new MessageButton().setStyle('DANGER').setCustomId('Leave').setEmoji(`🚪`).setLabel(`Leave`).setDisabled();

  var volup = new MessageButton().setStyle('PRIMARY').setCustomId('VolUp').setEmoji(`🔊`).setLabel(`Vol +10`).setDisabled();
  var voldown = new MessageButton().setStyle('PRIMARY').setCustomId('VolDown').setEmoji(`🔉`).setLabel(`Vol -10`).setDisabled();

  var shufflebutton = new MessageButton().setStyle('PRIMARY').setCustomId('Shuffle').setEmoji('🔀').setLabel(`Shuffle`).setDisabled();
  var autoplaybutton = new MessageButton().setStyle('SECONDARY').setCustomId('Autoplay').setEmoji('♾').setLabel(`Autoplay`).setDisabled();
  var queuebutton = new MessageButton().setStyle('SECONDARY').setCustomId('Queue').setEmoji(`🔂`).setLabel(`Loop Queue`).setDisabled();

  // var forwardbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Forward').setEmoji('⏩').setLabel(`+10 Sec`).setDisabled();
  // var rewindbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Rewind').setEmoji('⏪').setLabel(`-10 Sec`).setDisabled();
  // var songbutton = new MessageButton().setStyle('SECONDARY').setCustomId('Song').setEmoji(`🔁`).setLabel(`Loop Song`).setDisabled();
  // var lyricsbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Lyrics').setEmoji('📝').setLabel(`Lyrics`).setDisabled();

  if (!leave && player && player.queue && player.queue.current) {
    previousbutton = previousbutton.setDisabled(false);
    pausebutton = pausebutton.setDisabled(false);
    skipbutton = skipbutton.setDisabled(false);
    stopbutton = stopbutton.setDisabled(false);
    leavebutton = leavebutton.setDisabled(false);

    volup = volup.setDisabled(false);
    voldown = voldown.setDisabled(false);
    shufflebutton = shufflebutton.setDisabled(false);
    autoplaybutton = autoplaybutton.setDisabled(false);
    queuebutton = queuebutton.setDisabled(false);

    // forwardbutton = forwardbutton.setDisabled(false);
    // rewindbutton = rewindbutton.setDisabled(false);
    // songbutton = songbutton.setDisabled(false);
    // lyricsbutton = lyricsbutton.setDisabled(false);

    if (player.get("autoplay")) {
      autoplaybutton = autoplaybutton.setStyle('SUCCESS').setLabel(`Autoplay`)
      stopbutton = stopbutton.setDisabled(true);
    }
    if (!player.playing) {
      pausebutton = pausebutton.setStyle('SUCCESS').setEmoji('▶️').setLabel(`Resume`)
    }
    if (!player.queueRepeat && !player.trackRepeat) {
      // songbutton = songbutton.setStyle('SECONDARY')
      queuebutton = queuebutton.setStyle('SECONDARY')
    }
    if (player.trackRepeat) {
      // songbutton = songbutton.setStyle('SECONDARY')
      queuebutton = queuebutton.setStyle('SUCCESS')
    }
    if (player.queueRepeat) {
      // songbutton = songbutton.setStyle('SUCCESS')
      queuebutton = queuebutton.setStyle('SECONDARY')
    }
  }
  //now we add the components!
  var components = [
    new MessageActionRow().addComponents([
      musicmixMenu
    ]),
    new MessageActionRow().addComponents([
      previousbutton,
      pausebutton,
      skipbutton,
      stopbutton,
      leavebutton,
    ]),
    new MessageActionRow().addComponents([
      volup,
      voldown,
      shufflebutton,
      autoplaybutton,
      queuebutton,
    ]),
    // new MessageActionRow().addComponents([
    //   shufflebutton,
    //   autoplaybutton,
    //   queuebutton,
    //   songbutton,
    //   lyricsbutton,
    // ]),
  ]
  return {
    embeds,
    components
  }
}
module.exports.generateQueueEmbed = generateQueueEmbed;