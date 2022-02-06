const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed`);
const url = require(`${process.cwd()}/botconfig/url.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const PremiumSchema = require(`../../databases/premium`);
const day = require("dayjs");
module.exports = {
  name: `premium`,
  category: `Mics`,
  description: `Requests Premium for your Server`,
  usage: `premium`,
  memberpermissions: [`ADMINISTRATOR`],
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    PremiumSchema.findOne({GuildId : message.guild.id }, async (err, data) => {
      if(data){
        let n = await data.DateExp;
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.color)
            .setThumbnail(es.thumb ? url.img.coin : null)
            .setTitle(eval(client.la[ls]["cmds"]["misc"]["premium"]["var1"]))
            .setDescription(eval(client.la[ls]["cmds"]["misc"]["premium"]["var2"]))
          ]
        })
      } else {
        let theowner = "NO OWNER DATA! ID: ";
        await message.guild.fetchOwner().then(({
          user
        }) => {
          theowner = user;
        }).catch(() => {})
        
        let embed = new MessageEmbed()
          .setColor("GREEN")
          .setTitle(`✅ A new Server requests **PREMIUM**`)
          .addField("Guild Info", `>>> \`\`\`${message.guild.name} (${message.guild.id})\`\`\``)
          .addField("Owner Info", `>>> \`\`\`${theowner ? `${theowner.tag} (${theowner.id})` : `${theowner} (${message.guild.ownerId})`}\`\`\``)
          .addField("Member Count", `>>> \`\`\`${message.guild.memberCount}\`\`\``)
          .addField("Requested By:", `>>> \`\`\`${message.author.tag} (${message.author.id})\`\`\``)
          .setThumbnail(message.guild.iconURL({
            dynamic: true
          }))
          .setFooter(client.setFooter(`${message.author.id}-${message.guild.id}`, message.author.displayAvatarURL({
            dynamic: true
          })))
      
        for (const owner of config.ownerIDS) {
          client.users.fetch(owner).then(user => {
            user.send({
              embeds: [embed],
              // components: [
              //   new MessageActionRow().addComponents([
              //     new MessageButton().setStyle("SUCCESS").setEmoji("✅").setCustomId("PREMIUM-ACCEPT").setLabel("Accept"),
              //     new MessageButton().setStyle("DANGER").setEmoji("❌").setCustomId("PREMIUM-DENY").setLabel("Deny")
              //   ])
              // ]
            }).catch(() => {});
          }).catch(() => {});
        }
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.color)
          .setTitle(eval(client.la[ls]["cmds"]["misc"]["premium"]["var3"]))
          .setDescription(eval(client.la[ls]["cmds"]["misc"]["premium"]["var2"]))
        ]
      })
      }
    })
  }
};