const Discord = require("discord.js");
const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const settings = require(`${process.cwd()}/botconfig/settings.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const radios = require("../botconfig/radiostations.json");
const ms = require("ms")
const moment = require("moment")
const fs = require('fs');
const MusicSchema = require("../databases/musicsettings");
const SettingsSchema = require('../databases/settings');
const StatsSchema = require('../databases/stats');
const StatsGSchema = require('../databases/statsGlobal');
const EmbedSchema = require('../databases/embedMessage');
const levelingSystem = require("../databases/leveling-system");
const greetingmsg = require("../databases/greetingmsg");
const autorole = require('../databases/autorole');
const url = require('../botconfig/url.json');
const leaveMessage = require('../databases/leaveMessage');

module.exports.handlemsg = handlemsg;
module.exports.nFormatter = nFormatter;
module.exports.databasing = databasing;
module.exports.shuffle = shuffle;
module.exports.delay = delay;
module.exports.duration = duration;
module.exports.createBar = createBar;
module.exports.format = format;
module.exports.stations = stations;
module.exports.swap_pages2 = swap_pages2;
module.exports.swap_pages2_interaction = swap_pages2_interaction;
module.exports.swap_pages2_interaction_DM = swap_pages2_interaction_DM;
module.exports.swap_pages = swap_pages;
module.exports.escapeRegex = escapeRegex;
module.exports.autoplay = autoplay;
module.exports.arrayMove = arrayMove;
module.exports.isValidURL = isValidURL;
module.exports.check_if_dj = check_if_dj;
module.exports.leveling = leveling;
module.exports.musicSystem = musicSystem;
module.exports.formatNonSeconds = formatNonSeconds;

function check_if_dj(client, member, song) {
  //if no message added return
  if (!client) return false;
  SettingsSchema.findOne({
    GuildId: member.guild.id
  }, async (err, data) => {
    if (data) {
      var roleid = await data.DjRoles;
      if (roleid == "") return false;
      var isdj = false;
      for (const djRole of roleid) {
        if (!member.guild.roles.cache.get(djRole)) {
          continue;
        }
        if (member.roles.cache.has(djRole)) isdj = true;
      }
    }
    if (!isdj && !member.permissions.has("ADMINISTRATOR") && song.requester.id != member.id)
      return roleid;
    else
      return false;
  }).clone();
}

function handlemsg(txt, options) {
  let text = String(txt);
  for (const option in options) {
    var toreplace = new RegExp(`{${option.toLowerCase()}}`, "ig");
    text = text.replace(toreplace, options[option]);
  }
  return text;
}

function isValidURL(string) {
  const args = string.split(" ");
  let url;
  for (const arg of args) {
    try {
      url = new URL(arg);
      url = url.protocol === "http:" || url.protocol === "https:";
      break;
    } catch (_) {
      url = false;
    }
  }
  return url;
};

function shuffle(a) {
  try {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

function duration(duration, useMilli = false) {
  let remain = duration;
  let days = Math.floor(remain / (1000 * 60 * 60 * 24));
  remain = remain % (1000 * 60 * 60 * 24);
  let hours = Math.floor(remain / (1000 * 60 * 60));
  remain = remain % (1000 * 60 * 60);
  let minutes = Math.floor(remain / (1000 * 60));
  remain = remain % (1000 * 60);
  let seconds = Math.floor(remain / (1000));
  remain = remain % (1000);
  let milliseconds = remain;
  let time = {
    days,
    hours,
    minutes,
    seconds,
    milliseconds
  };
  let parts = []
  if (time.days) {
    let ret = time.days + ' Day'
    if (time.days !== 1) {
      ret += 's'
    }
    parts.push(ret)
  }
  if (time.hours) {
    let ret = time.hours + ' Hr'
    if (time.hours !== 1) {
      ret += 's'
    }
    parts.push(ret)
  }
  if (time.minutes) {
    let ret = time.minutes + ' Min'
    if (time.minutes !== 1) {
      ret += 's'
    }
    parts.push(ret)

  }
  if (time.seconds) {
    let ret = time.seconds + ' Sec'
    if (time.seconds !== 1) {
      ret += 's'
    }
    parts.push(ret)
  }
  if (useMilli && time.milliseconds) {
    let ret = time.milliseconds + ' ms'
    parts.push(ret)
  }
  if (parts.length === 0) {
    return ['instantly']
  } else {
    return parts
  }
}

function delay(delayInms) {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

function createBar(player) {
  let {
    size,
    line,
    slider,
    leftindicator,
    rightindicator,
    style
  } = emoji.msg.progress_bar;
  if (style == "simple") {
    //player.queue.current.duration == 0 ? player.position : player.queue.current.duration, player.position, 25, "▬", "🔷")
    if (!player.queue.current) return `**[${slider}${line.repeat(size - 1)}${rightindicator}**\n**00:00:00 / 00:00:00**`;
    let current = player.queue.current.duration !== 0 ? player.position : player.queue.current.duration;
    let total = player.queue.current.duration;

    let bar = current > total ? [line.repeat(size / 2 * 2), (current / total) * 100] : [line.repeat(Math.round(size / 2 * (current / total))).replace(/.$/, slider) + line.repeat(size - Math.round(size * (current / total)) + 1), current / total];
    if (!String(bar).includes(slider)) return `**${leftindicator}${slider}${line.repeat(size - 1)}${rightindicator}**\n**00:00:00 / 00:00:00**`;
    return `**${leftindicator}${bar[0]}${rightindicator}**\n**${new Date(player.position).toISOString().substr(11, 8)+" / "+(player.queue.current.duration==0?" ◉ LIVE":new Date(player.queue.current.duration).toISOString().substr(11, 8))}**`;
  } else {
    try {
      if (!player.queue.current) return `**${emoji.msg.progress_bar.empty_left}${emoji.msg.progress_bar.filledframe}${emoji.msg.progress_bar.emptyframe.repeat(size - 1)}${emoji.msg.progress_bar.empty_right}**\n**00:00:00 / 00:00:00**`;
      let current = player.queue.current.duration !== 0 ? player.position : player.queue.current.duration;
      let total = player.queue.current.duration;
      size -= 10;
      let rightside = size - Math.round(size * (current / total));
      let leftside = Math.round(size * (current / total));
      let bar;
      if (leftside < 1) bar = String(emoji.msg.progress_bar.empty_left) + String(emoji.msg.progress_bar.emptyframe).repeat(rightside) + String(emoji.msg.progress_bar.empty_right);
      else bar = String(emoji.msg.progress_bar.filled_left) + String(emoji.msg.progress_bar.filledframe).repeat(leftside) + String(emoji.msg.progress_bar.emptyframe).repeat(rightside) + String(size - rightside !== 1 ? emoji.msg.progress_bar.empty_right : emoji.msg.progress_bar.filled_right);
      return `**${bar}**\n**${new Date(player.position).toISOString().substr(11, 8)+" / "+(player.queue.current.duration==0?" ◉ LIVE":new Date(player.queue.current.duration).toISOString().substr(11, 8))}**`;
    } catch (e) {
      //if problem, then redo with the new size
      if (!player.queue.current) return `**[${slider}${line.repeat(size - 1)}${rightindicator}**\n**00:00:00 / 00:00:00**`;
      let current = player.queue.current.duration !== 0 ? player.position : player.queue.current.duration;
      let total = player.queue.current.duration;

      let bar = current > total ? [line.repeat(size / 2 * 2), (current / total) * 100] : [line.repeat(Math.round(size / 2 * (current / total))).replace(/.$/, slider) + line.repeat(size - Math.round(size * (current / total)) + 1), current / total];
      if (!String(bar).includes(slider)) return `**${leftindicator}${slider}${line.repeat(size - 1)}${rightindicator}**\n**00:00:00 / 00:00:00**`;
      return `**${leftindicator}${bar[0]}${rightindicator}**\n**${new Date(player.position).toISOString().substr(11, 8)+" / "+(player.queue.current.duration==0?" ◉ LIVE":new Date(player.queue.current.duration).toISOString().substr(11, 8))}**`;
    }
  }
}

function format(millis) {
  try {
    var h = Math.floor(millis / 3600000),
      m = Math.floor(millis / 60000),
      s = ((millis % 60000) / 1000).toFixed(0);
    if (h < 1) return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
    else return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

function formatNonSeconds(millis) {
  try {
    var h = Math.floor(millis / 3600000),
      m = Math.floor(millis / 60000),
      s = ((millis % 60000) / 1000).toFixed(0);
    if (h < 1) return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    else return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

async function stations(client, prefix, message) {
  let ss = await client.Settings.findOne({
    GuildId: message.guild.id
  })
  let es = ss.Embed;
  let ls = ss.Language;
  try {
    let amount = 0;
    const stationsembed = new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon : null).setFooter(client.getFooter(es))
      .setTitle(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable4"]))
      .setDescription(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable4_1"]))
    const stationsembed2 = new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon : null).setFooter(client.getFooter(es))
      .setTitle(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable5"]))
      .setDescription(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable5_1"]))
    const stationsembed3 = new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon : null).setFooter(client.getFooter(es))
      .setTitle(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable6"]))
      .setDescription(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable6_1"]))
    let United_Kingdom = "";
    for (let i = 0; i < radios.EU.United_Kingdom.length; i++) {
      United_Kingdom += `**${i + 1 + 10 * amount}**[${radios.EU.United_Kingdom[i].split(" ")[0].replace("-", " ").substr(0, 16)}](${radios.EU.United_Kingdom[i].split(" ")[1]})\n`;
    }
    stationsembed.addField("🇬🇧 United Kingdom", `>>> ${United_Kingdom}`, true);
    amount++;
    let austria = "";
    for (let i = 0; i < radios.EU.Austria.length; i++) {
      austria += `**${i + 1 + 10 * amount}**[${radios.EU.Austria[i].split(" ")[0].replace("-", " ").substr(0, 16)}](${radios.EU.Austria[i].split(" ")[1]})\n`;
    }
    stationsembed.addField("🇦🇹 Austria", `>>> ${austria}`, true);
    amount++;
    let Belgium = "";
    for (let i = 0; i < radios.EU.Belgium.length; i++) {
      Belgium += `**${i + 1 + 10 * amount}**[${radios.EU.Belgium[i].split(" ")[0].replace("-", " ").substr(0, 16)}](${radios.EU.Belgium[i].split(" ")[1]})\n`;
    }
    stationsembed.addField("🇧🇪 Belgium", `>>> ${Belgium}`, true);
    amount++;
    let Bosnia = "";
    for (let i = 0; i < radios.EU.Bosnia.length; i++) {
      Bosnia += `**${i + 1 + 10 * amount}**[${radios.EU.Bosnia[i].split(" ")[0].replace("-", " ").substr(0, 16)}](${radios.EU.Bosnia[i].split(" ")[1]})\n`;
    }
    stationsembed.addField("🇧🇦 Bosnia", `>>> ${Bosnia}`, true);
    amount++;
    let Czech = "";
    for (let i = 0; i < radios.EU.Czech.length; i++) {
      Czech += `**${i + 1 + 10 * amount}**[${radios.EU.Czech[i].split(" ")[0].replace("-", " ").substr(0, 16)}](${radios.EU.Czech[i].split(" ")[1]})\n`;
    }
    stationsembed.addField("🇨🇿 Czech", `>>> ${Czech}`, true);
    amount++;
    let Denmark = "";
    for (let i = 0; i < radios.EU.Denmark.length; i++) {
      Denmark += `**${i + 1 + 10 * amount}**[${radios.EU.Denmark[i].split(" ")[0].replace("-", " ").substr(0, 16)}](${radios.EU.Denmark[i].split(" ")[1]})\n`;
    }
    stationsembed.addField("🇩🇰 Denmark", `>>> ${Denmark}`, true);
    amount++;
    let germany = "";
    for (let i = 0; i < radios.EU.Germany.length; i++) {
      germany += `**${i + 1 + 10 * amount}**[${radios.EU.Germany[i].split(" ")[0].replace("-", " ").substr(0, 16)}](${radios.EU.Germany[i].split(" ")[1]})\n`;
    }
    stationsembed2.addField("🇩🇪 Germany", `>>> ${germany}`, true);
    amount++;
    let Hungary = "";
    for (let i = 0; i < radios.EU.Hungary.length; i++) {
      Hungary += `**${i + 1 + 10 * amount}**[${radios.EU.Hungary[i].split(" ")[0].replace("-", " ").substr(0, 16)}](${radios.EU.Hungary[i].split(" ")[1]})\n`;
    }
    stationsembed2.addField("🇭🇺 Hungary", `>>> ${Hungary}`, true);
    amount++;
    let Ireland = "";
    for (let i = 0; i < radios.EU.Ireland.length; i++) {
      Ireland += `**${i + 1 + 10 * amount}**[${radios.EU.Ireland[i].split(" ")[0].replace("-", " ").substr(0, 16)}](${radios.EU.Ireland[i].split(" ")[1]})\n`;
    }
    stationsembed2.addField("🇮🇪 Ireland", `>>> ${Ireland}`, true);
    amount++;
    let Italy = "";
    for (let i = 0; i < radios.EU.Italy.length; i++) {
      Italy += `**${i + 1 + 10 * amount}**[${radios.EU.Italy[i].split(" ")[0].replace("-", " ").substr(0, 16)}](${radios.EU.Italy[i].split(" ")[1]})\n`;
    }
    stationsembed2.addField("🇮🇹 Italy", `>>> ${Italy}`, true);
    amount++;
    let Luxembourg = "";
    for (let i = 0; i < radios.EU.Luxembourg.length; i++) {
      Luxembourg += `**${i + 1 + 10 * amount}**[${radios.EU.Luxembourg[i].split(" ")[0].replace("-", " ").substr(0, 16)}](${radios.EU.Luxembourg[i].split(" ")[1]})\n`;
    }
    stationsembed2.addField("🇱🇺 Luxembourg", `>>> ${Luxembourg}`, true);
    amount++;
    let Romania = "";
    for (let i = 0; i < radios.EU.Romania.length; i++) {
      Romania += `**${i + 1 + 10 * amount}**[${radios.EU.Romania[i].split(" ")[0].replace("-", " ").substr(0, 16)}](${radios.EU.Romania[i].split(" ")[1]})\n`;
    }
    stationsembed2.addField("🇷🇴 Romania", `>>> ${Romania}`, true);
    amount++;
    let Serbia = "";
    for (let i = 0; i < radios.EU.Serbia.length; i++) {
      Serbia += `**${i + 1 + 10 * amount}**[${radios.EU.Serbia[i].split(" ")[0].replace("-", " ").substr(0, 16)}](${radios.EU.Serbia[i].split(" ")[1]})\n`;
    }
    stationsembed3.addField("🇷🇸 Serbia", `>>> ${Serbia}`, true);
    amount++;
    let Spain = "";
    for (let i = 0; i < radios.EU.Spain.length; i++) {
      Spain += `**${i + 1 + 10 * amount}**[${radios.EU.Spain[i].split(" ")[0].replace("-", " ").substr(0, 16)}](${radios.EU.Spain[i].split(" ")[1]})\n`;
    }
    stationsembed3.addField("🇪🇸 Spain", `>>> ${Spain}`, true);
    amount++;
    let Sweden = "";
    for (let i = 0; i < radios.EU.Sweden.length; i++) {
      Sweden += `**${i + 1 + 10 * amount}**[${radios.EU.Sweden[i].split(" ")[0].replace("-", " ").substr(0, 16)}](${radios.EU.Sweden[i].split(" ")[1]})\n`;
    }
    stationsembed3.addField("🇸🇪 Sweden", `>>> ${Sweden}`, true);
    amount++;
    let Ukraine = "";
    for (let i = 0; i < radios.EU.Ukraine.length; i++) {
      Ukraine += `**${i + 1 + 10 * amount}**[${radios.EU.Ukraine[i].split(" ")[0].replace("-", " ").substr(0, 16)}](${radios.EU.Ukraine[i].split(" ")[1]})\n`;
    }
    stationsembed3.addField("🇺🇦 Ukraine", `>>> ${Ukraine}`, true);

    amount++;
    let Indonesia = "";
    for (let i = 0; i < radios.Asian.Indonesia.length; i++) {
      try {
        Indonesia += `**${i + 1 + 10 * amount}**[${radios.Asian.Indonesia[i].split(" ")[0].replace("-", " ").substr(0, 16)}](${radios.Asian.Indonesia[i].split(" ")[1]})\n`;
      } catch {}
    }
    stationsembed3.addField("🇮🇩 Indonseia", `>>> ${Indonesia}`, true);

    amount++;
    let requests = "";
    for (let i = 0; i < 10; i++) {
      requests += `**${i + 1 + 10 * amount}**[${radios.OTHERS.request[i].split(" ")[0].replace("-", " ").substr(0, 15)}](${radios.OTHERS.request[i].split(" ")[1]})\n`;
    }
    stationsembed3.addField("🧾 OTHERS", `>>> ${requests}`, true);
    requests = "";
    for (let i = 10; i < 20; i++) {
      try {
        requests += `**${i + 1 + 10 * amount}**[${radios.OTHERS.request[i].split(" ")[0].replace("-", " ").substr(0, 15)}](${radios.OTHERS.request[i].split(" ")[1]})\n`;
      } catch {}
    }
    stationsembed3.addField("🧾 OTHERS", `>>> ${requests}`, true);
    message.channel.send({
      embeds: [stationsembed]
    }).catch(e => console.log(e.stack ? String(e.stack).grey : String(e).grey))
    message.channel.send({
      embeds: [stationsembed2]
    }).catch(e => console.log(e.stack ? String(e.stack).grey : String(e).grey))
    message.channel.send({
      embeds: [stationsembed3]
    }).catch(e => console.log(e.stack ? String(e.stack).grey : String(e).grey))
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

async function autoplay(client, player, type) {

  let ss = await SettingsSchema.findOne({
    GuildId: player.guild
  }).clone();
  let ls = ss.Language;
  let es = ss.Embed;
  try {
    if (player.queue.length > 0) return;
    const previoustrack = player.get("previoustrack");
    if (!previoustrack) return;

    const mixURL = `https://www.youtube.com/watch?v=${previoustrack.identifier}&list=RD${previoustrack.identifier}`;
    const response = await client.manager.search(mixURL, previoustrack.requester);
    //if nothing is found, send error message, plus if there  is a delay for the empty QUEUE send error message TOO
    if (!response || response.loadType === 'LOAD_FAILED' || response.loadType !== 'PLAYLIST_LOADED') {
      let embed = new MessageEmbed()
        .setTitle(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable7"]))
        .setDescription(settings.LeaveOnEmpty_Queue.enabled && type != "skip" ? `I'll leave the Channel: \`${client.channels.cache.get(player.voiceChannel).name}\` in: \`${ms(settings.LeaveOnEmpty_Queue.time_delay)}\`, If the Queue stays Empty! ` : eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable9"]))
        .setColor(es.wrongcolor).setFooter(client.getFooter(es));
      client.channels.cache.get(player.textChannel).send({
        embeds: [embed]
      }).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
      if (settings.LeaveOnEmpty_Queue.enabled && type != "skip") {
        return setTimeout(() => {
          try {
            player = client.manager.players.get(player.guild);
            if (player.queue.size === 0) {
              let embed = new MessageEmbed()
              try {
                embed.setTitle(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable8"]))
              } catch {}
              try {
                embed.setDescription(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable1"]))
              } catch {}
              try {
                embed.setColor(es.wrongcolor)
              } catch {}
              try {
                embed.setFooter(client.getFooter(es));
              } catch {}
              client.channels.cache
                .get(player.textChannel)
                .send({
                  embeds: [embed]
                }).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
              try {
                client.channels.cache
                  .get(player.textChannel)
                  .messages.fetch(player.get("playermessage")).then(async msg => {
                    try {
                      await delay(7500)
                      msg.delete().catch(() => {});
                    } catch {
                      /* */
                    }
                  }).catch(() => {});
              } catch (e) {
                console.log(String(e.stack).grey.yellow);
              }
              player.destroy();
            }
          } catch (e) {
            console.log(String(e.stack).grey.yellow);
          }
        }, settings.LeaveOnEmpty_Queue.time_delay);
      } else {
        player.destroy();
      }
    }
    player.queue.add(response.tracks[Math.floor(Math.random() * Math.floor(response.tracks.length))]);
    return player.play();
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

function arrayMove(array, from, to) {
  try {
    array = [...array];
    const startIndex = from < 0 ? array.length + from : from;
    if (startIndex >= 0 && startIndex < array.length) {
      const endIndex = to < 0 ? array.length + to : to;
      const [item] = array.splice(from, 1);
      array.splice(endIndex, 0, item);
    }
    return array;
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

function nFormatter(num, digits = 2) {
  const lookup = [{
      value: 1,
      symbol: ""
    },
    {
      value: 1e3,
      symbol: "k"
    },
    {
      value: 1e6,
      symbol: "M"
    },
    {
      value: 1e9,
      symbol: "G"
    },
    {
      value: 1e12,
      symbol: "T"
    },
    {
      value: 1e15,
      symbol: "P"
    },
    {
      value: 1e18,
      symbol: "E"
    }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup.slice().reverse().find(function (item) {
    return num >= item.value;
  });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

async function swap_pages(client, message, description, TITLE) {
  let ss = await SettingsSchema.findOne({
    GuildId: message.guild.id
  })
  let prefix = await ss.Prefix;
  let es = await ss.Embed;
  let cmduser = message.author;

  let currentPage = 0;
  //GET ALL EMBEDS
  let embeds = [];
  //if input is an array
  if (Array.isArray(description)) {
    try {
      let k = 20;
      for (let i = 0; i < description.length; i += 20) {
        const current = description.slice(i, k);
        k += 20;
        const embed = new MessageEmbed()
          .setDescription(current.join("\n"))
          .setTitle(TITLE)
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null).setFooter(client.getFooter(es))
        embeds.push(embed);
      }
      embeds;
    } catch (e) {
      console.log(e.stack ? String(e.stack).grey : String(e).grey)
    }
  } else {
    try {
      let k = 1000;
      for (let i = 0; i < description.length; i += 1000) {
        const current = description.slice(i, k);
        k += 1000;
        const embed = new MessageEmbed()
          .setDescription(current)
          .setTitle(TITLE)
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null).setFooter(client.getFooter(es))
        embeds.push(embed);
      }
      embeds;
    } catch (e) {
      console.log(e.stack ? String(e.stack).grey : String(e).grey)
    }
  }
  if (embeds.length === 0) return message.channel.send({
    embeds: [new MessageEmbed()
      .setTitle(`${emoji.msg.ERROR} No Content added to the SWAP PAGES Function`)
      .setColor(es.wrongcolor).setThumbnail(es.thumb ? es.footericon : null).setFooter(client.getFooter(es))
    ]
  }).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
  if (embeds.length === 1) return message.channel.send({
    embeds: [embeds[0]]
  }).catch(e => console.log("THIS IS TO PREVENT A CRASH"))

  let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("833802907509719130").setLabel("Back")
  let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel("Home")
  let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('832598861813776394').setLabel("Forward")
  const allbuttons = [new MessageActionRow().addComponents([button_back, button_home, button_forward])]
  //Send message with buttons
  let swapmsg = await message.channel.send({
    content: `***Click on the __Buttons__ to swap the Pages***`,
    embeds: [embeds[0]],
    components: allbuttons
  });
  //create a collector for the thinggy
  const collector = swapmsg.createMessageComponentCollector({
    filter: (i) => i.isButton() && i.user && i.user.id == cmduser.id && i.message.author.id == client.user.id,
    time: 180e3
  }); //collector for 5 seconds
  //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
  collector.on('collect', async b => {
    if (b.user.id !== message.author.id)
      return b.reply({
        content: `❌ **Only the one who typed ${prefix}help is allowed to react!**`,
        ephemeral: true
      })
    //page forward
    if (b.customId == "1") {
      //b.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
      if (currentPage !== 0) {
        currentPage -= 1
        await swapmsg.edit({
          embeds: [embeds[currentPage]],
          components: allbuttons
        });
        await b.deferUpdate();
      } else {
        currentPage = embeds.length - 1
        await swapmsg.edit({
          embeds: [embeds[currentPage]],
          components: allbuttons
        });
        await b.deferUpdate();
      }
    }
    //go home
    else if (b.customId == "2") {
      //b.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
      currentPage = 0;
      await swapmsg.edit({
        embeds: [embeds[currentPage]],
        components: allbuttons
      });
      await b.deferUpdate();
    }
    //go forward
    else if (b.customId == "3") {
      //b.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
      if (currentPage < embeds.length - 1) {
        currentPage++;
        await swapmsg.edit({
          embeds: [embeds[currentPage]],
          components: allbuttons
        });
        await b.deferUpdate();
      } else {
        currentPage = 0
        await swapmsg.edit({
          embeds: [embeds[currentPage]],
          components: allbuttons
        });
        await b.deferUpdate();
      }

    }
  });
}

async function swap_pages2(client, message, embeds) {
  let currentPage = 0;
  let cmduser = message.author;
  if (embeds.length === 1) return message.channel.send({
    embeds: [embeds[0]]
  }).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
  let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("833802907509719130").setLabel("Back")
  let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel("Home")
  let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('832598861813776394').setLabel("Forward")
  const allbuttons = [new MessageActionRow().addComponents([button_back, button_home, button_forward])]
  let ss = await SettingsSchema.findOne({
    GuildId: message.guild.id
  });
  let prefix = ss.Prefix;
  //Send message with buttons
  let swapmsg = await message.channel.send({
    content: `***Click on the __Buttons__ to swap the Pages***`,
    embeds: [embeds[0]],
    components: allbuttons
  });
  //create a collector for the thinggy
  const collector = swapmsg.createMessageComponentCollector({
    filter: (i) => i.isButton() && i.user && i.user.id == cmduser.id && i.message.author.id == client.user.id,
    time: 180e3
  }); //collector for 5 seconds
  //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
  collector.on('collect', async b => {
    if (b.user.id !== message.author.id)
      return b.reply({
        content: `❌ **Only the one who typed ${prefix}help is allowed to react!**`,
        ephemeral: true
      })
    //page forward
    if (b.customId == "1") {
      //b.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
      if (currentPage !== 0) {
        currentPage -= 1
        await swapmsg.edit({
          embeds: [embeds[currentPage]],
          components: allbuttons
        });
        await b.deferUpdate();
      } else {
        currentPage = embeds.length - 1
        await swapmsg.edit({
          embeds: [embeds[currentPage]],
          components: allbuttons
        });
        await b.deferUpdate();
      }
    }
    //go home
    else if (b.customId == "2") {
      //b.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
      currentPage = 0;
      await swapmsg.edit({
        embeds: [embeds[currentPage]],
        components: allbuttons
      });
      await b.deferUpdate();
    }
    //go forward
    else if (b.customId == "3") {
      //b.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
      if (currentPage < embeds.length - 1) {
        currentPage++;
        await swapmsg.edit({
          embeds: [embeds[currentPage]],
          components: allbuttons
        });
        await b.deferUpdate();
      } else {
        currentPage = 0
        await swapmsg.edit({
          embeds: [embeds[currentPage]],
          components: allbuttons
        });
        await b.deferUpdate();
      }

    }
  });

}

async function swap_pages2_interaction(client, interaction, embeds) {
  let currentPage = 0;
  let cmduser = interaction.member.user;
  if (embeds.length === 1) return interaction.reply({
    ephemeral: true,
    embeds: [embeds[0]]
  }).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
  let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("833802907509719130").setLabel("Back")
  let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel("Home")
  let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('832598861813776394').setLabel("Forward")
  const allbuttons = [new MessageActionRow().addComponents([button_back, button_home, button_forward])]
  let ss = await client.Settings.findOne({
    GuildId: interaction.member.guild.id
  });
  let prefix = ss.Prefix;
  //Send message with buttons
  let swapmsg = await interaction.reply({
    content: `***Click on the __Buttons__ to swap the Pages***`,
    embeds: [embeds[0]],
    components: allbuttons
  });
  //create a collector for the thinggy
  const collector = swapmsg.createMessageComponentCollector({
    filter: (i) => i.isButton() && i.user && i.user.id == cmduser.id && i.message.author.id == client.user.id,
    time: 180e3
  }); //collector for 5 seconds
  //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
  collector.on('collect', async b => {
    if (b.user.id !== cmduser.id)
      return b.reply({
        content: `❌ **Only the one who typed ${prefix}help is allowed to react!**`,
        ephemeral: true
      })
    //page forward
    if (b.customId == "1") {
      //b.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
      if (currentPage !== 0) {
        currentPage -= 1
        await swapmsg.edit({
          ephemeral: true,
          embeds: [embeds[currentPage]],
          components: allbuttons
        });
        await b.deferUpdate();
      } else {
        currentPage = embeds.length - 1
        await swapmsg.edit({
          ephemeral: true,
          embeds: [embeds[currentPage]],
          components: allbuttons
        });
        await b.deferUpdate();
      }
    }
    //go home
    else if (b.customId == "2") {
      //b.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
      currentPage = 0;
      await swapmsg.edit({
        ephemeral: true,
        embeds: [embeds[currentPage]],
        components: allbuttons
      });
      await b.deferUpdate();
    }
    //go forward
    else if (b.customId == "3") {
      //b.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
      if (currentPage < embeds.length - 1) {
        currentPage++;
        await swapmsg.edit({
          ephemeral: true,
          embeds: [embeds[currentPage]],
          components: allbuttons
        });
        await b.deferUpdate();
      } else {
        currentPage = 0
        await swapmsg.edit({
          ephemeral: true,
          embeds: [embeds[currentPage]],
          components: allbuttons
        });
        await b.deferUpdate();
      }

    }
  });
}

async function swap_pages2_interaction_DM(client, interaction, embeds) {
  let currentPage = 0;
  let cmduser = interaction.member.user;
  if (embeds.length === 1) return interaction.reply({
    ephemeral: true,
    embeds: [embeds[0]]
  }).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
  let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("833802907509719130").setLabel("Back")
  let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel("Home")
  let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('832598861813776394').setLabel("Forward")
  const allbuttons = [new MessageActionRow().addComponents([button_back, button_home, button_forward])]
  let ss = await client.Settings.findOne({
    GuildId: interaction.member.guild.id
  });
  let prefix = ss.Prefix;
  //Send message with buttons

  interaction.reply({
    embeds: [new MessageEmbed()
      .setColor('RANDOM')
      .setTitle(`${emoji.msg.SUCCESS} Check your DM`)
    ],
    ephemeral: true
  })
  let swapmsg = await cmduser.send({
    content: "***Click on the __Buttons__ to swap the Pages***",
    embeds: [embeds[0]],
    components: allbuttons
  });
  //create a collector for the thinggy
  const collector = swapmsg.createMessageComponentCollector({
    filter: (i) => i.isButton() && i.user && i.user.id == cmduser.id && i.message.author.id == client.user.id,
    time: 180e3
  }); //collector for 5 seconds
  //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
  collector.on('collect', async b => {
    if (b.user.id !== cmduser.id)
      return b.reply({
        content: `❌ **Only the one who typed ${prefix}help is allowed to react!**`,
        ephemeral: true
      })
    //page forward
    if (b.customId == "1") {
      //b.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
      if (currentPage !== 0) {
        currentPage -= 1
        await swapmsg.edit({
          ephemeral: true,
          embeds: [embeds[currentPage]],
          components: allbuttons
        });
        await b.deferUpdate();
      } else {
        currentPage = embeds.length - 1
        await swapmsg.edit({
          ephemeral: true,
          embeds: [embeds[currentPage]],
          components: allbuttons
        });
        await b.deferUpdate();
      }
    }
    //go home
    else if (b.customId == "2") {
      //b.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
      currentPage = 0;
      await swapmsg.edit({
        ephemeral: true,
        embeds: [embeds[currentPage]],
        components: allbuttons
      });
      await b.deferUpdate();
    }
    //go forward
    else if (b.customId == "3") {
      //b.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
      if (currentPage < embeds.length - 1) {
        currentPage++;
        await swapmsg.edit({
          ephemeral: true,
          embeds: [embeds[currentPage]],
          components: allbuttons
        });
        await b.deferUpdate();
      } else {
        currentPage = 0
        await swapmsg.edit({
          ephemeral: true,
          embeds: [embeds[currentPage]],
          components: allbuttons
        });
        await b.deferUpdate();
      }

    }
  });
}

async function musicSystem(client, guildid, channelid) {
  let ss = await SettingsSchema.findOne({
    GuildId: guildid
  });
  let es = ss.Embed;
  let ls = ss.Language;
  let guild = client.guilds.cache.get(guildid)
  let channel = guild.channels.cache.get(channelid)
  //first declare all embeds
  var embeds = [
    new MessageEmbed()
    .setColor("DARK_RED")
    .setTitle(`❗️ No songs in queue of __${guild.name}__ ❗️`),
    new MessageEmbed()
    .setColor("DARK_RED")
    .setFooter(client.getFooter(`${es.footertext}\nLast update playlist selection: 18-01-2022`, client.user.displayAvatarURL()))
    .setImage(guild.banner ? guild.bannerURL({
      size: 4096
    }) : "https://cdn.discordapp.com/attachments/784917578974756904/938513017472180294/New_BV_Logo__Effect_gif.gif")
    .setTitle(`Start Listening to Music, by connecting to a Voice Channel and sending either the **SONG LINK** or **SONG NAME** in this Channel!`)
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
  var components = [
    new MessageActionRow().addComponents([
      new MessageSelectMenu()
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
      .setPlaceholder(eval(client.la[ls]["cmds"]["settings"]["setup-music"]["var5"]))
    ]),
    new MessageActionRow().addComponents([
      new MessageButton().setStyle('PRIMARY').setCustomId('Skip').setEmoji(`⏭`).setLabel(`Skip`).setDisabled(),
      new MessageButton().setStyle('DANGER').setCustomId('Stop').setEmoji(`⏹️`).setLabel(`Stop`).setDisabled(),
      new MessageButton().setStyle('SECONDARY').setCustomId('Pause').setEmoji('⏸').setLabel(`Pause`).setDisabled(),
      new MessageButton().setStyle('PRIMARY').setCustomId('Shuffle').setEmoji('🔀').setLabel(`Shuffle`).setDisabled(),
      new MessageButton().setStyle('SECONDARY').setCustomId('Autoplay').setEmoji('🔁').setLabel(`Autoplay Off`).setDisabled(),
    ]),
    new MessageActionRow().addComponents([
      new MessageButton().setStyle('SUCCESS').setCustomId('VolUp').setEmoji(`🔊`).setLabel(`Vol +10`).setDisabled(),
      new MessageButton().setStyle('SUCCESS').setCustomId('VolDown').setEmoji(`🔉`).setLabel(`Vol -10`).setDisabled(),
      new MessageButton().setStyle('PRIMARY').setCustomId('Forward').setEmoji('⏩').setLabel(`+10 Sec`).setDisabled(),
      new MessageButton().setStyle('PRIMARY').setCustomId('Rewind').setEmoji('⏪').setLabel(`-10 Sec`).setDisabled(),
      new MessageButton().setStyle('SUCCESS').setCustomId('Queue').setEmoji(`🔂`).setLabel(`Loop Queue`).setDisabled(),
    ]),
  ]
  let data = await MusicSchema.findOne({
    guildId: guildid
  });
  if (data.channelId.length > 5) return;

  channel.send({
    files: [{
      attachment: 'https://cdn.discordapp.com/attachments/784917578974756904/938513017472180294/New_BV_Logo__Effect_gif.gif'
    }],
    embeds,
    components
  }).then(msg => {
    data.channelId = channel.id;
    data.messageId = msg.id;
    data.save();
  });
}

function databasing(client, guildid, userid) {
  let guild = client.guilds.cache.get(guildid);
  if (!client || client == undefined || !client.user || client.user == undefined) return;
  try {
    if (userid) {
      client.queuesaves.ensure(userid, {
        "TEMPLATEQUEUEINFORMATION": ["queue", "sadasd"]
      });
    }
    MusicSchema.findOne({
      guildId: guildid
    }, async (err, data) => {
      if (!data) {
        new MusicSchema({
          guildId: guildid,
          channelId: "",
          messageId: "",
        }).save();
      } else {
        return;
      }
    });
    StatsSchema.findOne({
      GuildId: guildid
    }, async (err, data) => {
      if (!data) {
        new StatsSchema({
          GuildId: guildid,
          Commands: 0,
          Songs: 0,
        }).save();
      } else {
        return;
      }
    });
    StatsGSchema.findOne({
      BotId: client.user.id
    }, async (err, data) => {
      if (!data) {
        new StatsGSchema({
          BotId: client.user.id,
          Commands: 0,
          Songs: 0,
        }).save();
      } else {
        return;
      }
    });
    EmbedSchema.findOne({
      GuildId: guildid
    }, async (err, data) => {
      if (!data) {
        new EmbedSchema({
          GuildId: guildid,
          Color: "",
          Footer: "",
          Title: "",
          Description: "",
          Thumbnail: "",
          Image: "",
          ChannelId: "",
        }).save();
      }
    })
    greetingmsg.findOne({
      GuildId: guildid
    }, async (err, data) => {
      if (!data) {
        new greetingmsg({
          GuildId: guildid,
          ChannelId: "",
          Message: "",
        }).save();
      }
    })
    leaveMessage.findOne({
      GuildId: guildid
    }, async (err, data) => {
      if (!data) {
        new leaveMessage({
          GuildId: guildid,
          ChannelId: "",
          Message: "",
        }).save();
      }
    })
    autorole.findOne({
      GuildId: guildid
    }, async (err, data) => {
      if (!data) {
        new autorole({
          GuildId: guildid,
          RoleId: "",
        }).save();
      }
    })
    SettingsSchema.findOne({
      GuildId: guildid
    }, async (err, data) => {
      let avatar = client.guilds.cache.get(guildid).iconURL({
        dynamic: true
      });
      if (avatar === null) avatar = client.user.displayAvatarURL({
        dynamic: true
      });
      if (!data) {
        new SettingsSchema({
          GuildId: guildid,
          GuildName: guild.name,
          Prefix: config.prefix,
          Language: settings.default_db_data.language,
          Pruning: settings.default_db_data.pruning,
          Unkowncmdmessage: settings.default_db_data.unkowncmdmessage,
          Autoresume: settings.default_db_data.autoresume,
          Volume: settings.default_db_data.defaultvolume,
          Eq: settings.default_db_data.defaultequalizer,
          AutoPlay: settings.default_db_data.defaultautoplay,
          AutoRole: settings.default_db_data.autorole,
          Greeting: settings.default_db_data.greeting,
          leaveMessage: false,
          DjRoles: "",
          BotChannel: [],
          Embed: {
            succescolor: ee.succescolor,
            color: ee.color,
            wrongcolor: ee.wrongcolor,
            thumb: true,
            footertext: client.guilds.cache.get(guildid) ? client.guilds.cache.get(guildid).name : ee.footertext,
            footericon: avatar,
          }
        }).save();
      }
    });
    return;
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

function leveling(client, message, guildid, userid) {
  let guild = client.guilds.cache.get(guildid);
  let member = guild.members.cache.get(userid);
  if (!client || client == undefined || !client.user || client.user == undefined) return;
  let key = member.user.id;
  try {
    levelingSystem.findOne({
      GuildId: guildid
    }, async (err, data) => {
      if (member.user.bot) return;
      if (!data) {
        new levelingSystem({
          GuildId: guildid,
          status: false,
          user: {
            [userid]: {
              point: 0,
              level: 1,
            },
          },
        }).save();
      } else {
        const key = userid;
        if (!data.user[0][key]) {
          data.user[0][key] = {
            point: 0,
            level: 1,
          }
          await levelingSystem.findOneAndUpdate({
            GuildId: guildid
          }, data);
        }
      }
      let ss = await client.Settings.findOne({
        GuildId: guildid
      });
      let es = ss.Embed;
      let ls = ss.Language;
      if (!data) return;
      if (!data.status) return;
      if (!data.user[0][key]) return;
      if (member.user.bot) return;

      const key2 = `${message.guild.id}-${message.author.id}`;
      client.points.ensure(`${message.guild.id}-${message.author.id}`, {
        user: message.author.id,
        guild: message.guild.id,
        points: data.user[0][key].point,
        level: data.user[0][key].level,
      });
      var msgl = message.content.length || (Math.floor(Math.random() * (message.content.length - message.content.length / 100 + 1) + 10));
      if (msgl) {
        var randomnum = Math.floor(msgl * 20) / 100
        data.user[0][key].point += randomnum;
        await levelingSystem.findOneAndUpdate({
          GuildId: guildid
        }, data);
      }

      client.points.set(key2, data.user[0][key].point, `points`)
      client.points.inc(key2, `points`);

      //////////leveling//////////
      const curLevel = Math.floor(0.1 * Math.sqrt(client.points.get(key2, `points`)));
      //math
      let curpoints = Number(client.points.get(key2, `points`).toFixed(2));
      //math
      // let curnextlevel = Number(((Number(1) + Number(client.points.get(key2, `level`).toFixed(2))) * Number(10)) * ((Number(1) + Number(client.points.get(key2, `level`).toFixed(2))) * Number(10)));
      //if its a new level then do this
      if (data.user[0][key].level < curLevel) {
        //define ranked embed
        const embed = new Discord.MessageEmbed()
          .setColor(es.color).setFooter(client.getFooter(es))
          .setThumbnail(es.thumb ? es.footericon : null)
          .setTimestamp()
          .setTitle(`🎉 Congrats ${message.author.username} your Level has been Up!`)
          .setDescription(`**You've leveled up to Level: **\`${curLevel}\`! \n**Your Point: **\`${Number(curpoints.toFixed(2))}\``)

        message.channel.send({
          content: `<@!${key}>`,
          embeds: [embed]
        });

        //set the new level
        data.user[0][key].level = curLevel;

        await levelingSystem.findOneAndUpdate({
          GuildId: guildid
        }, data);
      }
      //set the new level
      client.points.set(key2, data.user[0][key].level, `level`);
    }).clone();
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}