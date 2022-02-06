const { MessageEmbed } = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);

module.exports = {
    name: `resetbot`,
    type: "info",
    category: "Owner",
    aliases: [`rebot`],
    description: `Restart bot`,
    usage: `resetbot`,
    cooldown: 10,
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
        if (!config.ownerIDS.some(r => r.includes(message.author.id)))
        return message.channel.send({
            embeds: [new MessageEmbed()
                .setColor(es.wrongcolor).setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable1"]))
                .setDescription(eval(client.la[ls]["cmds"]["owner"]["changestatus"]["variable2"]))
            ]
        });

        let themsg = message.reply({
            embeds: [new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
              .setFooter(client.getFooter(es))
              .setTitle('Are you sure reset this bot?')
              .setDescription('If sure reply: __\`yes\`__')
            ]
          }).then((msg) => {
            //wait for answer of the right user
            msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 30 * 1000,
                errors: ['time']
              })
              //after right user answered
              .then(async collected => {
                //and if its yes
                if (collected.first().content.toLowerCase() === `yes`) {
                    message.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor(es.wrongcolor)
                            .setTitle('Resetting this bot...')
                        ],
                    })
                    client.destroy();
                    client.login(config.token);
                }
            })
        })
    }
}