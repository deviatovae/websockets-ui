import { WsUserService } from './ws-user.service';
import { Room } from '../entity/room';
import { createResultMessage } from '../types/message';
import { CreateGameResult } from '../types/data';
import { MessageType } from '../types';
import { GameRepository } from '../repository/game.repository';

export class GameService {
  constructor(
    private readonly wsUserService: WsUserService,
    private readonly gameRepository: GameRepository,
  ) {}

  createGame(room: Room) {
    const { id: gameId } = this.gameRepository.create();

    room.users.forEach((player) => {
      const ws = this.wsUserService.getPlayerSocket(player);
      const result = createResultMessage<CreateGameResult>({
        id: 0,
        type: MessageType.CreateGame,
        data: {
          idGame: gameId,
          idPlayer: player.id,
        },
      });

      ws.send(JSON.stringify(result));
    });
  }
}
