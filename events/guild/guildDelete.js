const { MessageEmbed } = require("discord.js")
const config = require(`${process.cwd()}/botconfig/config.json`)
const settings = require(`${process.cwd()}/botconfig/settings.json`);
const ee = require(`${process.cwd()}/botconfig/embed`);

module.exports = async (client, guild) => {
  client.logger(`Left a Guild: ${guild.name} (${guild.id}) | Members: ${guild.memberCount} | Current-Average Members/Guild: ${Math.floor(client.guilds.cache.filter((e) => e.memberCount).reduce((a, g) => a + g.memberCount, 0) / client.guilds.cache.size)}`.red)
  if (!settings[`show-serverjoins`]) return;
  if (!guild || guild.available === false) return
  let theowner = "NO OWNER DATA! ID: ";
  await guild.fetchOwner().then(({
    user
  }) => {
    theowner = user;
  }).catch(() => {})

  // delete database mongodb
  await client.Autorolesettings.findOneAndDelete({ GuildId : guild.id });
  await client.Embedsettings.findOneAndDelete({ guildId : guild.id });
  await client.Greetingmsg.findOneAndDelete({ GuildId : guild.id });
  await client.Membercount.findOneAndDelete({ GuildId : guild.id });
  await client.Mutesettings.findOneAndDelete({ GuildId : guild.id });
  await client.Premium.findOneAndDelete({ GuildId : guild.id });
  await client.reactrole.findOneAndDelete({ GuildId: guild.id });
  await client.Settings.findOneAndDelete({ GuildId: guild.id });
  await client.stats.findOneAndDelete({ GuildId : guild.id});
  await client.Musicsettings.findOneAndDelete({ guildId : guild.id });
  await client.leveling.findOneAndDelete({ GuildId : guild.id });

  let embedD = new MessageEmbed()
  
    .setColor("RED")
    .setTitle(`👋 LEFT A GUILD`)
    .addField("Guild Info", "\`\`\`Guild Name: " + `${guild.name}\n` + "Guild ID: " + `${guild.id}\n` + "Member Count: " + `${guild.memberCount}\`\`\`` )
    .addField("Guild Owner Info", "\`\`\`Owner: " + `${theowner ? `${theowner.tag}\n` + "Owner ID: " + `${theowner.id}` : `${theowner} (${guild.ownerId})`}\`\`\`` )
    .addField("Bot Info", "\`\`\`Guild Totals: " + `${client.guilds.cache.size}\n` + "User Totals: " + `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}\`\`\`` )
    .setFooter(client.getFooter(ee))
    .setThumbnail(guild.iconURL({ dynamic: true }))
    
    let logsChannel = config.channel.Logs;
    client.channels.cache.get(logsChannel).send({
      embeds: [embedD]
    })
}