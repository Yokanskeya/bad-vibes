const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageSelectMenu,
  MessageAttachment
} = require("discord.js")

module.exports = client => { 
  client.on("interactionCreate", async (interaction) => { 
    var {
      guild,
      message,
      channel,
      member,
      user
    } = interaction;
    
    if (!guild) return;
    if (!interaction.isSelectMenu()) return;

    const ss = await client.Settings.findOne({
      GuildId: guild.id
    })
    const ls = ss.Language;
    const es = ss.Embed;
    
    const ownerhelp = await client.ownerhelp.findOne({
      guildId: guild.id
    });
    if (!ownerhelp) return
    var channelid = await ownerhelp.channel;
    var messageid = await ownerhelp.message;

    if (!channelid || channelid.length < 5) return;
    if (!messageid || messageid.length < 5) return;
    if (!channel) channel = guild.channels.cache.get(interaction.channelId);
    if (!channel) return;
    if (channelid != channel.id) return;
    if (messageid != message.id) return;
    if (!member) member = guild.members.cache.get(user.id);
    if (!member) member = await guild.members.fetch(user.id).catch(() => {});
    if (!member) return;

    let helpch = guild.channels.cache.get(channelid)
    let helpmsg = helpch.messages.cache.get(messageid)
    if (interaction.isSelectMenu()) {
      let index = 0;
      let vembeds = []
      let theembeds = [helpmsg, ...allotherembeds_eachcategory(client, ss)];
      for (const value of interaction.values) {
        switch (value.toLowerCase()) {
          case "information":
            index = 1;
            break;
          case "music":
            index = 2;
            break;
          case "filter":
            index = 3;
            break;
          case "premium":
            index = 4;
            break;
          case "settings":
            index = 5;
            break;
          case "mics":
            index = 6;
            break;
          case "admin":
            index = 7;
            break;
          case "fun":
            index = 8;
            break;
        }
        vembeds.push(theembeds[index])
      }
      interaction.reply({
        embeds: vembeds,
        ephemeral: true
      });
    }
  })
}

function allotherembeds_eachcategory(client, ss) {
  let es = ss.Embed;
  let prefix = ss.Prefix;
  //ARRAY OF EMBEDS
  var embeds = [];

  //INFORMATION COMMANDS
  var embed0 = new MessageEmbed()
    .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "Info").size}\`] 🔰 Information Commands 🔰`)
    .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "Info").sort((a,b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
    .addField("\u200b", "__**Sub-Categorized Commands:**__")
    .addField(`🖥 **Server Related Commands**`, ">>> " + client.commands.filter((cmd) => cmd.category === "Info" && cmd.type === "server").sort((a, b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
    .addField(`<⚙️ **Bot Related Commands**`, ">>> " + client.commands.filter((cmd) => cmd.category === "Info" && cmd.type === "bot").sort((a, b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
  embeds.push(embed0)

  //MUSIC COMMANDS type: song, queue, queuesong, bot
  var embed3 = new MessageEmbed()
    .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "Music").size}\`] 🎶 Music Commands 🎶`)
    .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "Music").sort((a,b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
    .addField("\u200b", "__**Sub-Categorized Commands:**__")
    .addField("📑 **Queue Commands**", "> " + client.commands.filter((cmd) => cmd.category === "Music" && cmd.type.includes("queue")).sort((a, b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
    .addField("🎶 **Song Commands**", "> " + client.commands.filter((cmd) => cmd.category === "Music" && cmd.type.includes("song")).sort((a, b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
    .addField("⚙️ **Bot Commands**", "> " + client.commands.filter((cmd) => cmd.category === "Music" && cmd.type.includes("bot")).sort((a, b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
  embeds.push(embed3)

  //FILTER COMMANDS
  var embed4 = new MessageEmbed()
    .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "Filter").size}\`] 👀 Filter Commands 👀`)
    .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "Filter").sort((a,b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
  embeds.push(embed4)

  //CUSTOM QUEUE COMMANDS
  var embed5 = new MessageEmbed()
    .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "Premium").size}\`] 💎 Premium Commands 💎`)
    .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "Premium").sort((a,b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
    .addField("\u200b", "__**Sub-Categorized Commands:**__")
    .addField("⚙️ **Bot Related Commands**", "> " + client.commands.filter((cmd) => cmd.category === "Settings" && cmd.type.includes("bot")).sort((a, b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
    .addField("🎶 **Music Related Commands**", "> " + client.commands.filter((cmd) => cmd.category === "Settings" && cmd.type.includes("music")).sort((a, b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
  embeds.push(embed5)

  //Settings
  var embed8 = new MessageEmbed()
    .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "Settings").size}\`] ⚙️ Settings Commands ⚙️`)
    .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "Settings").sort((a,b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
    .addField("\u200b", "__**Sub-Categorized Commands:**__")
    .addField("⚙️ **Bot Related Commands**", "> " + client.commands.filter((cmd) => cmd.category === "Settings" && cmd.type.includes("bot")).sort((a, b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
    .addField("🎶 **Music Related Commands**", "> " + client.commands.filter((cmd) => cmd.category === "Settings" && cmd.type.includes("music")).sort((a, b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
  embeds.push(embed8)

  //Misc
  var embed9 = new MessageEmbed()
    .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "Mics").size}\`] ⁉️ Mics Commands ⁉️`)
    .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "Mics").sort((a,b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
    .addField("\u200b", "__**Sub-Categorized Commands:**__")
    .addField("⚙️ **Bot Related Commands**", "> " + client.commands.filter((cmd) => cmd.category === "Mics" && cmd.type.includes("bot")).sort((a, b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
  embeds.push(embed9)

  //Admin
  var embed10 = new MessageEmbed()
    .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "Admin").size}\`] 🔑 Admin Commands 🔑`)
    .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "Admin").sort((a,b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
    .addField("\u200b", "__**Sub-Categorized Commands:**__")
    .addField("⚙️ **Bot Related Commands**", "> " + client.commands.filter((cmd) => cmd.category === "Admin" && cmd.type.includes("bot")).sort((a, b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
  embeds.push(embed10)

  //Fun
  var embed8 = new MessageEmbed()
    .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "Fun").size}\`] 🎉 Fun Commands 🎉`)
    .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "Fun").sort((a,b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
    .addField("\u200b", "__**Sub-Categorized Commands:**__")
    .addField("⚙️ **Bot Related Commands**", "> " + client.commands.filter((cmd) => cmd.category === "Fun" && cmd.type.includes("bot")).sort((a, b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
  embeds.push(embed8)

  return embeds.map((embed, index) => {
    return embed
      .setColor(es.color)
      .setThumbnail(es.thumb ? es.footericon : null)
      .setFooter(client.getFooter(`Page ${index + 1} / ${embeds.length}\nTo see command Descriptions and Information, type: ${prefix}help [CMD NAME]`, client.user.displayAvatarURL()));
  })
}
module.exports.allotherembeds_eachcategory = allotherembeds_eachcategory;