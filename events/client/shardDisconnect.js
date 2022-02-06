//here the event starts
module.exports = (client, event, id) => {
  client.logger(`Shard #${id} Disconnected`.brightRed)
}