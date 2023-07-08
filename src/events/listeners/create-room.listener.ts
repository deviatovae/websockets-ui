import { Room } from '../../entity/room';
import { createResultMessage } from '../../types/message';
import { CreateGameResult } from '../../types/data';
import { MessageType } from '../../types';
import { GameRepository } from '../../repository/game.repository';
import { WsUserService } from '../../service/ws-user.service';

export class CreateRoomListener {
  constructor(
    private readonly userService: WsUserService,
    private readonly gameRepository: GameRepository,
  ) {}
  createGame(room: Room) {
    const { id: gameId } = this.gameRepository.create();

    room.users.forEach((player) => {
      const ws = this.userService.getPlayerSocket(player);
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
