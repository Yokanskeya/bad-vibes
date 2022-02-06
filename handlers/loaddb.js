const Enmap = require("enmap");
const autoresume = require("../databases/autoresume");
const autorole = require("../databases/autorole");
const embedMessage = require("../databases/embedMessage");
const greetingmsg = require("../databases/greetingmsg");
const levelingSystem = require("../databases/leveling-system");
const memberCount = require("../databases/memberCount");
const musicsettings = require("../databases/musicsettings");
const mutemember = require("../databases/mutemember");
const premium = require("../databases/premium");
const reactionRoles = require("../databases/reaction-roles");
const settings = require("../databases/settings");
const stats = require("../databases/stats");
const statsGlobal = require("../databases/statsGlobal");
const leaveMessage = require('../databases/leaveMessage');
const ownerhelp = require("../databases/ownerhelp");
module.exports = client => {
  client.points = new Enmap({
    name: "points",
    dataDir: "./databases/leveling"
  })
  client.queuesaves = new Enmap({
    name: "queuesaves",
    dataDir: "./databases/queuesaves",
    ensureProps: false
  });

  client.Autorolesettings = autorole;
  client.Embedsettings = embedMessage;
  client.Greetingmsg = greetingmsg;
  client.Membercount = memberCount;
  client.Musicsettings = musicsettings;
  client.Mutesettings = mutemember;
  client.Premium = premium;
  client.reactrole = reactionRoles;
  client.Settings = settings;
  client.stats = stats;
  client.statsGlobal = statsGlobal;
  client.leveling = levelingSystem;
  client.autoresume = autoresume;
  client.leaveMessage = leaveMessage;
  client.ownerhelp = ownerhelp;
}