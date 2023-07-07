import { httpServer as front } from './server/front';
import { WebSocketServer } from 'ws';
import { PlayerController } from './controller/player.controller';
import { PlayerRepository } from './repository/player.repository';
import { Message, MessageType, RegData } from './types';
import { RoomController } from './controller/room.controller';
import { RoomRepository } from './repository/room.repository';
import { createResultMessage } from './types/message';
import { UserService } from './service/user.service';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
front.listen(HTTP_PORT);

export const wss = new WebSocketServer({ port: 3000 });
const playerRepository = new PlayerRepository();
const userService = new UserService(playerRepository);
const playerController = new PlayerController(userService);
const roomRepository = new RoomRepository();
const roomController = new RoomController(
  wss.clients,
  roomRepository,
  userService,
);

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', (data) => {
    try {
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

        case MessageType.CreateRoom:
          roomController.createRoom();
          break;
      }

      if (response) {
        ws.send(JSON.stringify(response));
      }
    } catch (e) {
      console.error(e);
    }
  });
});
