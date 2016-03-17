import { newGame, boardToSlack } from './lib/chess';

/* A handler recieves the game state and a matched group and returns a string
 * to send to the channel it recieved it from. */

function handleShow(game) {
  return game ? boardToSlack(game) : "No active game!";
}

function handleStart(game, match) {
  if (game && !game.in_checkmate() && !game.in_stalemate) {
    return "Already is game.";
  } else {
    game = newGame();
    return boardToSlack(game);
  }
}

function handlePlay(game, match) {
  return game.move(match) ? boardToSlack(game) : "Invalid move!";
}

let handlers = [];

handlers.push({ regex: /^chess show$/, func: handleShow });
handlers.push({ regex: /^chess start <@([A-Z0-9]+)>$/, func: handleStart });
handlers.push({ regex: /^chess start$/, func: handleStart });
handlers.push({ regex: /^chess play (\w+)$/, func: handlePlay });
handlers.push({ regex: /^chess move (\w+)$/, func: handlePlay });

export { handlers };
