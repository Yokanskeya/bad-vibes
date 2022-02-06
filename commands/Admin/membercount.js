const {
  MessageEmbed,
  ReactionUserManager
} = require('discord.js');
const emoji = require('../../botconfig/emojis.json');
const ee = require('../../botconfig/embed')
const MCSchema = require('../../databases/memberCount');
module.exports = {
  name: "membercount",
  aliases: [],
  category: "Admin",
  description: "Count all members directly entering and leaving the server.",
  usage: "membercount",
  memberpermissions: [`ADMINISTRATOR`],
  type: "bot",
  cooldown: 360,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    MCSchema.findOne({ GuildId: message.guild.id }, async (err, data) => {
      if (data) data.delete();
      const channels = await message.guild.channels.create(
        `👤 Members: ${message.guild.memberCount}`, {
          type: "GUILD_VOICE",
          permissionOverwrites: [{
            id: message.guild.id,
            deny: ["CONNECT"],
          }, ],
        }
      ).catch(() => {});
      new MCSchema({
        GuildId: message.guild.id,
        ChannelId: channels.id,
        Member: message.guild.memberCount,
      }).save();
      message.react(emoji.react.SUCCESS)
      return message.reply({
        embeds: [
          new MessageEmbed()
          .setColor(es.color)
          .setTitle(eval(client.la[ls]["cmds"]["admin"]["membercount"]["var1"]))
          .setDescription(eval(client.la[ls]["cmds"]["admin"]["membercount"]["var2"]))
        ]
      });
    });
  }
};