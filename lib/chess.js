import { Chess } from 'chess.js'

export function newGame() {
  return new Chess();
}

/* This is horrible code */
export function boardToSlack(chessboard) {
  "use strict"
  let fen = chessboard.fen();
  let board = fen.split(" ")[0];
  let output = "";
  let white = true;
  let rank = 8;
  output += "`   a  b  c  d  e  f  g  h   `\n"
  output += rank + " ";
  for (let i=0; i<board.length; i++) {
    if(board[i] == "/") {
      output += " " + rank;
      rank--;
      output += "\n";
      output += rank + " ";
      white = !white;
    } else if (parseInt(board[i])) {
      let num = parseInt(board[i]);
      for (let x=0; x<num; x++) {
        output += white ? ":chess-nw:" : ":chess-nb:";
        white = !white;
      }
    } else {
      output += ":chess-";
      output += board[i] == board[i].toLowerCase() ? "b" : "w";
      output += board[i].toLowerCase();
      output += white ? "w:" : "b:";
      white = !white;
    }
  }
  output += " " + rank + "\n";
  output += "`   a  b  c  d  e  f  g  h   `\n"
  return output;
}
