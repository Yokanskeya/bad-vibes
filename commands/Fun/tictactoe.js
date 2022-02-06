const { TicTacToe } = require('djs-games')

module.exports = {
    name: "tictactoe",
    aliases: ["ttt", "xox"],
    category: "Fun",
    description: "Starts a match of Tic-Tac-Toe with the mentioned user",
    usage: "tictactoe",
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
      const game = new TicTacToe({
        message: message,
        xEmote: '❌', // The Emote for X
        oEmote: '0️⃣', // The Emote for O
        xColor: 'PRIMARY',
        oColor: 'PRIMARY', // The Color for O
        embedDescription: 'Tic Tac Toe', // The Description of the embed
      })
      game.start()
  }
};