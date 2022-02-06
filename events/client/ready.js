//here the event starts
const config = require(`${process.cwd()}/botconfig/config.json`);
const Discord = require("discord.js")
const moment = require("moment")
const ms = require('ms')
const MCSchema = require('../../databases/memberCount');
module.exports = client => {
  setInterval(() => {
    MCSchema.find().then((data) => {
      if(!data && !data.length) return;

      data.forEach((value) => {
        const guild = client.guilds.cache.get(value.GuildId);
        const memberCount = guild.memberCount;

        if (value.Member != memberCount) {
          client.logger(`The member count differs in ${guild.name}`)
          const channel = guild.channels.cache.get(value.ChannelId);
          channel.setName(`👤 Members: ${memberCount}`);
          value.Member = memberCount;
          value.save();
        }
      });
    });
  }, ms("5 seconds"));
  try {
    client.logger(
      `Bot User: `.brightBlue + `${client.user.tag}`.blue + `\n` +
      `Bot Version: `.brightBlue + `v${require('../../package.json').version}`.blue + `\n` +
      `Guild(s): `.brightBlue + `${client.guilds.cache.size} Servers`.blue + `\n` +
      `Watching: `.brightBlue + `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`.blue + `\n` +
      `Prefix: `.brightBlue + `${config.prefix}`.blue + `\n` +
      `Commands: `.brightBlue + `${client.commands.size}`.blue + `\n` +
      `Discord.js: `.brightBlue + `v${Discord.version}`.blue + `\n` +
      `Node.js: `.brightBlue + `${process.version}`.blue + `\n` +
      `Plattform: `.brightBlue + `${process.platform} ${process.arch}`.blue + `\n` +
      `Memory: `.brightBlue + `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`.blue
    );

    change_status(client);
    setInterval(() => {
      change_status(client);
    }, 60000);

  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}
var state = false;

function change_status(client) {
  if (!state) {
    state = !state;
    client.user.setActivity(`${config.status.text}`
      .replace("{prefix}", config.prefix)
      .replace("{guildcount}", client.guilds.cache.size)
      .replace("{membercount}", client.guilds.cache.reduce((a, b) => a + b.memberCount, 0))
      .replace("{created}", moment(client.user.createdTimestamp).format("DD/MM/YYYY"))
      .replace("{createdime}", moment(client.user.createdTimestamp).format("HH:mm:ss"))
      .replace("{name}", client.user.username)
      .replace("{tag}", client.user.tag)
      .replace("{commands}", client.commands.size)
      );
  } else {
    client.user.setActivity(`${config.status.text2}`
      .replace("{prefix}", config.prefix)
      .replace("{guildcount}", client.guilds.cache.size)
      .replace("{membercount}", client.guilds.cache.reduce((a, b) => a + b.memberCount, 0))
      .replace("{created}", moment(client.user.createdTimestamp).format("DD/MM/YYYY"))
      .replace("{createdime}", moment(client.user.createdTimestamp).format("HH:mm:ss"))
      .replace("{name}", client.user.username)
      .replace("{tag}", client.user.tag)
      .replace("{commands}", client.commands.size)
      );
  }
}