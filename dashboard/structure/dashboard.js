const Discord = require ('discord.js')
const Settings = require("../settings.json");
const {
  check_if_dj,
  autoplay,
  escapeRegex,
  formatNonSeconds,
  duration,
  createBar,
  delay,
  musicSystem,
  databasing,
} = require("../../handlers/functions");
const {
  generateQueueEmbed
} = require('../../handlers/erela_events/musicsystem');
const greetingmsgSchema = require('../../databases/greetingmsg');
const autoresume = require('../../databases/autoresume');
module.exports = (client, app, checkAuth) => {
  app.get("/dashboard", async (req, res) => {
    if (!req.isAuthenticated() || !req.user)
      return res.redirect('/errorlogin')
    if (!req.user.guilds)
      return res.redirect("/?error=" + encodeURIComponent("Cannot get your Guilds"))
    res.render("dashboard", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
      botconfig: Settings.website,
      callback: Settings.config.callback,
      statsGlobal: await client.statsGlobal.findOne({ BotId: client.user.id }),
      stats: await client.stats.find({}),
    })
  })
  app.get("/dashboard/:guildID", checkAuth, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID)
    if (!guild) return res.redirect("/dashboard")
    let member = guild.members.cache.get(req.user.id);
    if (!member) {
      try {
        member = await guild.members.fetch(req.user.id);
      } catch {

      }
    }
    if (!member)
      return res.redirect("/?error=" + encodeURIComponent("Login first please! / Join the Guild again!"))
    if (!member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))
      return res.redirect("/?error=" + encodeURIComponent("You are not allowed to do that"))
    res.render("settings", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      guild: guild,
      bot: client,
      Permissions: Discord.Permissions,
      botconfig: Settings.website,
      callback: Settings.config.callback,
      format: formatNonSeconds,
      settingsSchema: await client.Settings.findOne({ GuildId: guild.id }),
      premium: await client.Premium.findOne({ GuildId: guild.id }),
      leveling: await client.leveling.findOne({ GuildId: guild.id }),
      player: client.manager.players.get(guild.id),
      greetingmsg: await client.Greetingmsg.findOne({ GuildId: guild.id }),
      musicsettings: await client.Musicsettings.findOne({ guildId: guild.id }),
      stats: await client.stats.findOne({ GuildId: guild.id }),
      autorole: await client.Autorolesettings.findOne({ GuildId: guild.id }),
      reactionRoles: await client.reactrole.findOne({ GuildId: guild.id }),
    })
  })
  app.post("/dashboard/:guildID", checkAuth, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID)
    if (!guild) return res.redirect("/dashboard")
    let member = guild.members.cache.get(req.user.id);
    if (!member) {
      try {
        member = await guild.members.fetch(req.user.id);
      } catch {

      }
    }
    if (!member) return res.redirect("/?error=" + encodeURIComponent("Login first please! / Join the Guild again!"))
    if (!member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) return res.redirect("/?error=" + encodeURIComponent("You are not allowed to do that"))

    var autorole = await client.Autorolesettings.findOne({ GuildId: guild.id });
    var greetingmsg = await client.Greetingmsg.findOne({ GuildId: guild.id });
    var premium = await client.Premium.findOne({ GuildId: guild.id });
    var reactionRoles = await client.reactrole.findOne({ GuildId: guild.id });
    var ss = await client.Settings.findOne({ GuildId: guild.id });
    var musicsettings = await client.Musicsettings.findOne({ guildId: guild.id });
    var leveling = await client.leveling.findOne({ GuildId: guild.id });
    let player = client.manager.players.get(guild.id)
    var autoResume = await autoresume.findOne({ guild : player.guild })
    res.render("settings", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      guild: guild,
      bot: client,
      Permissions: Discord.Permissions,
      botconfig: Settings.website,
      callback: Settings.config.callback,
      settingsSchema: ss,
      premium: premium,
      leveling: leveling,
      player: client.manager.players.get(guild.id),
      format: formatNonSeconds,
      greetingmsg: greetingmsg,
      musicsettings: musicsettings,
      stats: await client.stats.findOne({
        GuildId: guild.id
      }),
      autorole: autorole,
      reactionRoles: reactionRoles,
    })
    
    let channel = guild.channels.cache.get(musicsettings.channelId)
    let message = channel.messages.cache.get(musicsettings.messageId);
    var data = generateQueueEmbed(client, guild.id, ss.Embed, ss.Language, ss.DjRoles, false)
    
    if (req.body.pause) {
      player.pause(true);
      return message.edit(data).catch((e) => {})
    }
    if (req.body.resume) {
      player.pause(false);
      return message.edit(data).catch((e) => {})
    }
    if (req.body.skip) return player.stop(true);
    if (req.body.stop) {
      if (player.get(`autoplay`)) {
        return player.destroy();
      } else {
        if (autoResume) await autoresume.findOneAndDelete({ guild : guild.id })
        await player.queue.clear();
        return player.stop();
      }
    }
    if (req.body.leave) return player.destroy();
    if (req.body.shuffle) {
      player.set(`beforeshuffle`, player.queue.map(track => track));
      player.queue.shuffle();
      message.edit(data).catch((e) => {})
      return;
    }
  })
  app.post('/bassicSuccess', async (req, res) => {
    const guild = client.guilds.cache.get(req.body.guildID)
    var ss = await client.Settings.findOne({ GuildId: guild.id });
    var leveling = await client.leveling.findOne({ GuildId: guild.id });
    if (req.body.prefix) ss.Prefix = req.body.prefix;
    if (req.body.language) ss.Language = req.body.language;
    if (req.body.roles) {
      guild.roles.cache.filter(r => r.name === req.body.roles).forEach((role, i) => {
        ss.DjRoles = role.id;
      });
    }
    if (req.body.botchannel) {
      guild.channels.cache.filter(c => c.name === req.body.botchannel).forEach((channel, i) => {
        ss.BotChannel = channel.id;
      });
    }
    if (req.body.unkowncmdmessage) {
      ss.Unkowncmdmessage = true;
    } else ss.Unkowncmdmessage = false;
    if (req.body.leveling) {
      leveling.status = true;
    } else leveling.status = false;
    await ss.save();
    await leveling.save();
    await res.redirect(`/dashboard/${req.body.guildID}`)
  })
  app.post('/autoroleSuccess', async (req, res) => {
    const guild = client.guilds.cache.get(req.body.guildID)
    var autorole = await client.Autorolesettings.findOne({ GuildId: guild.id });
    var ss = await client.Settings.findOne({ GuildId: guild.id });
    if (req.body.autoroleId && req.body.autorolecheck) {
      guild.roles.cache.filter(r => r.name === req.body.autoroleId).forEach((role, i) => {
        autorole.RoleId = role.id;
      });
      await autorole.save();
      ss.AutoRole = true;
    } else ss.AutoRole = false;
    await ss.save();
    await autorole.save();
    await res.redirect(`/dashboard/${req.body.guildID}`)
  })
  app.post('/greetingmsgSucces', async (req,res) => {
    const guild = client.guilds.cache.get(req.body.guildID)
    var greetingmsg = await client.Greetingmsg.findOne({ GuildId: guild.id });
    var ss = await client.Settings.findOne({ GuildId: guild.id });

    if (req.body.greetingmsg && req.body.GreetingChannels && req.body.greetingbtn) {
      guild.channels.cache.filter(c => c.name === req.body.GreetingChannels).forEach((channel, i) => {
        if (!greetingmsg) {
          new greetingmsgSchema({
            GuildId: guild.id,
            ChannelId: channel.id,
            Message: req.body.greetingmsg,
          }).save();
        } else {
          greetingmsg.ChannelId = channel.id;
          greetingmsg.Message = req.body.greetingmsg;
        }
      });
      ss.Greeting = true;
    } else ss.Greeting = false;
    await greetingmsg.save();
    await ss.save();
    await res.redirect(`/dashboard/${req.body.guildID}`)
  })
  app.post('/musicsettingsSuccess', async(req,res) => {
    const guild = client.guilds.cache.get(req.body.guildID)
    var premium = await client.Premium.findOne({ GuildId: guild.id });
    var ss = await client.Settings.findOne({ GuildId: guild.id });
    let player = await client.manager.players.get(guild.id);

    if (req.body.pruning) {
      ss.Pruning = true;
    } else ss.Pruning = false;
    if (req.body.autoresume) {
      ss.Autoresume = true;
    } else ss.Autoresume = false;
    if (req.body.defaultautoplay) {
      ss.AutoPlay = true;
      await player.set(`autoplay`, !player.get(`autoplay`))
    } else ss.AutoPlay = false;
    if (premium) {
      if (req.body.afk) {
        premium.BotAFK = true;
        await player.set(`afk`, !player.get(`afk`));
      } else premium.BotAFK = false;

      if (req.body.volume) {
        if (req.body.volume != player.volume) {
          ss.Volume = req.body.volume;
          player.setVolume(req.body.volume);
        }
      }
      if (req.body.equalizer) {
        if (req.body.equalizer === `🎵 Music`) {
          player.set("eq", "🎵 Music");
          player.setEQ(client.eqs.music);
        } else if (req.body.equalizer === `🎙 Pop`) {
          player.set("eq", "🎙 Pop");
          player.setEQ(client.eqs.pop);
        } else if (req.body.equalizer === `💾 Electronic`) {
          player.set("eq", "💾 Electronic");
          player.setEQ(client.eqs.electronic);
        } else if (req.body.equalizer === `📜 Classical`) {
          player.set("eq", "📜 Classical");
          player.setEQ(client.eqs.classical);
        } else if (req.body.equalizer === `🎚 Metal`) {
          player.set("eq", "🎚 Metal");
          player.setEQ(client.eqs.rock);
        } else if (req.body.equalizer === `📀 Full`) {
          player.set("eq", "📀 Full");
          player.setEQ(client.eqs.full);
        } else if (req.body.equalizer === `💿 Light`) {
          player.set("eq", "💿 Light");
          player.setEQ(client.eqs.light);
        } else if (req.body.equalizer === `🕹 Gaming`) {
          player.set("eq", "🕹 Gaming");
          player.setEQ(client.eqs.gaming);
        } else if (req.body.equalizer === `🎛 Bassboost`) {
          player.set("eq", "🎛 Bassboost");
          player.setEQ(client.eqs.bassboost);
        } else if (req.body.equalizer === `🔈 Earrape`) {
          player.set("eq", "🔈 Earrape");
          await player.setVolume(player.volume + 50);
          player.setEQ(client.eqs.earrape);
        } else {
          req.body.equalizer === `↩️ Reset`
          player.clearEQ();
          player.set("eq", "💣 None");
        }
      }
      if (req.body.filter) {
        if (req.body.filter === `💯 Vibrato`) {
          require("../../commands/Filter/vibrato").run(client, {
            guild: {
              id: player.guild
            }
          }, [], null, null, null, player)
          return;
        } else if (req.body.filter === `💢 Vibrate`) {
          require("../../commands/Filter/vibrate").run(client, {
            guild: {
              id: player.guild
            }
          }, [], null, null, null, player);
        } else if (req.body.filter === `🏮 Tremolo`) {
          require("../../commands/Filter/tremolo").run(client, {
            guild: {
              id: player.guild
            }
          }, [], null, null, null, player);
        } else if (req.body.filter === `⏱ Speed`) {
          player.node.send({
            op: "filters",
            guildId: guild.id,
            equalizer: player.bands.map((gain, index) => {
              var Obj = {
                "band": 0,
                "gain": 0,
              };
              Obj.band = Number(index);
              Obj.gain = Number(gain)
              return Obj;
            }),
            timescale: {
              "speed": 1.0,
              "pitch": 1.0,
              "rate": Number(2)
            },
          });
          player.set("filter", "⏱ Speed");
          player.set("filtervalue", Number(2));
        } else if (req.body.filter === `⏱ Slowmode`) {
          require("../../commands/Filter/slowmo").run(client, {
            guild: {
              id: player.guild
            }
          }, [], null, null, null, player);
        } else if (req.body.filter === `📉 Rate`) {
          player.node.send({
            op: "filters",
            guildId: guild.id,
            equalizer: player.bands.map((gain, index) => {
              var Obj = {
                "band": 0,
                "gain": 0,
              };
              Obj.band = Number(index);
              Obj.gain = Number(gain)
              return Obj;
            }),
            timescale: {
              "speed": 1,
              "pitch": 1.0,
              "rate": 1.0
            },
          });
          player.set("filter", "📉 Rate");
          player.set("filtervalue", Number(1));;
        } else if (req.body.filter === `📈 Pitch`) {
          require("../../commands/Filter/pitch").run(client, {
            guild: {
              id: player.guild
            }
          }, [], null, null, null, player);
        } else if (req.body.filter === `👻 Nightcore`) {
          require("../../commands/Filter/nightcore").run(client, {
            guild: {
              id: player.guild
            }
          }, [], null, null, null, player);
        } else if (req.body.filter === `👾 Darth Vader`) {
          require("../../commands/Filter/darthvader").run(client, {
            guild: {
              id: player.guild
            }
          }, [], null, null, null, player);
        } else if (req.body.filter === `🐿️ Chipmunk`) {
          require("../../commands/Filter/chipmunk").run(client, {
            guild: {
              id: player.guild
            }
          }, [], null, null, null, player);
        } else if (req.body.filter === `👺 China`) {
          require("../../commands/Filter/china").run(client, {
            guild: {
              id: player.guild
            }
          }, [], null, null, null, player);
        } else if (req.body.filter === `🎚 Low Bass`) {
          require("../../commands/Filter/bassboost").run(client, {
            guild: {
              id: player.guild
            }
          }, ["low"], null, null, null, player);
        } else if (req.body.filter === `🎚 Medium Bass`) {
          require("../../commands/Filter/bassboost").run(client, {
            guild: {
              id: player.guild
            }
          }, ["medium"], null, null, null, player);
        } else if (req.body.filter === `🎚 High Bass`) {
          require("../../commands/Filter/bassboost").run(client, {
            guild: {
              id: player.guild
            }
          }, ["high"], null, null, null, player);
        } else if (req.body.filter === `🎚 Earrape Bass`) {
          require("../../commands/Filter/bassboost").run(client, {
            guild: {
              id: player.guild
            }
          }, ["earrape"], null, null, null, player);
        } else if (req.body.filter === `🔊 8D`) {
          require("../../commands/Filter/3d").run(client, {
            guild: {
              id: player.guild
            }
          }, [], null, null, null, player);
        } else {
          req.body.filter === `↩️ Reset`
          require("../../commands/Filter/clearfilter").run(client, {
            guild: {
              id: player.guild
            }
          }, [], null, null, null, player);
        }
      }
      await premium.save();
    }
    if (req.body.musicsetup) {
      guild.channels.cache.filter(c => c.name === req.body.musicsetup).forEach((channel, i) => {
        musicSystem(client, guild.id, channel.id)
      });
    }
    await ss.save();
    await res.redirect(`/dashboard/${req.body.guildID}`)
  })
  app.post('/resetSuccess', async (req, res) => {
    const guild = client.guilds.cache.get(req.body.guildID)
    const member = guild.members.cache.get(req.user.id);
    var autorole = await client.Autorolesettings.findOne({ GuildId: guild.id });
    var embed = await client.Embedsettings.findOne({ guildId: guild.id });
    var greetingmsg = await client.Greetingmsg.findOne({ GuildId: guild.id });
    var membercount = await client.Membercount.findOne({ GuildId: guild.id });
    var mute = await client.Mutesettings.findOne({ GuildId: guild.id });
    var premium = await client.Premium.findOne({ GuildId: guild.id });
    var reactionRoles = await client.reactrole.findOne({ GuildId: guild.id });
    var ss = await client.Settings.findOne({ GuildId: guild.id });
    var stats = await client.stats.findOne({ GuildId: guild.id });
    var musicsettings = await client.Musicsettings.findOne({ guildId: guild.id });
    var leveling = await client.leveling.findOne({ GuildId: guild.id });

    if (req.body.resetPrefix) ss.Prefix = BotConfig.prefix;
    if (req.body.resetDjrole) ss.DjRoles = "";
    if (req.body.resetMusicSetup) {
      if (musicsettings.channelId.length > 5) {
        let ch = await guild.channels.cache.get(musicsettings.channelId);
        ch.clone().then(c => {
          c.setPosition(ch.position)
        });
        ch.delete();
        musicsettings.delete();
        await databasing(client, guild.id, member.id)
      }
    }
    if (req.body.resetBotChannelChat) ss.BotChannel = "";
    if (req.body.resetAutorole) {
      if (autorole) autorole.RoleId = "";
    }
    if (req.body.resetGreetingMessage) {
      if (greetingmsg) greetingmsg.delete();
      await databasing(client, guild.id, member.id)
    }
    await autorole.save();
    await leveling.save();
    if (req.body.resetAllSettings) {
      if (autorole) autorole.delete();
      if (embed) embed.delete();
      if (greetingmsg) greetingmsg.delete();
      if (membercount) membercount.delete();
      if (mute) mute.delete();
      if (premium) {
        premium.BotAFK = false;
        premium.BotAFKVc = "";
        premium.BotAFKCh = "";
        await premium.save();
      }
      if (reactionRoles) reactionRoles.delete();
      if (ss) ss.delete();
      if (stats) stats.delete();
      await databasing(client, guild.id, member.id)
    }
    await ss.save();
    await res.redirect(`/dashboard/${req.body.guildID}`)
  })
  app.post('/setupEmbedSuccess', async (req, res) =>  {
    const guild = client.guilds.cache.get(req.body.guildID)
    var ss = await client.Settings.findOne({ GuildId: guild.id });
    if (req.body.colorEmbed) {
      ss.Embed = {
        color: req.body.colorEmbed ? req.body.colorEmbed : ss.Embed.color,
        wrongcolor: "RED",
        succescolor: "GREEN",
        thumb: req.body.thumbEmbed ? true : false,
        footertext: req.body.footertextEmbed ? req.body.footertextEmbed : ss.Embed.footertext,
        footericon: req.body.imgEmbed ? req.body.imgEmbed : ss.Embed.footericon,
      }
    }
    if (req.body.footertextEmbed) {
      ss.Embed = {
        color: req.body.colorEmbed ? req.body.colorEmbed : ss.Embed.color,
        wrongcolor: "RED",
        succescolor: "GREEN",
        thumb: req.body.thumbEmbed ? true : false,
        footertext: req.body.footertextEmbed ? req.body.footertextEmbed : ss.Embed.footertext,
        footericon: req.body.imgEmbed ? req.body.imgEmbed : ss.Embed.footericon,
      }
    }
    if (req.body.imgEmbed) {
      ss.Embed = {
        color: req.body.colorEmbed ? req.body.colorEmbed : ss.Embed.color,
        wrongcolor: "RED",
        succescolor: "GREEN",
        thumb: req.body.thumbEmbed ? true : false,
        footertext: req.body.footertextEmbed ? req.body.footertextEmbed : ss.Embed.footertext,
        footericon: req.body.imgEmbed ? req.body.imgEmbed : ss.Embed.footericon,
      }
    }
    if (req.body.thumbEmbed) {
      ss.Embed = {
        color: req.body.colorEmbed ? req.body.colorEmbed : ss.Embed.color,
        wrongcolor: "RED",
        succescolor: "GREEN",
        thumb: true,
        footertext: req.body.footertextEmbed ? req.body.footertextEmbed : ss.Embed.footertext,
        footericon: req.body.imgEmbed ? req.body.imgEmbed : ss.Embed.footericon,
      }
    } else {
      ss.Embed = {
        color: req.body.colorEmbed ? req.body.colorEmbed : ss.Embed.color,
        wrongcolor: "RED",
        succescolor: "GREEN",
        thumb: false,
        footertext: req.body.footertextEmbed ? req.body.footertextEmbed : ss.Embed.footertext,
        footericon: req.body.imgEmbed ? req.body.imgEmbed : ss.Embed.footericon,
      }
    }
    
    await ss.save();
    await res.redirect(`/dashboard/${req.body.guildID}`)
  })
}