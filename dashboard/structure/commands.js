const Discord = require("discord.js");
const Settings = require("../settings.json");
const config = require('../../botconfig/config.json');

module.exports = (client, app, checkAuth) => { 
  let categoryresult = client.categories.filter(name => name != 'Owner')
  app.get("/commands", (req, res) => {
    res.render("commands", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      //guild: client.guilds.cache.get(req.params.guildID),
      bot: client,
      Permissions: Discord.Permissions,
      botconfig: Settings.website,
      callback: Settings.config.callback,
      categories: categoryresult,
      commands: client.commands,
      BotConfig: config,
    })
  })
}
