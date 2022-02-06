//The Module
const { Permissions, MessageEmbed } = require("discord.js")
const config = require(`../../botconfig/config.json`)
const settings = require(`${process.cwd()}/botconfig/settings.json`);
const url = require(`${process.cwd()}/botconfig/url.json`);
const ee = require(`${process.cwd()}/botconfig/embed`);
const { databasing } = require(`${process.cwd()}/handlers/functions`);

module.exports = async (client, guild, message, prefix) => {
  client.logger(`Joined a new Guild: ${guild.name} (${guild.id}) | Members: ${guild.memberCount} | Current-Average Members/Guild: ${Math.floor(client.guilds.cache.filter((e) => e.memberCount).reduce((a, g) => a + g.memberCount, 0) / client.guilds.cache.size)}`.brightGreen)
  if (!settings[`show-serverjoins`]) return;
  if (!guild || guild.available === false) return
  let theowner = "NO OWNER DATA! ID: ";
  await guild.fetchOwner().then(({ user }) => { theowner = user; }).catch(() => {})
  databasing(client, guild.id)

  let embed = new MessageEmbed()
    .setColor("GREEN")
    .setTitle(`👍 NEW SERVER ADDED!`)
    .addField("Guild Info", "\`\`\`Guild Name: " + `${guild.name}\n` + "Guild ID: " + `${guild.id}\n` + "Member Count: " + `${guild.memberCount}\`\`\`` )
    .addField("Guild Owner Info", "\`\`\`Owner: " + `${theowner ? `${theowner.tag}\n` + "Owner ID: " + `${theowner.id}` : `${theowner} (${guild.ownerId})`}\`\`\`` )
    .addField("Bot Info", "\`\`\`Guild Totals: " + `${client.guilds.cache.size}\n` + "User Totals: " + `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}\`\`\`` )
    .addField("Leave Guild:", `\`\`\`${config.prefix}leaveserver ${guild.id}\`\`\``)
    .setFooter(client.getFooter(ee))
    .setThumbnail(guild.iconURL({ dynamic: true }))

  let logsChannel = config.channel.Logs;
  client.channels.cache.get(logsChannel).send({
    embeds: [embed]
  })
  
  try {
    let channelToSendTo;
    guild.channels.cache.forEach((channel) => {
      if (channel.type === "GUILD_TEXT" && channel.permissionsFor(guild.me).has("SEND_MESSAGES"))
        channelToSendTo = channel;
    });
    if (!channelToSendTo);
    const embed = new MessageEmbed()
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(`LUMINOUS_VIVID_PINK`)
    .setAuthor(client.getAuthor(`Hai, ${client.user.username} here!`, client.user.displayAvatarURL(), 'https://discord.gg/wrTHfMqzaQ'))
    .setDescription(`❓ Run \`${config.prefix}help\` to the see all commands I have. \n\n💿 Run \`${config.prefix}setup-music\` for Setup a Music Request Channel. \n\n🤖 Run \`${config.prefix}adddj\` for setting DJ Role. \n\n🎶 Want to listen to music? Run \`${config.prefix}play\`.`)
    .addFields(
      {
        name: "🌐",
        value: `┕[[Website]](${url.website.web})`,
        inline: true,
      },
      {
        name: "🏠",
        value: `┕[[Support]](${url.website.supportserver})`,
        inline: true,
      },
      {
        name: `📥`,
        value: `┕[[Invite]](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=identify%20email%20guilds%20bot%20applications.commands)`,
        inline: true,
      }
    )
    .setFooter(client.getFooter(`${client.user.username} | By: adamkaisa#9997`))
    .setTimestamp()
    channelToSendTo.send({ embeds: [embed]});
  } catch (e) {
    console.log(e);
  }
}