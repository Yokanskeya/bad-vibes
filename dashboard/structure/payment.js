const Discord = require("discord.js");
const config = require('../../botconfig/config.json');

module.exports = (client, app, checkAuth) => {
  app.get("/payment", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) return res.redirect('/errorlogin')
    if (!req.user.guilds) return res.redirect("/?error=" + encodeURIComponent("Cannot get your Guilds"))
    res.render("payment", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
      botconfig: config.websiteSettings,
      callback: config.websiteSettings.callback,
    })
  })
  app.post("/paymentgate", async (req, res) => {
    const guild = client.guilds.cache.get(req.body.guild)
    if (!guild)
      return res.redirect('/errornotinguild')
    let member = guild.members.cache.get(req.user.id);
    if (!member) {
      try {
        member = await guild.members.fetch(req.user.id);
      } catch {}
    }
    if (!member) return res.redirect("/?error=" + encodeURIComponent("Login first please! / Join the Guild again!"))
    if (!member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) return res.redirect("/?error=" + encodeURIComponent("You are not allowed to do that"))
    let premium = await client.Premium.findOne({
      GuildId: guild.id
    });

    res.render("paymentgate", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
      botconfig: config.websiteSettings,
      callback: config.websiteSettings.callback,
      guild: guild,
      premium: premium,
      period: req.body.period,
      email: req.body.email,
    })
  })
  app.post("/paymentSuccess", async (req, res) => {
    res.redirect('/')
    const guildReport = client.guilds.cache.get('625018767180693504');
    const channelReport = guildReport.channels.cache.get('939274812159840277');
    const embed = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setTitle(`Premium Payments`)
      .addField(`Guild Info`, `\`\`\`yml\nGuild Name: ${req.body.guildname} \nGuild ID: ${req.body.guildid}\`\`\``)
      .addField(`User Info:`, `\`\`\`yml\nUsername: ${req.user.username}#${req.user.discriminator} \nUser ID: ${req.user.id} \nEmail: ${req.body.email ? req.body.email : req.user.email}\`\`\``)
      .addField(`Period`, `\`\`\`yml\n ${req.body.period}\`\`\``)
      .setTimestamp()

    // channelReport.send({
    //   embeds: [embed],
    //   // files: [file]
    // })
    for (const owner of config.ownerIDS) {
      client.users.fetch(owner).then(user => {
        user.send({
          embeds: [embed],
        }).catch(() => {});
      }).catch(() => {});
    }
  })
}