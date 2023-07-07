import { RoomRepository } from '../repository/room.repository';
import { WebSocket } from 'ws';
import { createResultMessage } from '../types/message';
import { MessageType } from '../types';
import { UpdateRoomResult } from '../types/data';

export class RoomController {
  constructor(
    private readonly clients: Set<WebSocket>,
    private readonly roomRepository: RoomRepository,
  ) {}

  createRoom(): void {
    this.roomRepository.create();
    const rooms = this.roomRepository.getAvailableRooms();
    const result = JSON.stringify(
      createResultMessage<UpdateRoomResult[]>({
        id: 0,
        type: MessageType.UpdateRoom,
        data: rooms.map(({ id: roomId, users }) => ({
          roomId,
          roomUsers: users.map(({ name, id: index }) => ({ name, index })),
        })),
      }),
    );
    this.clients.forEach((client) => client.send(result));
  }
}
