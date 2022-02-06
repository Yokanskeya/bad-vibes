const {
    MessageEmbed
  } = require(`discord.js`);
  const schema = require('../../databases/premium');
  const day = require("dayjs");
  const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
  const settings = require(`${process.cwd()}/botconfig/settings.json`);
  const config = require(`${process.cwd()}/botconfig/config.json`);

  module.exports = {
    name: `premium-guild`,
    aliases: [`pga`],
    type: "info",
    category: "Owner",
    description: `ENABLE / DISABLE the PREMIUM - STATE of a GUILD`,
    usage: `premium-guild <GUILDID>`,
    cooldown: 5,
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
        if (!config.ownerIDS.includes(message.author.id))
        return message.channel.send({
            embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["owner"]["leaveserver"]["variable1"]))
            ]
        });

        if (!args[0]) return message.reply("Please specify a guild ID!");
        if (!client.guilds.cache.has(args[0]))
        return message.reply("Its an invalid guild ID!");
        
        schema.findOne({ GuildId: args[0] }, async (err, data) => {
            let guild = client.guilds.cache.get(args[0]);

            if (data) {
                data.delete();
                guild.fetchOwner().then(owner => {
                    owner.send(`❌ Your Guild is no longer a \`PREMIUM-GUILD\``).catch(() => {});
                 }).catch(() => {});
                 return message.reply(`✅ **The Guild ${guild && guild.name ? guild.name : args[0]} is now __no longer__ a \`PREMIUM-GUILD\`**`)
            }
            if (!data) {
                if (args[1]) {
                    const Expire = day(args[1]).valueOf();
                    new schema({
                        GuildId: args[0],
                        GuildName: guild ? guild.name : args[0],
                        Expire,
                        Permanent: false,
                        DateExp: args[1],
                        BotAFK : settings.default_db_data.afk,
                        BotAFKVc : "",
                        BotAFKCh : "",
                    }).save();
                } else {
                    new schema({
                        GuildId: args[0],
                        GuildName: guild ? guild.name : args[0],
                        Expire: 0,
                        Permanent: true,
                        DateExp: null,
                        BotAFK : settings.default_db_data.afk,
                        BotAFKVc : "",
                        BotAFKCh : "",
                    }).save();
                }
                guild.fetchOwner().then(owner => {
                    owner.send(`✅ Your Guild: \`${guild ? guild.name : args[0]}\` is now a \`PREMIUM-GUILD\` until: \`${args[1]}\``).catch(() => {});
                  }).catch(() => {});
                return message.reply(`✅ **The Guild \`${guild ? guild.name : args[0]}\` is now a \`PREMIUM-GUILD\`**`)
            }
        });
    }
}