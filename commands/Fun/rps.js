const { RockPaperScissors } = require('djs-games')

module.exports = {
    name: "rps",
    aliases: [],
    category: "Fun",
    description: "Play a game of rock paper scissors.",
    usage: "rps",
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
      const game = new RockPaperScissors({
        message: message,
      })
      game.start()
  }
};