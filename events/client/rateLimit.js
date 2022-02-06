//here the event starts
const settings = require(`${process.cwd()}/botconfig/settings.json`);
module.exports = (client, rateLimitData) => {
  if (!settings["ratelimit-logs"]) return;
  console.warn(rateLimitData)
}