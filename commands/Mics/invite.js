const {
  MessageEmbed,
  MessageButton,
  MessageActionRow
} = require("discord.js")
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const url = require(`${process.cwd()}/botconfig/url.json`);
const {
  handlemsg
} = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "invite",
  category: "Mics",
  aliases: ["add", "inv"],
  usage: "invite",
  description: "Gives you an Invite link for this Bot.",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let user = message.mentions.users.first() || client.user;
    if (user) {
      if (!user.bot) return interaction.reply({
        ephemeral: true,
        content: eval(client.la[ls]["cmds"]["misc"]["invite"]["var1"])
      })
      let button_support_dc = new MessageButton().setStyle('LINK').setLabel(handlemsg(client.la[ls].cmds.info.invite.buttons.server)).setURL("https://discord.gg/wrTHfMqzaQ")
      let button_invite = new MessageButton().setStyle('LINK').setLabel("Invite " + user.username).setURL(`https://discord.com/api/oauth2/authorize?client_id=${user.id}&permissions=8&scope=identify%20email%20guilds%20bot%20applications.commands`)
      //array of all buttons
      const allbuttons = [new MessageActionRow().addComponents([button_support_dc, button_invite])]
      message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.color)
          .setAuthor(client.getAuthor(user.username, ee.footericon, url.website.web))
          .setDescription(eval(client.la[ls]["cmds"]["misc"]["invite"]["var2"]))
          .setThumbnail(user.displayAvatarURL())
          .setFooter(client.getFooter(es))
        ],
        components: allbuttons
      });
    }
  }
}