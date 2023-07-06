import { httpServer as front } from './server/front';
import { WebSocketServer } from 'ws';
import { PlayerController } from './controller/player.controller';
import { PlayerRepository } from './repository/player.repository';
import { Message, MessageType, RegData } from './types';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
front.listen(HTTP_PORT);

const createResultMessage = <T>({
  id,
  type,
  data,
}: {
  id: number;
  type: MessageType;
  data: T;
}): Message => ({
  id,
  type,
  data: JSON.stringify(data),
});

export const wss = new WebSocketServer({ port: 3000 });
const playerRepository = new PlayerRepository();
const playerController = new PlayerController(playerRepository);

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', (data) => {
    let response;
    const message = JSON.parse(data.toString()) as Message;
    const messageData = message.data
      ? (JSON.parse(message.data) as unknown)
      : null;

    switch (message.type) {
      case MessageType.Reg:
        const result = playerController.login(messageData as RegData);
        response = createResultMessage({ ...message, data: result });
        break;
    }

    if (response) {
      ws.send(JSON.stringify(response));
    }
  });
});
