import { EventEmitter } from './event-emitter';
import { Events } from './events';
import { SendRoomListListener } from './listeners/send-room-list.listener';
import { RoomRepository } from '../repository/room.repository';
import { CreateRoomListener } from './listeners/create-room.listener';
import { GameRepository } from '../repository/game.repository';
import { WsUserService } from '../service/ws-user.service';
import { StartGameListener } from './listeners/start-game.listener';

export class EventEmitterFactory {
  static createEventEmitter(
    userService: WsUserService,
    roomRepository: RoomRepository,
    gameRepository: GameRepository,
  ): EventEmitter {
    const emitter = new EventEmitter();

    const sendRoomListener = new SendRoomListListener(
      userService,
      roomRepository,
    );
    emitter.on(
      Events.Login,
      sendRoomListener.sendRoomListToUser.bind(sendRoomListener),
    );
    emitter.on(
      Events.RoomCreated,
      sendRoomListener.sendRoomListToAll.bind(sendRoomListener),
    );
    emitter.on(
      Events.RoomOccupied,
      sendRoomListener.sendRoomListToAll.bind(sendRoomListener),
    );

    const createRoomListener = new CreateRoomListener(
      userService,
      gameRepository,
    );
    emitter.on(
      Events.RoomOccupied,
      createRoomListener.createGame.bind(createRoomListener),
    );

    const startGameListener = new StartGameListener(userService);
    emitter.on(
      Events.ShipPlaced,
      startGameListener.startGame.bind(startGameListener),
    );

    return emitter;
  }
}
