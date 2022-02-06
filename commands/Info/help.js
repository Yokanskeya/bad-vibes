const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageSelectMenu
} = require("discord.js")
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  duration,
  handlemsg
} = require(`${process.cwd()}/handlers/functions`)
const url = require(`${process.cwd()}/botconfig/url.json`);
module.exports = {
  name: "help",
  category: "Info",
  aliases: ["h", "commandinfo", "halp", "hilfe"],
  usage: "help [Command/Category]",
  description: "Returns all Commmands, or one specific command",
  type: "bot",
  cooldown: 5,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    if (args[0]) {
      const embed = new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon : null);
      const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
      var cat = false;
      if (!cmd) {
        cat = client.categories.find(cat => cat.toLowerCase().includes(args[0].toLowerCase()))
      }
      if (!cmd && (!cat || cat == null)) {
        return message.reply({
          embeds: [embed.setColor(es.wrongcolor).setDescription(handlemsg(client.la[ls].cmds.info.help.noinfo, {
            command: args[0].toLowerCase()
          }))]
        });
      } else if (cat) {
        var category = cat;
        const items = client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
        const embed = new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
          .setThumbnail(client.user.displayAvatarURL())
          .setTitle(eval(client.la[ls].cmds.info.help.title1))
          .setFooter(client.getFooter("No Custom Information for ", client.user.displayAvatarURL()));
        let embeds = allotherembeds_eachcategory();
        if (cat == "🔰 Info")
          return message.reply({
            embeds: [embeds[0]]
          })
        if (cat == "🎶 Music")
          return message.reply({
            embeds: [embeds[1]]
          })
        if (cat == "👀 Filter")
          return message.reply({
            embeds: [embeds[2]]
          })
        if (cat == `💰 Premium`)
          return message.reply({
            embeds: [embeds[3]]
          })
        if (cat == `⁉️ Misc`)
          return message.reply({
            embeds: [embeds[5]]
          })
        if (cat == `🎉 Fun`)
          return message.reply({
            embeds: [embeds[6]]
          })
        if (cat == `🔑 Admin`)
          return message.reply({
            embeds: [embeds[7]]
          })
        if (cat == "⚙️ Settings")
          return message.reply({
            embeds: [embeds[4]]
          })
        embed.setDescription(`:x: No Information found about this Category`)
        return message.reply({
          embeds: [embed]
        })
      }

      if (cmd.name) embed.setTitle(eval(client.la[ls].cmds.info.help.title2));
      if (cmd.name) embed.addField(client.la[ls].cmds.info.help.field1.title, `\`${cmd.name}\``);
      if (cmd.description) embed.addField(client.la[ls].cmds.info.help.field2.title, `\`\`\`${cmd.description}\`\`\``);
      if (cmd.aliases) try {
        embed.addField(client.la[ls].cmds.info.help.field3.title, `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
      } catch {}

      if (cmd.cooldown) embed.addField(client.la[ls].cmds.info.help.field4.title, `\`\`\`${cmd.cooldown} ${client.la[ls].cmds.info.help.field4.value}\`\`\``);
      else embed.addField(client.la[ls].cmds.info.help.field5.title, eval(client.la[ls].cmds.info.help.field5.value));
      if (cmd.usage) {
        embed.addField(client.la[ls].cmds.info.help.field6.title, `\`\`\`${prefix}${cmd.usage}\`\`\``);
        embed.setFooter(client.getFooter("Syntax: <> = required, [] = optional", es.footericon));
      }
      return message.reply({
        embeds: [embed]
      });
    } else {
      let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("◀️").setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.back))
      let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.home))
      let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('▶️').setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.forward))
      //let button_tutorial = new MessageButton().setStyle('LINK').setEmoji("840260133686870036").setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.tutorial)).setURL("https://youtu.be/E0R7d8gS908")

      let menuOptions = [{
          label: client.la[ls].cmds.info.help.menuOptions.label,
          value: client.la[ls].cmds.info.help.menuOptions.value,
          emoji: client.la[ls].cmds.info.help.menuOptions.emoji,
          description: client.la[ls].cmds.info.help.menuOptions.description,
        },
        {
          label: client.la[ls].cmds.info.help.menuOptions.label2,
          value: client.la[ls].cmds.info.help.menuOptions.value2,
          emoji: client.la[ls].cmds.info.help.menuOptions.emoji2,
          description: client.la[ls].cmds.info.help.menuOptions.description2,
        },
        {
          label: client.la[ls].cmds.info.help.menuOptions.label3,
          value: client.la[ls].cmds.info.help.menuOptions.value3,
          emoji: client.la[ls].cmds.info.help.menuOptions.emoji3,
          description: client.la[ls].cmds.info.help.menuOptions.description3,
        },
        {
          label: client.la[ls].cmds.info.help.menuOptions.label4,
          value: client.la[ls].cmds.info.help.menuOptions.value4,
          emoji: client.la[ls].cmds.info.help.menuOptions.emoji4,
          description: client.la[ls].cmds.info.help.menuOptions.description4,
        },
        {
          label: client.la[ls].cmds.info.help.menuOptions.label5,
          value: client.la[ls].cmds.info.help.menuOptions.value5,
          emoji: client.la[ls].cmds.info.help.menuOptions.emoji5,
          description: client.la[ls].cmds.info.help.menuOptions.description5,
        },
        {
          label: client.la[ls].cmds.info.help.menuOptions.label6,
          value: client.la[ls].cmds.info.help.menuOptions.value6,
          emoji: client.la[ls].cmds.info.help.menuOptions.emoji6,
          description: client.la[ls].cmds.info.help.menuOptions.description6,
        },
        {
          label: client.la[ls].cmds.info.help.menuOptions.label7,
          value: client.la[ls].cmds.info.help.menuOptions.value7,
          emoji: client.la[ls].cmds.info.help.menuOptions.emoji7,
          description: client.la[ls].cmds.info.help.menuOptions.description7,
        },
        {
          label: client.la[ls].cmds.info.help.menuOptions.label8,
          value: client.la[ls].cmds.info.help.menuOptions.value8,
          emoji: client.la[ls].cmds.info.help.menuOptions.emoji8,
          description: client.la[ls].cmds.info.help.menuOptions.description8,
        },
        {
          label: client.la[ls].cmds.info.help.menuOptions.label9,
          value: client.la[ls].cmds.info.help.menuOptions.value9,
          emoji: client.la[ls].cmds.info.help.menuOptions.emoji9,
          description: client.la[ls].cmds.info.help.menuOptions.description9,
        }
      ];
      let menuSelection = new MessageSelectMenu()
        .setCustomId("MenuSelection")
        .setPlaceholder(client.la[ls].cmds.info.help.menuSelection.value)
        .setMinValues(1)
        .setMaxValues(5)
        .addOptions(menuOptions.filter(Boolean))
      let buttonRow = new MessageActionRow().addComponents([button_back, button_home, button_forward,]) //button_tutorial.setDisabled(true)])
      let SelectionRow = new MessageActionRow().addComponents([menuSelection])
      const allbuttons = [buttonRow, SelectionRow]

      //define default embed
      let OverviewEmbed = new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
        .setFooter(client.getFooter("Page Overview\n" + client.user.username, client.user.displayAvatarURL()))
        .setTitle(eval(client.la[ls].cmds.info.help.OverviewEmbed.title))
        .addField(eval(client.la[ls].cmds.info.help.OverviewEmbed.field.title), eval(client.la[ls].cmds.info.help.OverviewEmbed.field.value))
        .addField(eval(client.la[ls].cmds.info.help.OverviewEmbed.field2.title), eval(client.la[ls].cmds.info.help.OverviewEmbed.field2.value))
        // .addField(eval(client.la[ls].cmds.info.help.OverviewEmbed.field3.title), eval(client.la[ls].cmds.info.help.OverviewEmbed.field3.value))
        .addFields({
          name: "🌐",
          value: `┕[[Dashboard]](${config.websiteSettings.domain})`,
          inline: true,
        }, {
          name: "🏠",
          value: `┕[[Support]](${config.websiteSettings.support})`,
          inline: true,
        }, {
          name: `📥`,
          value: `┕[[Invite]](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=identify%20email%20guilds%20bot%20applications.commands)`,
          inline: true,
        })

      //Send message with buttons
      let helpmsg = await message.reply({
        content: eval(client.la[ls].cmds.info.help.helpmsg.content),
        embeds: [OverviewEmbed],
        components: allbuttons
      }).catch(e => {
        console.log(e.stack ? String(e.stack).grey : String(e).grey)
        return message.reply(eval(client.la[ls].cmds.info.help.helpmsg.error)).catch(() => {})
      });
      var edited = false;
      var embeds = [OverviewEmbed]
      for (const e of allotherembeds_eachcategory(true))
        embeds.push(e)
      let currentPage = 0;

      //create a collector for the thinggy
      const collector = helpmsg.createMessageComponentCollector({
        filter: (i) => (i.isButton() || i.isSelectMenu()) && i.user && i.message.author.id == client.user.id,
        time: 180000,
        errors: ['time']
      });
      //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
      collector.on('collect', async b => {
        try {
          if (b.isButton()) {
            if (b.user.id !== message.author.id)
              return b.reply({
                content: handlemsg(client.la[ls].cmds.info.help.buttonerror, {
                  prefix: prefix
                }),
                ephemeral: true
              });

            //page forward
            if (b.customId == "1") {
              //b.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
              if (currentPage !== 0) {
                currentPage -= 1
              } else {
                currentPage = embeds.length - 1
              }
            }
            //go home
            else if (b.customId == "2") {
              //b.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
              currentPage = 0;
            }
            //go forward
            else if (b.customId == "3") {
              //b.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
              if (currentPage < embeds.length - 1) {
                currentPage++;
              } else {
                currentPage = 0
              }
            }
            await helpmsg.edit({
              embeds: [embeds[currentPage]],
              components: allbuttons
            }).catch(e => {})
            b.deferUpdate().catch(e => {})


          }
          if (b.isSelectMenu()) {
            //b.reply(`***Going to the ${b.customId.replace("button_cat_", "")} Page***, *please wait 2 Seconds for the next Input*`, true)
            //information, music, admin, settings, voice, minigames, nsfw
            let index = 0;
            let vembeds = []
            let theembeds = [OverviewEmbed, ...allotherembeds_eachcategory()];
            for (const value of b.values) {
              switch (value.toLowerCase()) {
                case "overview":
                  index = 0;
                  break;
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
            b.reply({
              embeds: vembeds,
              ephemeral: true
            });
          }
        } catch (e) {
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
          console.log(String(e).italic.italic.grey.dim)
        }
      });

      collector.on('end', collected => {
        if (!edited) {
          edited = true;
          helpmsg.edit({
            content: handlemsg(client.la[ls].cmds.info.help.timeended, {
              prefix: prefix
            }),
            embeds: [helpmsg.embeds[0]],
            components: [],
          }).catch((e) => {})
        }
      });
    }

    function allotherembeds_eachcategory(filterdisabled = false) {
      //ARRAY OF EMBEDS
      var embeds = [];

      //INFORMATION COMMANDS
      var embed0 = new MessageEmbed()
        .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "Info").size}\`] 🔰 Information Commands 🔰`)
        .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "Info").sort((a,b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
        .addField("\u200b", "__**Sub-Categorized Commands:**__")
        .addField(`🖥 **Server Related Commands**`, ">>> " + client.commands.filter((cmd) => cmd.category === "Info" && cmd.type === "server").sort((a, b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
        .addField(`⚙️ **Bot Related Commands**`, ">>> " + client.commands.filter((cmd) => cmd.category === "Info" && cmd.type === "bot").sort((a, b) => a.name.localeCompare(b.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
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
          .setFooter(client.getFooter(`Page ${index + 1} / ${embeds.length}\nTo see command Descriptions and Information, type: ${config.prefix}help [CMD NAME]`, client.user.displayAvatarURL()));
      })
    }

  }
}