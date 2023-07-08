import { createResultMessage, Message } from '../../types/message';
import { UpdateRoomResult } from '../../types/data';
import { MessageType } from '../../types';
import { RoomRepository } from '../../repository/room.repository';
import { WebSocket } from 'ws';
import { WsUserService } from '../../service/ws-user.service';

export class SendRoomListListener {
  constructor(
    private readonly userService: WsUserService,
    private readonly roomRepository: RoomRepository,
  ) {}

  sendRoomListToAll() {
    const result = this.getRoomListResult();

    this.userService
      .getPlayerSockets()
      .forEach((client) => client.send(JSON.stringify(result)));
  }

  sendRoomListToUser(ws: WebSocket) {
    const result = this.getRoomListResult();
    ws.send(JSON.stringify(result));
  }

  private getRoomListResult(): Message {
    const rooms = this.roomRepository.getAvailableRooms();
    return createResultMessage<UpdateRoomResult[]>({
      id: 0,
      type: MessageType.UpdateRoom,
      data: rooms.map(({ id: roomId, users }) => ({
        roomId,
        roomUsers: users.map(({ name, id: index }) => ({ name, index })),
      })),
    });
  }
}
