//here the event starts
const settings = require(`${process.cwd()}/botconfig/settings.json`);
module.exports = (client, info) => {
  if (!settings[`debug-discordjs-logs`]) return;
  console.log(String(info).grey);
}