const {
  MessageEmbed
} = require('discord.js');
const ee = require('../../botconfig/embed');
const settings = require('../../botconfig/settings.json');
const emoji = require('../../botconfig/emojis.json');
const AutoRoleSchema = require('../../databases/autorole');
const SettingsSchema = require('../../databases/settings');
const GreetingSchema = require('../../databases/greetingmsg');

module.exports = async (client, member) => {
  let guild = client.guilds.cache.get(member.guild.id);
  let ss = await client.Settings.findOne({
    GuildId: member.guild.id
  });
  let es = ss.Embed;
  let ls = ss.Language;

  if (ss.Greeting === true) {
    GreetingSchema.findOne({
      GuildId: member.guild.id
    }, async (err, data) => {
      if (!data) return;
      const channel = await member.guild.channels.cache.get(data.ChannelId);
      var msg = await data.Message;
      if (msg === null) return;

      function handlemsg(txt, options) {
        let text = String(txt);
        for (const option in options) {
          var toreplace = new RegExp(`%${option}%`, "ig");
          text = text.replace(toreplace, options[option]);
        }
        return text;
      }
      channel.send(handlemsg(msg, {
        mention: member,
        guild: member.guild.name,
      }))
    });
  }

  if (!ss.AutoRole) {
    ss.AutoRole = settings.default_db_data.autorole,
      await ss.save();
  }

  let channelToSendTo;
  if (ss.AutoRole == true) {
    await AutoRoleSchema.findOne({ GuildId: member.guild.id }, async (err, ard) => {
      if (!ard) return;
      try {
        if (ard) {
          const role = member.guild.roles.cache.get(ard.RoleId);
          if (!role) {
            guild.channels.cache.forEach((channel) => {
              if (channel.type === "GUILD_TEXT" && channel.permissionsFor(guild.me).has("SEND_MESSAGES"))
                channelToSendTo = channel;
            });
            if (!channelToSendTo);
            channelToSendTo.send({
              embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(`${emoji.msg.ERROR} Cant find role`)
                .setFooter(client.getFooter(es))
              ]
            })
            return ard.delete().catch(() => {});
          }
          await member.roles.add(role)
        }
      } catch {
        guild.channels.cache.forEach((channel) => {
          if (channel.type === "GUILD_TEXT" && channel.permissionsFor(guild.me).has("SEND_MESSAGES"))
            channelToSendTo = channel;
        });
        if (!channelToSendTo);
        channelToSendTo.send({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(`${emoji.msg.ERROR} **My role level is lowed! Please up my roles before use command autorole!**`)
            .setFooter(client.getFooter(es))
          ]
        })
      }
    }).clone();
  }
}