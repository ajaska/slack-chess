"use strict"
// var chess = require('./lib/chess.js');
import { newGame, boardToSlack } from './lib/chess';

var RtmClient = require('@slack/client').RtmClient;

var token = process.env.SLACK_API_TOKEN || '';

// var rtm = new RtmClient(token, {logLevel: 'debug'});
var rtm = new RtmClient(token);
rtm.start()

var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

var game = null;
 
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
});

var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

/* I can't wait to refactor this really really really hard */
rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  if (message.type === 'message') {
    console.log(message);
    console.log(message.text);
    switch (true) {
      case /^chess show$/.test(message.text):
        if(game) {
          rtm.sendMessage(boardToSlack(game), message.channel);
          rtm.sendMessage(game.turn() == 'b' ? "Black's turn" : "White's turn", message.channel)
        } else {
          rtm.sendMessage("No active game!", message.channel);
        }
        break;
      case /^chess start <@([A-Z0-9]+)>$/.test(message.text):
      case /^chess start$/.test(message.text):
        if (game && !game.in_checkmate() && !game.in_stalemate) {
          rtm.sendMessage("Already is game.", message.channel);
        } else {
          game = newGame();
          rtm.sendMessage(boardToSlack(game), message.channel);
        }
        break;
      case /^chess play (\w)+$/.test(message.text):
        let move = /^chess play (.*)$/.exec(message.text)[1];
        if (game.move(move)) {
          rtm.sendMessage(boardToSlack(game), message.channel);
          rtm.sendMessage(game.turn() == 'b' ? "Black's turn" : "White's turn", message.channel)
          if(game.in_check()) {
            rtm.sendMessage("Check!", message.channel);
          } else if (game.in_checkmate()) {
            rtm.sendMessage("Checkmate!", message.channel);
          } else if (game.in_stalemate()) {
            rtm.sendMessage("Stalemate.", message.channel);
          }
        } else {
          rtm.sendMessage("Invalid move!", message.channel);
        }
        break;
    }
   
  }
});
