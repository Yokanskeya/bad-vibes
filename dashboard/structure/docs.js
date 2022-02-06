const Discord = require('discord.js')
const config = require('../../botconfig/config.json');
const {
  duration,
} = require(`${process.cwd()}/handlers/functions`);
module.exports = (client, app, checkAuth) => {
  let categoryresult = client.categories.filter(name => name != 'Owner')
  app.get("/docs", async (req, res) => {
    res.render("docs", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
      config: config,
      callback: config.websiteSettings.callback,
      categories: categoryresult,
      commands: client.commands,
      owner: client.users.cache.get('863031982018920488'),
      version: require('../../package.json').version,
      Discord: Discord,
      duration: duration,
      stats: await client.statsGlobal.findOne({
        BotId: client.user.id
      }),
    })
  })
  app.get("/docs/quickstart", async (req, res) => {
    res.render("docs/quickstart", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
      config: config,
      callback: config.websiteSettings.callback,
      categories: categoryresult,
      commands: client.commands,
      owner: client.users.cache.get('863031982018920488'),
      version: require('../../package.json').version,
      Discord: Discord,
      duration: duration,
      stats: await client.statsGlobal.findOne({
        BotId: client.user.id
      }),
    })
  })
  app.get("/docs/setup", async (req, res) => {
    res.render("docs/setup", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
      config: config,
      callback: config.websiteSettings.callback,
      categories: categoryresult,
      commands: client.commands,
      owner: client.users.cache.get('863031982018920488'),
      version: require('../../package.json').version,
      Discord: Discord,
      duration: duration,
      stats: await client.statsGlobal.findOne({
        BotId: client.user.id
      }),
    })
  })
  app.get("/docs/faq", async (req, res) => {
    res.render("docs/faq", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
      config: config,
      callback: config.websiteSettings.callback,
      categories: categoryresult,
      commands: client.commands,
      owner: client.users.cache.get('863031982018920488'),
      version: require('../../package.json').version,
      Discord: Discord,
      duration: duration,
      stats: await client.statsGlobal.findOne({
        BotId: client.user.id
      }),
    })
  })
  app.get("/docs/about", async (req, res) => {
    res.render("docs/about", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
      config: config,
      callback: config.websiteSettings.callback,
      categories: categoryresult,
      commands: client.commands,
      owner: client.users.cache.get('863031982018920488'),
      version: require('../../package.json').version,
      Discord: Discord,
      duration: duration,
      stats: await client.statsGlobal.findOne({
        BotId: client.user.id
      }),
    })
  })
}