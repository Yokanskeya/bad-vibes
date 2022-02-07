var {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  Permissions
} = require(`discord.js`),
  ms = require(`ms`),

  config = require(`${process.cwd()}/botconfig/config.json`),
  settings = require(`${process.cwd()}/botconfig/settings.json`),
  emoji = require(`${process.cwd()}/botconfig/emojis.json`),
  ee = require(`${process.cwd()}/botconfig/embed`), {
    TrackUtils
  } = require(`erela.js`), {
    createBar,
    format,
    check_if_dj,
    databasing,
    autoplay,
    delay,
    swap_pages2_interaction_DM
  } = require(`${process.cwd()}/handlers/functions`),
  playermanager = require(`${process.cwd()}/handlers/playermanager`),
  musicsettings = require("../../databases/musicsettings"),
  SettingsSchema = require('../../databases/settings'),
  premiumSchema = require('../../databases/premium'),
  StatsGSchema = require('../../databases/statsGlobal'),
  StatsSchema = require('../../databases/stats'),
  autoresumeSchema = require("../../databases/autoresume"),
  lyricsFinder = require("lyrics-finder"),
  _ = require("lodash");

playercreated = new Map(),
  collector = false,
  playerintervals = new Map(),
  playerintervals_autoresume = new Map();

module.exports = (client) => {
  /**
   * AUTO-RESUME-FUNCTION
   */
  const autoconnect = async () => {
    await delay(500);
    await autoresumeSchema.find({}, async (err, data) => {
      data.forEach(async (value) => {
        let guilds = client.guilds.cache.get(value.guild)
        if (!guilds || guilds.length == 0) return;
        try {
          let guild = client.guilds.cache.get(guilds.id);
          if (!guild) {
            await autoresumeSchema.findOneAndDelete({
              guild: guild.id
            });
            return client.logger(`Autoresume`.brightCyan + ` - Bot got Kicked out of the Guild in ${String(guild.name).brightBlue}`)
          }
          let voiceChannel = guild.channels.cache.get(value.voiceChannel);
          const premium = await client.Premium.findOne({
            GuildId: guild.id
          });
          const ss = await client.Settings.findOne({
            GuildId: guild.id
          });
          if (!voiceChannel) voiceChannel = await guild.channels.fetch(value.voiceChannel).catch(() => {}) || false;
          if (!voiceChannel) {
            await autoresumeSchema.findOneAndDelete({
              guild: guild.id
            });
            return client.logger(`Autoresume`.brightCyan + ` - Destroy player, no voiceChannel in ${String(guild.name).brightBlue}`)
          }
          if (!voiceChannel.members || voiceChannel.members.filter(m => !m.user.bot && !m.voice.deaf && !m.voice.selfDeaf).size < 1) {
            await autoresumeSchema.findOneAndDelete({
              guild: guild.id
            });
            client.logger(`Autoresume`.brightCyan + ` - Voice Channel is either Empty / no Listeners / got deleted in ${String(guild.name).brightBlue}`)
          }
          let textChannel = guild.channels.cache.get(value.textChannel);
          if (!textChannel) textChannel = await guild.channels.fetch(value.textChannel).catch(() => {}) || false;
          if (!textChannel) {
            await autoresumeSchema.findOneAndDelete({
              guild: guild.id
            });
            client.logger(`Autoresume`.brightCyan + ` - Text Channel got deleted in ${String(guild.name).brightBlue}`)
          }
          let player = await client.manager.create({
            guild: value.guild,
            voiceChannel: value.voiceChannel,
            textChannel: value.textChannel,
            selfDeafen: true,
          })
          player.set("autoresume", true);
          if (player && player.node && !player.node.connected) await player.node.connect();
          await player.connect();
          await player.setVolume(ss.Volume)
          if (value.current && value.current.identifier) {
            const buildTrack = async (data) => {
              return data.track && data.identifier ? TrackUtils.build({
                  track: data.track,
                  info: {
                    title: data.title || null,
                    identifier: data.identifier,
                    author: data.author || null,
                    length: data.length || data.duration || null,
                    isSeekable: !!data.isStream,
                    isStream: !!data.isStream,
                    uri: data.uri || null,
                    thumbnail: data.thumbnail || null,
                  }
                }, data.requester ? client.users.cache.get(data.requester) || await client.users.fetch(data.requester).catch(() => {}) || null : null) :
                TrackUtils.buildUnresolved({
                  title: data.title || '',
                  author: data.author || '',
                  duration: data.duration || 0
                }, data.requester ? client.users.cache.get(data.requester) || await client.users.fetch(data.requester).catch(() => {}) || null : null)
            }
            player.queue.add(await buildTrack(value.current));
            player.set("playerauthor", value.current.requester);
            player.play();
            if (value.queue.length)
              for (let track of value.queue) player.queue.add(await buildTrack(track))
          } else if (value.queue && value.queue.length) {
            const track = await buildTrack(value.queue.shift());
            player.queue.add(track)
            player.play()
            if (value.queue.length)
              for (let track of value.queue) player.queue.add(await buildTrack(track))
          } else if (premium && premium.BotAFK) {
            // destroy player if not voiceChannel
            if (!player.voiceChannel && !player.textChannel) {
              player.destroy();
              client.logger(`Autoresume`.brightCyan + ` - Destroyed the player in ${String(guild.name).brightBlue} because no data in Autoresume Schema!.`);
            }
            client.logger(`AFK Mode`.brightCyan + ` - Joining the player to ${String(guild.name).brightBlue} in ${String(guild.channels.cache.get(player.voiceChannel).name).blue}.`);
          } else {
            player.destroy();
            client.logger(`Autoresume`.brightCyan + ` - Destroyed the player in ${String(guild.name).brightBlue}, because there are no tracks available.`);
          }
          client.logger(`Autoresume`.brightCyan + ` - Added ${player.queue.length} Tracks on the QUEUE and started playing ${player.queue.current.title} in ${String(guild.name).brightBlue}`);
          //ADJUST THE QUEUE SETTINGS
          player.set("pitchvalue", value.pitchvalue)
          await player.seek(value.position);
          if (value.queueRepeat) player.setQueueRepeat(value.queueRepeat);
          if (value.trackRepeat) player.setTrackRepeat(value.trackRepeat);
          if (!value.playing) player.pause(true);
          switch (value.eq) {
            case `💣 None`:
              player.set("eq", "💣 None");
              await player.setEQ(client.eqs.music);
              break;
            case `🎵 Music`:
              player.set("eq", "🎵 Music");
              await player.setEQ(client.eqs.music);
              break;
            case `🎙 Pop`:
              player.set("eq", "🎙 Pop");
              await player.setEQ(client.eqs.pop);
              break;
            case `💾 Electronic`:
              player.set("eq", "💾 Electronic");
              await player.setEQ(client.eqs.electronic);
              break;
            case `📜 Classical`:
              player.set("eq", "📜 Classical");
              await player.setEQ(client.eqs.classical);
              break;
            case `🎚 Metal`:
              player.set("eq", "🎚 Metal");
              await player.setEQ(client.eqs.rock);
              break;
            case `📀 Full`:
              player.set("eq", "📀 Full");
              await player.setEQ(client.eqs.full);
              break;
            case `💿 Light`:
              player.set("eq", "💿 Light");
              await player.setEQ(client.eqs.light);
              break;
            case `🕹 Gaming`:
              player.set("eq", "🕹 Gaming");
              await player.setEQ(client.eqs.gaming);
              break;
            case `🎛 Bassboost`:
              player.set("eq", "🎛 Bassboost");
              await player.setEQ(client.eqs.bassboost);
              break;
            case `🔈 Earrape`:
              player.set("eq", "🔈 Earrape");
              await player.setVolume(player.volume + 50);
              await player.setEQ(client.eqs.earrape);
              break;
          }
          switch (value.filter) {
            case "💯 Vibrato": {
              require("../../commands/Filter/vibrato").run(client, {
                guild: {
                  id: player.guild
                }
              }, [], null, null, null, player)
            }
            break;
          case "💢 Vibrate": {
            require("../../commands/Filter/vibrate").run(client, {
              guild: {
                id: player.guild
              }
            }, [], null, null, null, player)
          }
          break;
          case "🏮 Tremolo": {
            require("../../commands/Filter/tremolo").run(client, {
              guild: {
                id: player.guild
              }
            }, [], null, null, null, player)
          }
          break;
          case "⏱ Speed": {
            require("../../commands/Filter/speed").run(client, {
              guild: {
                id: player.guild
              }
            }, [player.get("filtervalue")], null, null, null, player)
          }
          break;
          case "⏱ Slowmode": {
            require("../../commands/Filter/slowmo").run(client, {
              guild: {
                id: player.guild
              }
            }, [], null, null, null, player)
          }
          break;
          case "📉 Rate": {
            require("../../commands/Filter/rate").run(client, {
              guild: {
                id: player.guild
              }
            }, [player.get("filtervalue")], null, null, null, player)
          }
          break;
          case "📈 Pitch": {
            require("../../commands/Filter/pitch").run(client, {
              guild: {
                id: player.guild
              }
            }, [player.get("filtervalue")], null, null, null, player)
          }
          break;
          case "👻 Nightcore": {
            require("../../commands/Filter/nightcore").run(client, {
              guild: {
                id: player.guild
              }
            }, [], null, null, null, player)
          }
          break;
          case "👾 Darth Vader": {
            require("../../commands/Filter/darthvader").run(client, {
              guild: {
                id: player.guild
              }
            }, [], null, null, null, player)
          }
          break;
          case "🐿️ Chipmunk": {
            require("../../commands/Filter/chipmunk").run(client, {
              guild: {
                id: player.guild
              }
            }, [], null, null, null, player)
          }
          break;
          case "👺 China": {
            require("../../commands/Filter/china").run(client, {
              guild: {
                id: player.guild
              }
            }, [], null, null, null, player)
          }
          break;
          case "🎚 Low Bass": {
            require("../../commands/Filter/bassboost").run(client, {
              guild: {
                id: player.guild
              }
            }, ["low"], null, null, null, player)
          }
          break;
          case "🎚 Medium Bass": {
            require("../../commands/Filter/bassboost").run(client, {
              guild: {
                id: player.guild
              }
            }, ["medium"], null, null, null, player)
          }
          break;
          case "🎚 High Bass": {
            require("../../commands/Filter/bassboost").run(client, {
              guild: {
                id: player.guild
              }
            }, ["high"], null, null, null, player)
          }
          break;
          case "🎚 Earrape Bass": {
            require("../../commands/Filter/bassboost").run(client, {
              guild: {
                id: player.guild
              }
            }, ["earrape"], null, null, null, player)
          }
          break;
          case "🔊 8D": {
            require("../../commands/Filter/3d").run(client, {
              guild: {
                id: player.guild
              }
            }, [], null, null, null, player)
          }
          break;
          }
          await autoresumeSchema.findOneAndDelete({
            guild: player.guild
          });
          client.logger(`Autoresume`.brightCyan + ` - Changed autoresume track to queue adjustments + deleted the database entry in ${String(guild.name).brightBlue}`)
          if (value.playing) {
            setTimeout(() => {
              player.pause(true);
              setTimeout(() => player.pause(false), client.ws.ping * 2);
            }, client.ws.ping * 2)
          }
          await delay(settings["auto-resume-delay"] || 1000)
        } catch (e) {}
      })
    }).clone();
  }
  /**
   * PLAYER / MANAGER EVENTS
   */
  let started = false;
  client.manager
    .on(`nodeConnect`, (node) => {
      if (!started) {
        started = true;
        setTimeout(() => autoconnect(), 2 * client.ws.ping)
      }
      setTimeout(() => {
        started = false;
      }, 5000)
    })
    .on(`playerCreate`, async (player) => {
      playercreated.set(player.guild, true)
      //for checking the relevant messages
      var interval = setInterval(async () => {
        let mss = await musicsettings.findOne({
          guildId: player.guild
        }).clone();
        if (mss.channelId && mss.channelId.length > 5 && player.textChannel === mss.channelId && player.playing) {
          let messageId = await mss.messageId;
          //try to get the guild
          let guild = client.guilds.cache.get(player.guild);
          if (!guild) return client.logger(`Music System`.brightCyan + ` - Relevant Checker - Guild not found in ${String(guild.name).brightBlue}`)
          //try to get the channel
          let channel = await guild.channels.cache.get(mss.channelId);
          if (!channel) channel = await guild.channels.fetch(mss.channelId).catch(() => {}) || false
          if (!channel) return client.logger(`Music System`.brightCyan + ` - Relevant Checker - Channel not found in ${String(guild.name).brightBlue}`)
          if (!channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)) return client.logger(`Music System - Relevant Checker - Missing Permissions`)
          //try to get the channel
          let messages = await channel.messages.fetch();
          if (messages.filter(m => m.id != messageId).size > 0) {
            channel.bulkDelete(messages.filter(m => m.id != messageId)).then(messages => client.logger(`Music System`.brightCyan + ` - Relevant Checker - Bulk deleted ${messages.size} messages in ${String(guild.name).brightBlue}`)).catch(() => {})
          } else {
            client.logger(`Music System`.brightCyan + ` - Relevant Checker - No Relevant Messages in ${String(guild.name).brightBlue}`)
          }
        }
      }, 120000);
      playerintervals.set(player.guild, interval);
      /**
       * AUTO-RESUME-DATABASING
       */
      var autoresumeinterval = setInterval(async () => {
        var pl = client.manager.players.get(player.guild);
        let ss = await client.Settings.findOne({
          GuildId: pl.guild
        }).clone();
        if (ss.Autoresume) {
          let filter = pl.get(`filter`)
          let filtervalue = pl.get(`filtervalue`)
          let autoplay = ss.AutoPlay;
          let eq = pl.get(`eq`)

          const makeTrack = track => {
            return {
              track: track.track,
              title: track.title || null,
              identifier: track.identifier,
              author: track.author || null,
              length: track.duration || null,
              isSeekable: !!track.isStream,
              isStream: !!track.isStream,
              uri: track.uri || null,
              thumbnail: track.thumbnail || null,
              requester: track.requester.id,
            }
          }
          autoresumeSchema.findOne({
            guild: pl.guild
          }, async (err, data) => {
            if (!data) {
              new autoresumeSchema({
                guild: pl.guild,
                voiceChannel: null,
                textChannel: null,
                queue: null,
                current: null,
                volume: null,
                queueRepeat: null,
                trackRepeat: null,
                playing: null,
                position: null,
                eq: null,
                filter: null,
                filtervalue: null,
                autoplay: null,
              }).save();
            } else {
              if (data.guild != pl.guild) data.guild = pl.guild;
              if (data.voiceChannel != pl.voiceChannel) data.voiceChannel = pl.voiceChannel;
              if (data.textChannel != pl.textChannel) data.textChannel = pl.textChannel;

              if (pl.queue && pl.queue.current && (!data.current || data.current.identifier != pl.queue.current.identifier)) data.current = makeTrack(pl.queue.current);
              if (data.volume != pl.volume) data.volume = pl.volume;
              if (data.queueRepeat != pl.queueRepeat) data.queueRepeat = pl.queueRepeat;
              if (data.trackRepeat != pl.trackRepeat) data.trackRepeat = pl.trackRepeat;
              if (data.playing != pl.playing) data.playing = pl.playing;
              if (data.position != pl.position) data.position = pl.position;
              if (data.eq != eq) data.eq = eq;
              if (data.filter != filter) data.filter = filter;
              if (data.filtervalue != filtervalue) data.filtervalue = filtervalue;
              if (data.autoplay != autoplay) data.autoplay = autoplay;
              if (pl.queue && !arraysEqual(data.queue, [...pl.queue])) data.queue = [...pl.queue].map(track => makeTrack(track));
              await data.save();
            }
          })

          function arraysEqual(a, b) {
            if (a === b) return true;
            if (a == null || b == null) return false;
            if (a.length !== b.length) return false;

            for (var i = 0; i < a.length; ++i) {
              if (a[i] !== b[i]) return false;
            }
            return true;
          }
        }
      }, settings["auto-resume-save-cooldown"] || 5000);
      playerintervals_autoresume.set(player.guild, autoresumeinterval);
    })
    .on(`playerMove`, async (player, oldChannel, newChannel) => {
      if (!newChannel) {
        await player.destroy();
      } else {
        player.set('moved', true)
        player.setVoiceChannel(newChannel);
        if (player.paused) return;
        setTimeout(() => {
          player.pause(true);
          setTimeout(() => player.pause(false), client.ws.ping * 2);
        }, client.ws.ping * 2);
      }
    })
    .on(`playerDestroy`, async (player) => {
      //clear the interval for the music system
      clearInterval(playerintervals.get(player.guild))
      playerintervals.delete(player.guild);
      //clear the interval for the autoresume system
      clearInterval(playerintervals_autoresume.get(player.guild))
      autoresumeSchema.findOne({
        guild: player.guild
      }, async (err, data) => {
        if (data) await autoresumeSchema.findOneAndDelete({
          guild: player.guild
        })
      }).clone();
      playerintervals_autoresume.delete(player.guild);
      //if the song ends, edit message(s)
      if (player.textChannel && player.guild) {
        //update the last Played Song Message
        client.editLastPruningMessage(player, `\n⛔️ SONG & QUEUE ENDED! | Player got DESTROYED (stopped)!`)
        //Update the Music System Message - Embed
        client.updateMusicSystem(player, true);
      }

    })
    .on(`trackStart`, async (player, track, args) => {
      try {
        try {
          let sts = await StatsSchema.findOne({
            GuildId: player.guild
          });
          sts.Songs += 1;
          sts.save();
          let stsG = await StatsGSchema.findOne({
            BotId: client.user.id
          });
          stsG.Songs += 1;
          stsG.save();
        } catch (e) {}
        let edited = false;
        let guild = client.guilds.cache.get(player.guild);
        if (!guild) return;

        let channel = guild.channels.cache.get(player.textChannel);
        if (!channel) channel = await guild.channels.fetch(player.textChannel);

        const premium = await client.Premium.findOne({
          GuildId: player.guild
        });
        const ss = await SettingsSchema.findOne({
          GuildId: player.guild
        }).clone();

        const mss = await musicsettings.findOne({
          guildId: player.guild
        }).clone();
        const ls = await ss.Language;
        const es = await ss.Embed;

        if (playercreated.has(player.guild)) {
          player.set(`eq`, player.get("eq") || `💣 None`);
          player.set(`filter`, player.get("eq") || `🧨 None`);
          if (ss.AutoPlay) {
            player.set(`autoplay`, player.get("autoplay") || ss.AutoPlay);
          }
          if (premium && premium.BotAFK) {
            player.set(`afk`, true)
          } else {
            player.set(`afk`, false)
          }
          if (player.get("autoresume")) {
            player.set("autoresume", false)
          } else {
            await player.setVolume(ss.Volume)
            if (ss.Eq) {
              await player.setEQ(client.eqs.music);
            }
          }
          databasing(client, player.guild, player.get(`playerauthor`));
          playercreated.delete(player.guild); // delete the playercreated state from the thing
          client.logger(`Player Created :: ${String(guild ? guild.name : player.guild).brightBlue}`);
          if (!player.get("autoresume") && !player.get(`afk`) && channel && channel.permissionsFor(guild.me).has(Permissions.FLAGS.SEND_MESSAGES)) {
            channel.send({
              embeds: [
                new MessageEmbed()
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["handlers"]["erelaevents"]["events"]["var1"]))
              ]
            })
          }
        }
        //Update the Music System Message - Embed
        client.updateMusicSystem(player);
        if (player.textChannel && player.get(`previoustrack`)) {
          if (!collector.ended) {
            try {
              collector.stop();
            } catch (e) {
              //console.log(e.stack ? String(e.stack).grey : String(e).grey)
            }
          }
          //update the last Played Song Message
          client.editLastPruningMessage(player, `\n⛔️ SONG ENDED!`)
        }
        //votes for skip --> 0
        player.set(`votes`, `0`);
        //set the vote of every user to FALSE so if they voteskip it will vote skip and not remove voteskip if they have voted before bruh
        for (var userid of guild.members.cache.map(member => member.user.id))
          player.set(`vote-${userid}`, false);
        //set the previous track just have it is used for the autoplay function!
        player.set(`previoustrack`, track);
        if (mss.channelId == player.textChannel) return;
        //if that's disabled return
        if (!ss.Pruning) return;
        // client.logger(`Pruning Disabled - Not Sending a Message`);
        let playdata = generateQueueEmbed(client, player, track)
        //Send message with buttons
        if (channel && channel.permissionsFor(guild.me).has(Permissions.FLAGS.SEND_MESSAGES)) {
          let swapmsg = await channel.send(playdata).then(msg => {
            player.set(`currentmsg`, msg.id);
            return msg;
          })
          //create a collector for the thinggy
          collector = swapmsg.createMessageComponentCollector({
            filter: (i) => i.isButton() && i.user && i.message.author.id == client.user.id,
            time: track.duration > 0 ? track.duration : 600000
          }); //collector for 5 seconds
          //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
          collector.on('collect', async i => {
            let {
              member
            } = i;
            const {
              channel
            } = member.voice
            const player = client.manager.players.get(i.guild.id);
            if (!player) {
              return i.reply({
                content: client.la[ls].common.nothing_playing,
                ephemeral: true
              })
            }
            if (!channel) {
              return i.reply({
                content: client.la[ls].common.join_vc,
                ephemeral: true
              })
            }
            if (channel.id !== player.voiceChannel) {
              return i.reply({
                content: `${client.la[ls].common.wrong_vc} <#${player.voiceChannel}>**`,
                ephemeral: true
              })
            }
            // Check Premium Guild
            if (!premium) {
              return i.reply({
                content: eval(client.la[ls]["handlers"]["erelaevents"]["events"]["var2"]),
                ephemeral: true
              })
            }
            // Check DJ
            if (ss.DjRoles.length > 5) {
              if (i.customId != `10` && !i.member.roles.cache.get(ss.DjRoles) && !i.member.permissions.has("ADMINISTRATOR")) {
                return i.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTitle(eval(client.la[ls]["common"]["not_DJ"]))
                    .setDescription(`>>> **DJ - ROLE:** \n> <@&${ss.DjRoles}>`)
                  ],
                  ephemeral: true
                });
              }
            }
            //skip
            if (i.customId == `1`) {
              //if ther is nothing more to skip then stop music and leave the Channel
              if (player.queue.size == 0) {
                //if its on autoplay mode, then do autoplay before leaving...
                if (player.get(`autoplay`)) return autoplay(client, player, `skip`);
                i.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.color)
                    .setTimestamp()
                    .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["events"]["var3"]))
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                      dynamic: true
                    })))
                  ]
                })
                edited = true;
                if (!premium.BotAFK) await player.destroy()
                return player.stop();
              }
              //skip the track
              player.stop();
              return i.reply({
                embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTimestamp()
                  .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["events"]["var4"]))
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                    dynamic: true
                  })))
                ]
              })
            }
            //stop
            if (i.customId == `2`) {
              if (player.get(`autoplay`)) {
                return await i.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTimestamp()
                    .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["events"]["var5"]))
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                      dynamic: true
                    })))
                  ],
                });
              }
              //Stop the player
              if (premium.BotAFK === true) {
                await autoresumeSchema.findOneAndDelete({
                  guild: player.guild
                });
                await player.queue.clear();
                await player.stop();
                return i.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.color)
                    .setTimestamp()
                    .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["events"]["var6"]))
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                      dynamic: true
                    })))
                  ]
                })
              }
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTimestamp()
                  .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["events"]["var7"]))
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                    dynamic: true
                  })))
                ]
              })
              edited = true;
              await autoresumeSchema.findOneAndDelete({
                guild: player.guild
              });
              await player.queue.clear();
              await player.stop();
            }
            //pause/resume
            if (i.customId == `3`) {
              if (!player.playing) {
                player.pause(false);
                i.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.color)
                    .setTimestamp()
                    .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["events"]["var8"]))
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                      dynamic: true
                    })))
                  ]
                })
              } else {
                //pause the player
                player.pause(true);

                i.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.color)
                    .setTimestamp()
                    .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["events"]["var9"]))
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                      dynamic: true
                    })))
                  ]
                })
              }
              var data = generateQueueEmbed(client, player, track)
              swapmsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            }
            //autoplay
            if (i.customId == `4`) {
              if (ss.AutoPlay === false) {
                ss.AutoPlay = true,
                  ss.save();
              } else if (ss.AutoPlay === true) {
                ss.AutoPlay = false,
                  ss.save();
              }
              //pause the player
              player.set(`autoplay`, !player.get(`autoplay`))
              var data = generateQueueEmbed(client, player, track)
              swapmsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTimestamp()
                  .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["events"]["var10"]))
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                    dynamic: true
                  })))
                ]
              })
            }
            //Shuffle
            if (i.customId == `5`) {
              //set into the player instance an old Queue, before the shuffle...
              player.set(`beforeshuffle`, player.queue.map(track => track));
              //shuffle the Queue
              player.queue.shuffle();
              //Send Success Message
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTimestamp()
                  .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["events"]["var11"]))
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                    dynamic: true
                  })))
                ]
              })
            }
            //Songloop
            if (i.customId == `6`) {
              //if there is active queue loop, disable it + add embed information
              if (player.queueRepeat) {
                player.setQueueRepeat(false);
              }
              //set track repeat to revers of old track repeat
              player.setTrackRepeat(!player.trackRepeat);
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTimestamp()
                  .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["events"]["var12"]))
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                    dynamic: true
                  })))
                ]
              })
              var data = generateQueueEmbed(client, player, track)
              swapmsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            }
            //QueueLoop
            if (i.customId == `7`) {
              //if there is active queue loop, disable it + add embed information
              if (player.trackRepeat) {
                player.setTrackRepeat(false);
              }
              //set track repeat to revers of old track repeat
              player.setQueueRepeat(!player.queueRepeat);
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTimestamp()
                  .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["events"]["var13"]))
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                    dynamic: true
                  })))
                ]
              })
              var data = generateQueueEmbed(client, player, track)
              swapmsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            }
            //Forward
            if (i.customId == `8`) {
              //get the seektime variable of the user input
              let seektime = Number(player.position) + 10 * 1000;
              //if the userinput is smaller then 0, then set the seektime to just the player.position
              if (10 <= 0) seektime = Number(player.position);
              //if the seektime is too big, then set it 1 sec earlier
              if (Number(seektime) >= player.queue.current.duration) seektime = player.queue.current.duration - 1000;
              //seek to the new Seek position
              player.seek(Number(seektime));
              collector.resetTimer({
                time: (player.queue.current.duration - player.position) * 1000
              })
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTimestamp()
                  .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["events"]["var14"]))
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                    dynamic: true
                  })))
                ]
              })
            }
            //Rewind
            if (i.customId == `9`) {
              let seektime = player.position - 10 * 1000;
              if (seektime >= player.queue.current.duration - player.position || seektime < 0) {
                seektime = 0;
              }
              //seek to the new Seek position
              player.seek(Number(seektime));
              collector.resetTimer({
                time: (player.queue.current.duration - player.position) * 1000
              })
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTimestamp()
                  .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["events"]["var15"]))
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                    dynamic: true
                  })))
                ]
              })
            }
            //Lyric
            if (i.customId == `10`) {
              SongTitle = player.queue.current.title;
              SongTitle = SongTitle.replace(/lyrics|lyric|lyrical|official music video|\(official music video\)|audio|official|official video|official video hd|official hdvideo|offical video music|\(offical video music\)|extended|hd|(\[.+\])/gi, "");

              let lyrics = await lyricsFinder(SongTitle);
              if (!lyrics) {
                return i.reply(`**No lyrics found for -** \`${SongTitle}\``);
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
              if (!Pages.length || Pages.length === 1)
              return i.reply({
                embeds: [Pages[0]]
              });
              else return swap_pages2_interaction_DM(client, i, Pages);
            }
          });
        }
      } catch (e) {
        console.log(String(e.stack).grey.yellow)
      }
    })
    .on(`trackStuck`, async (player, track, payload) => {
      await player.stop();
      if (player.textChannel) {
        //update the last Played Song Message
        client.editLastPruningMessage(player, `\n⚠️⚠️⚠️ SONG STUCKED ⚠️⚠️!`)
        //Update the Music System Message - Embed
        client.updateMusicSystem(player);

      }
    })
    .on(`trackError`, async (player, track, payload) => {
      await player.stop();
      if (player.textChannel) {
        //update the last Played Song Message
        client.editLastPruningMessage(player, `\n⚠️⚠️⚠️ SONG CRASHED ⚠️⚠️!`)
        //Update the Music System Message - Embed
        client.updateMusicSystem(player);
      }
    })
    .on(`queueEnd`, async (player) => {
      client.editLastPruningMessage(player, `\n⛔️ SONG & QUEUE ENDED! `)
      databasing(client, player.guild, player.get(`playerauthor`));
      //if autoplay is enabled, then continue with the autoplay function
      if (player.get(`autoplay`)) return autoplay(client, player);
      try {
        let ss = await client.Settings.findOne({
          GuildId: player.guild
        })
        let es = ss.Embed
        let ls = ss.Language
        //update the player
        player = client.manager.players.get(player.guild);

        if (!player.queue || !player.queue.current) {
          //Update the Music System Message - Embed
          client.updateMusicSystem(player, true);

          //Delete autoresume
          await autoresumeSchema.findOneAndDelete({
            guild: player.guild
          });
          // client.logger(`Queue went empty in ${String(client.guilds.cache.get(player.guild) ? client.guilds.cache.get(player.guild).name : player.guild).brightBlue} deleted the database entry`)

          //if afk is enbaled return and not destroy the PLAYER
          const premium = await premiumSchema.findOne({
            GuildId: player.guild
          }).clone();
          if (premium && player) {
            if (player.get(`afk`) || premium.BotAFK) {
              return;
               client.logger(`Queue went empty in ${String(client.guilds.cache.get(player.guild) ? client.guilds.cache.get(player.guild).name : player.guild).brightBlue}, not leaving, because AFK is enabled!`)
               setTimeout(() => {
                 return client.channels.cache.get(player.textChannel).send({
                   embeds: [new MessageEmbed()
                     .setColor(es.color)
                     .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["events"]["var16"]))
                   ]
                 }).then((msg) => {
                   setTimeout(() => {
                     msg.delete().catch(() => {});
                   }, 60000);
                 })
               }, settings.LeaveOnEmpty_Queue.time_delay);
            }
          }
          //if afk is disable return and not destroy the PLAYER
          if (settings.LeaveOnEmpty_Queue.enabled && player) {
            setTimeout(async () => {
              try {
                if (!player.queue || !player.queue.current) {
                  await player.destroy();
                   client.logger(`Destroyed because it went Empty in ${String(client.guilds.cache.get(player.guild) ? client.guilds.cache.get(player.guild).name : player.guild).brightBlue}`)
                  return client.channels.cache.get(player.textChannel).send({
                    embeds: [new MessageEmbed()
                      .setColor(es.color)
                      .setTitle(eval(client.la[ls]["handlers"]["erelaevents"]["events"]["var17"]))
                    ]
                  })
                }
              } catch (e) {
                console.log(String(e.stack).grey.yellow)
              }
            }, settings.LeaveOnEmpty_Queue.time_delay)
          }
        }
      } catch (e) {
        console.log(String(e.stack).grey.yellow);
      }
    });
};

function generateQueueEmbed(client, player, track) {
  var embed = new MessageEmbed()
    .setColor(ee.color)
  embed.setAuthor(client.getAuthor(`${track.title}`, `https://images-ext-1.discordapp.net/external/DkPCBVBHBDJC8xHHCF2G7-rJXnTwj_qs78udThL8Cy0/%3Fv%3D1/https/cdn.discordapp.com/emojis/859459305152708630.gif`, track.uri))
  embed.setThumbnail(`https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`)
  embed.addFields(
    {
      name: `${emoji.msg.time} Duration:`,
      value: `\`${format(player.queue.current.duration).split(" | ")[0]}\` | \`${format(player.queue.current.duration).split(" | ")[1]}\``,
      inline: true
    },
    {
      name: `${emoji.msg.song_by} Song By:`,
      value: `\`${player.queue.current.author}\``,
      inline: true
    },
    {
      name: `${emoji.msg.repeat_mode} Queue length:`,
      value: `\`${player.queue.length} Songs\``,
      inline: true
    }
  )
  embed.setFooter(client.getFooter(`Requested by: ${track.requester.tag}`, track.requester.displayAvatarURL({
    dynamic: true
  })))
  let skip = new MessageButton().setStyle('PRIMARY').setCustomId('1').setEmoji(`⏭`).setLabel(`Skip`)
  let stop = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji(`⏹`).setLabel(`Stop`)
  let pause = new MessageButton().setStyle('SECONDARY').setCustomId('3').setEmoji('⏸').setLabel(`Pause`)
  let queueloop = new MessageButton().setStyle('SUCCESS').setCustomId('7').setEmoji(`🔂`).setLabel(`Loop Queue`)
  let shuffle = new MessageButton().setStyle('PRIMARY').setCustomId('5').setEmoji('🔀').setLabel(`Shuffle`)
  if (!player.playing) {
    pause = pause.setStyle('SUCCESS').setEmoji('▶️').setLabel(`Resume`)
  }
  let songloop = new MessageButton().setStyle('SUCCESS').setCustomId('6').setEmoji(`🔁`).setLabel(`Loop Song`)
  let autoplay = new MessageButton().setStyle('SECONDARY').setCustomId('4').setEmoji('🔁').setLabel(`Autoplay Off`)
  if (player.get(`autoplay`)) {
    autoplay = autoplay.setStyle('SUCCESS').setLabel(`Autoplay On`)
  }
  let forward = new MessageButton().setStyle('PRIMARY').setCustomId('8').setEmoji('⏩').setLabel(`+10 Sec`)
  let rewind = new MessageButton().setStyle('PRIMARY').setCustomId('9').setEmoji('⏪').setLabel(`-10 Sec`)
  let lyrics = new MessageButton().setStyle('PRIMARY').setCustomId('10').setEmoji('📝').setLabel(`Lyrics`)

  if (!player.queueRepeat && !player.trackRepeat) {
    songloop = songloop.setStyle('SUCCESS')
    queueloop = queueloop.setStyle('SUCCESS')
  }
  if (player.trackRepeat) {
    songloop = songloop.setStyle('SECONDARY')
    queueloop = queueloop.setStyle('SUCCESS')
  }
  if (player.queueRepeat) {
    songloop = songloop.setStyle('SUCCESS')
    queueloop = queueloop.setStyle('SECONDARY')
  }
  const row = new MessageActionRow().addComponents([skip, stop, pause, autoplay, shuffle]);
  const row2 = new MessageActionRow().addComponents([songloop, queueloop, forward, rewind, lyrics]);
  return {
    embeds: [embed],
    components: [row, row2]
  }
}
