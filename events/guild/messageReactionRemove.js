const { MessageEmbed } = require("discord.js");
const Schema = require("../../databases/reaction-roles");
const config = require('../../botconfig/config.json');
const SettingsSchema = require('../../databases/settings');
const ee = require('../../botconfig/embed');

module.exports = async (client, reaction, user) => {
  let guild = client.guilds.cache.get(reaction.message.guildId)
  let member = await guild.members.cache.get(user.id)
  let channel = await guild.channels.cache.get(reaction.message.channelId)
  let ss = await client.Settings.findOne({ GuildId : guild.id });
  let es = ss.Embed;
  let ls = ss.Language;

  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;

  try {
    Schema.findOne({ Message: reaction.message.id }, async (err, data) => {
      if (!data) return;
      if (!Object.keys(data.RolesId).includes(reaction.emoji.name)) return;
  
      const [roleid] = data.RolesId[reaction.emoji.name];
      try {
        await member.roles.remove(roleid)
      } catch {
        return channel.send(`${user} You don't have that role!`)
      }
      // return channel.send(`${user} <@&${roleid}> role has been deleted!`)
      return channel.send({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setDescription(`${user} <@&${roleid}> role has been deleted!`)
        ]
      }).then((msg) =>{
          try {
            setTimeout(() => {
              msg.delete().catch(() => {});
            }, 6000);
          } catch (error) {
            console.log(error)
          }
        })
    });
  } catch (error) {
    console.log(error)
  }
}