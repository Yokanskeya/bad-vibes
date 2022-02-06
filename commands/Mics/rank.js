const {
    MessageEmbed,
    MessageAttachment
  } = require("discord.js")
const canvacord = require("canvacord");
const Canvas = require("canvas");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const url = require(`${process.cwd()}/botconfig/url.json`);
const {
    delay
} = require(`${process.cwd()}/handlers/functions`)
module.exports = {
    name: "rank",
    category: "Mics",
    aliases: [],
    usage: "rank",
    description: "Show a rank leveling system by Bad Vibes",
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
        let rankuser = message.author;
        client.points.ensure(`${message.guild.id}-${rankuser.id}`, {
            user: message.author.id,
            guild: message.guild.id,
            points: 0,
            level: 1
        });
        //do some databasing
        const filtered = client.points.filter(p => p.guild === message.guild.id).array();
        const sorted = filtered.sort((a, b) => b.points - a.points);
        const top10 = sorted.splice(0, message.guild.memberCount);
        let i = 0;
        //count server rank sometimes an error comes
        for (const data of top10) {
          await delay(15);
          try {
            i++;
            if (client.users.cache.get(data.user).tag === rankuser.tag) break;
          } catch {
            i = `Error counting Rank`;
            break;
          }
        }
        const key = `${message.guild.id}-${rankuser.id}`;
        //math
        let curpoints = Number(client.points.get(key, `points`).toFixed(2));
        //math
        let curnextlevel = Number(((Number(1) + Number(client.points.get(key, `level`).toFixed(2))) * Number(10)) * ((Number(1) + Number(client.points.get(key, `level`).toFixed(2))) * Number(10)));
        //if not level == no rank
        if (client.points.get(key, `level`) === undefined) i = `No Rank`;
        //define a temporary embed so its not coming delayed
        let tempmsg = await message.channel.send({
            embeds: [new MessageEmbed()
                .setColor("RED")
                .setAuthor(client.getAuthor("Calculating...", "https://cdn.discordapp.com/emojis/769935094285860894.gif"))
            ]
        })
        //global local color var.
        let color;
        // //define status of the rankuser
        let status = rankuser.presence?.status;
        //do some coloring for user status cause cool
        if (status = "online") {color = "#00fa81";}
        else if (status === "offline") {color = "#999999";}
        else if (status === "idle") {color = "#ffbe00"; }
        else if (status === "streaming") {color = "#a85fc5"; }
        else {status === "dnd"; color = "#ff0048";}

        //define the ranking card
        const rank = new canvacord.Rank()
          .setAvatar(rankuser.displayAvatarURL({ dynamic: false, format: 'png' }))
          .setCurrentXP(Number(curpoints.toFixed(2)), `#eeeeee`)
          .setRequiredXP(Number(curnextlevel.toFixed(2)), `#eeeeee`)
          .setStatus(status, false, 5)
          .renderEmojis(true)
          .setProgressBar(["#ff84ca", "#cc0000"], "GRADIENT")
          .setRankColor(`#eeeeee`, "COLOR")
          .setLevelColor(`#ff84ca`, "COLOR")
          .setUsername(rankuser.username, `#eeeeee`)
          .setRank(Number(i), `RANK`, true,)
          .setLevel(Number(client.points.get(key, `level`)), "LEVEL", true)
          .setDiscriminator(rankuser.discriminator, `#ff84ca`);
        rank.build()
          .then(async data => {
            const attachment = new MessageAttachment(data, "RankCard.png");
            await message.reply({
                files : [
                    attachment
                ],
            });
            //delete that temp message
            await tempmsg.delete();
            return;
        });
    }   
}