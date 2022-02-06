let started = false;
module.exports = (client) => {
  client.manager
    .on("nodeConnect", (node) => {
      if (!started) {
        started = true;
        client.logger(`Node connected :: ${String(node.options.identifier).brightBlue.underline}`)
      }
      setTimeout(() => {
        started = false;
      }, 2000)
    })
    .on("nodeCreate", (node) => {
      client.logger(`Node created :: ${String(node.options.identifier).brightBlue.underline}`)
    })
    .on("nodeReconnect", (node) => {
      client.logger(`Node reconnecting... :: ${String(node.options.identifier).brightBlue.underline}`)
    })
    .on("nodeDisconnect", (node) => {
      client.logger(`Node disconnected :: ${String(node.options.identifier).brightBlue.underline}`)
      setTimeout(() => {
        node.connect();
      }, 1000);
    })
    .on("nodeError", (node, error) => {
      client.logger(`Node errored :: ${String(node.options.identifier).brightBlue.underline}`)
      setTimeout(() => {
        node.connect();
      }, 1000);
    })

};