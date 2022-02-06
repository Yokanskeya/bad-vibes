const {
  MessageEmbed,
} = require(`discord.js`);
const emoji = require('../../botconfig/emojis.json')
const url = require('../../botconfig/url.json')
module.exports = {
  name: `saymessage`,
  aliases: ["saymsg", "sendmessage", "message"],
  category: `Mics`,
  description: `Create and Send the custom Embed`,
  usage: `sayembed`,
  memberpermissions: [`ADMINISTRATOR`],
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    let channel = message.mentions.channels.first();
    if (!channel) return message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle(`Please mention channels to send your message!`)
        .addField(`Usage:`, `\`\`\`${prefix}saymessage <#text-channel> <your message>\`\`\``)
        .addField(`Example:`, `\`\`\`${prefix}saymessage #text-channel Hallo world!\`\`\``)
      ]
    })
    let query = args.slice(1).join(' ');
    if (!query) return message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle(`Please insert your message!`)
        .addField(`Usage:`, `\`\`\`${prefix}saymessage <#text-channel> <your message>\`\`\``)
        .addField(`Example:`, `\`\`\`${prefix}saymessage #text-channel Hallo world!\`\`\``)
      ]
    })
    message.react(emoji.react.SUCCESS);
    message.reply(`Message has been sending in ${channel}!`)
    return channel.send(`${query}`)
  }
}