import { httpServer as front } from './server/front';
import { WebSocketServer } from 'ws';
import { PlayerController } from './controller/player.controller';
import { PlayerRepository } from './repository/player.repository';
import { Message, MessageType, RegData } from './types';
import { RoomController } from './controller/room.controller';
import { RoomRepository } from './repository/room.repository';
import { createResultMessage } from './types/message';
import { WsUserService } from './service/ws-user.service';
import { AddToRoom } from './types/data';
import { GameRepository } from './repository/game.repository';
import { EventEmitterFactory } from './events/event-emitter-factory';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
front.listen(HTTP_PORT);

export const wss = new WebSocketServer({ port: 3000 });

const playerRepository = new PlayerRepository();
const roomRepository = new RoomRepository();
const gameRepository = new GameRepository();
const userService = new WsUserService(playerRepository);

const emitter = EventEmitterFactory.createEventEmitter(
  userService,
  roomRepository,
  gameRepository,
);

const playerController = new PlayerController(emitter, userService);
const roomController = new RoomController(emitter, roomRepository, userService);

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
          const result = playerController.login(ws, messageData as RegData);
          response = createResultMessage({ ...message, data: result });
          break;

        case MessageType.CreateRoom:
          roomController.createRoom(ws);
          break;

        case MessageType.AddToRoom:
          roomController.addUserToRoom(ws, messageData as AddToRoom);
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
