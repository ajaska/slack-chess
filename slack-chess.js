import { newGame, boardToSlack } from './lib/chess';
import { RtmClient, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client'
import { handlers as messageHandlers } from './handlers';

const token = process.env.SLACK_API_TOKEN || '';
const rtm = new RtmClient(token);

rtm.start();
let game = newGame();

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  console.log(message);
  if (message.type !== 'message') {
    console.log("Fuck!");
    return;
  }

  messageHandlers.forEach(handler => {
    const regex_result = handler.regex.exec(message.text);
    if (regex_result === null) {
      return;
    }
    const handler_result = handler.func(game, regex_result[1]);
    rtm.sendMessage(handler_result, message.channel);
  });
});
