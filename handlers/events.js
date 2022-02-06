const fs = require("fs");
const allevents = [];
const config = require(`${process.cwd()}/botconfig/config.json`)
const settings = require(`${process.cwd()}/botconfig/settings.json`);
module.exports = async (client) => {
  try {
    const load_dir = (dir) => {
      const event_files = fs.readdirSync(`./events/${dir}`).filter((file) => file.endsWith(".js"));
      for (const file of event_files) {
        try {
          const event = require(`../events/${dir}/${file}`)
          let eventName = file.split(".")[0];
          if (eventName == "message") continue;
          allevents.push(eventName);
          client.on(eventName, event.bind(null, client));
          if (settings.show_loaded_events) {
            client.logger(`Loaded Event: ${file}`)
          }
        } catch (e) {
          console.log(String(e.stack).grey.bgRed)
        }
      }
    }
    await ["client", "guild"].forEach(e => load_dir(e));
    client.logger("Logging into the Bot ... ".yellow);
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
};