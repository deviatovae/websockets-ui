import { WsUserService } from '../../service/ws-user.service';
import { UpdateWinners } from '../../types/data';
import { MessageType } from '../../types';

export class SendWinnerListener {
  constructor(private readonly userService: WsUserService) {}

  sendWinners() {
    const players = this.userService.getPlayers();
    players.forEach(({ id }) =>
      this.userService.sendMessageForPlayer<UpdateWinners>(
        id,
        MessageType.UpdateWinners,
        players.map(({ name, wins }) => ({ name, wins })),
      ),
    );
  }
}
