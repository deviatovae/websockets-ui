import { EventEmitter } from './event-emitter';
import { Events } from './events';
import { SendRoomListListener } from './listeners/send-room-list.listener';
import { RoomRepository } from '../repository/room.repository';
import { CreateRoomListener } from './listeners/create-room.listener';
import { GameRepository } from '../repository/game.repository';
import { WsUserService } from '../service/ws-user.service';
import { StartGameListener } from './listeners/start-game.listener';
import { SendTurnListener } from './listeners/send-turn.listener';
import { AttackListener } from './listeners/attack.listener';
import { FinishGameListener } from './listeners/finish-game.listener';
import { SendWinnerListener } from './listeners/send-winner.listener';
import { PlayerRepository } from '../repository/player.repository';

export class EventEmitterFactory {
  static createEventEmitter(
    userService: WsUserService,
    roomRepository: RoomRepository,
    gameRepository: GameRepository,
    playerRepository: PlayerRepository,
  ): EventEmitter {
    const emitter = new EventEmitter();

    const sendRoomListener = new SendRoomListListener(
      userService,
      roomRepository,
    );
    const createRoomListener = new CreateRoomListener(
      userService,
      gameRepository,
    );
    const startGameListener = new StartGameListener(userService, emitter);
    const sendTurnListener = new SendTurnListener(userService);
    const attackListener = new AttackListener(userService);
    const finishGameListener = new FinishGameListener(
      userService,
      emitter,
      playerRepository,
    );
    const sendWinners = new SendWinnerListener(userService);

    emitter.on(
      Events.Login,
      sendRoomListener.sendRoomListToUser.bind(sendRoomListener),
    );
    emitter.on(Events.Login, sendWinners.sendWinners.bind(sendWinners));
    emitter.on(
      Events.RoomCreated,
      sendRoomListener.sendRoomListToAll.bind(sendRoomListener),
    );
    emitter.on(
      Events.RoomOccupied,
      sendRoomListener.sendRoomListToAll.bind(sendRoomListener),
    );

    emitter.on(
      Events.RoomOccupied,
      createRoomListener.createGame.bind(createRoomListener),
    );

    emitter.on(
      Events.ShipPlaced,
      startGameListener.startGame.bind(startGameListener),
    );

    emitter.on(
      Events.GameStarted,
      sendTurnListener.sendTurn.bind(sendTurnListener),
    );
    emitter.on(Events.GameFinished, sendWinners.sendWinners.bind(sendWinners));

    emitter.on(
      Events.Attacked,
      attackListener.sendAttackResult.bind(attackListener),
    );

    emitter.on(
      Events.Disconnected,
      finishGameListener.finishOnDisconnect.bind(finishGameListener),
    );
    emitter.on(
      Events.Attacked,
      finishGameListener.finishOnAttack.bind(finishGameListener),
    );

    emitter.on(
      Events.Attacked,
      sendTurnListener.sendTurn.bind(sendTurnListener),
    );

    return emitter;
  }
}
