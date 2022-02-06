const { MessageEmbed } = require("discord.js");
const ee = require('../../botconfig/embed');
const Schema = require("../../databases/reaction-roles");

module.exports = async (client, reaction, user) => {
  let guild = client.guilds.cache.get(reaction.message.guildId)
  let member = await guild.members.cache.get(user.id)
  let channel = await guild.channels.cache.get(reaction.message.channelId)
  let ss = await client.Settings.findOne({ GuildId : guild.id });
  let es = ss.Embed;
  let ls = ss.Language;
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return

  try {
    Schema.findOne({ Message: reaction.message.id }, async (err, data) => {
      if (!data) return;
      if (!Object.keys(data.RolesId).includes(reaction.emoji.name)) return;

      const [roleid] = data.RolesId[reaction.emoji.name];
  
      try {
        await member.roles.add(roleid)
      } catch {
        return channel.send(`${user} You already have that role!`)
      }
      // return channel.send(`${user} You have obtain the <@&${roleid}> role!`)
      return channel.send({
        embeds: [new MessageEmbed()
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          .setDescription(`${user} You have obtain the <@&${roleid}> role!`)
        ]
      })
        .then((msg) =>{
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