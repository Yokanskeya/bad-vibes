const express = require("express");
const url = require("url");
const path = require("path");
const Discord = require("discord.js");
const ejs = require("ejs");
const passort = require("passport");
const bodyParser = require("body-parser");
const Strategy = require("passport-discord").Strategy;
const config = require("../botconfig/config.json");
const passport = require("passport");

module.exports = client => {
  //WEBSITE CONFIG BACKEND
  const app = express();
  const session = require("express-session");
  const MemoryStore = require("memorystore")(session);
  const botsettings = config.websiteSettings;

  //Initalize the Discord Login
  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((obj, done) => done(null, obj))
  passport.use(new Strategy({
      clientID: config.websiteSettings.clientID || client.user.id,
      clientSecret: process.env['secret'] || config.websiteSettings.secret,
      callbackURL: config.websiteSettings.callback,
      scope: ["identify", "guilds", "guilds.join"]
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => done(null, profile))
    }
  ))

  app.use(session({
    store: new MemoryStore({
      checkPeriod: 86400000
    }),
    secret: `#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n`,
    resave: false,
    saveUninitialized: false
  }))

  // MIDDLEWARES 
  app.use(passport.initialize());
  app.use(passport.session());

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "./views"));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({
    extended: true
  }));
  //Loading css files
  app.use(express.static(path.join(__dirname, "./public")));

  const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/login");
  }
  app.get("/login", (req, res, next) => {
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname == app.locals.domain) {
        req.session.backURL = parsed.path
      }
    } else {
      req.session.backURL = `/`;
    }
    next();
  }, passport.authenticate("discord", {
    prompt: "none"
  }));

  app.get("/callback", passport.authenticate("discord", {
    failureRedirect: "/"
  }), async (req, res) => {
    let banned = false //client.settings.get("bannedusers")
    if (banned) {
      req.session.destroy()
      res.json({
        login: false,
        message: "You are banned from the dashboard",
        logout: true
      })
      req.logout();
    } else {
      res.redirect('/dashboard')
    }
  });

  app.get("/logout", function (req, res) {
    req.session.destroy(() => {
      req.logout();
      res.redirect("/");
    })
  })

  app.get("/", (req, res) => {
    res.render("index", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
      botconfig: config.websiteSettings,
      callback: config.websiteSettings.callback,
    })
  })

  app.get("/welcome", (req, res) => {
    res.render("welcome", {
      req: req,
      user: req.isAuthenticated() ? req.user : null,
      bot: client,
      Permissions: Discord.Permissions,
      botconfig: botsettings,
      callback: botsettings.callback,
    })
  })

  Array("premium", "dashboard", "commands", "payment", "terms", "error", "docs", "music-player").forEach(handler => {
    try {
      require(`./structure/${handler}`)(client, app, checkAuth);
    } catch (e) {
      console.log(e.stack ? String(e.stack).grey : String(e).grey)
    }
  });

  const port = process.env.PORT || config.websiteSettings.port;
  const http = require("http").createServer(app);
  http.listen(port, () => {
    client.logger(`Website connected :: ${String(config.websiteSettings.domain).brightBlue.underline}`);
  });

}