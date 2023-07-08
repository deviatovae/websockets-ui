import { RoomRepository } from '../repository/room.repository';
import { WebSocket } from 'ws';
import { createResultMessage } from '../types/message';
import { MessageType } from '../types';
import { AddToRoom, UpdateRoomResult } from '../types/data';
import { WsUserService } from '../service/ws-user.service';
import { GameService } from '../service/game.service';

export class RoomController {
  constructor(
    private readonly clients: Set<WebSocket>,
    private readonly roomRepository: RoomRepository,
    private readonly userService: WsUserService,
    private readonly gameService: GameService,
  ) {}

  createRoom(ws: WebSocket): void {
    const player = this.userService.getCurrentUser(ws);
    this.roomRepository.create(player);
    this.sendRoomList();
  }

  addUserToRoom(ws: WebSocket, { indexRoom }: AddToRoom): void {
    const player = this.userService.getCurrentUser(ws);
    const room = this.roomRepository.getRoom(indexRoom);
    if (!room) {
      throw new Error('Invalid room id');
    }

    if (room.users.length >= 2) {
      throw new Error('Room is full');
    }

    const existedUser = room.users[0];
    if (player.id === existedUser?.id) {
      throw new Error('User is already in the room');
    }

    room.users.push(player);
    this.roomRepository.updateRoom(room);
    this.sendRoomList();
    this.gameService.createGame(room);
  }

  private sendRoomList() {
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
