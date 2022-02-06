const Discord = require("discord.js");
const Settings = require("../settings.json");
const Swal = require('sweetalert2');

module.exports = (client, app, checkAuth) => {
  app.get("/premium", async (req, res) => {
    res.render("premium", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
      botconfig: Settings.website,
      callback: Settings.config.callback,
    })
  })
}

  