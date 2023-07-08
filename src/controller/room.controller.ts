import { RoomRepository } from '../repository/room.repository';
import { WebSocket } from 'ws';
import { AddToRoom } from '../types/data';
import { WsUserService } from '../service/ws-user.service';
import { EventEmitter } from '../events/event-emitter';
import { Events } from '../events/events';

export class RoomController {
  constructor(
    private readonly emitter: EventEmitter,
    private readonly roomRepository: RoomRepository,
    private readonly userService: WsUserService,
  ) {}

  createRoom(ws: WebSocket): void {
    const player = this.userService.getCurrentUser(ws);
    this.roomRepository.create(player);
    this.emitter.emit(Events.RoomCreated);
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
    this.emitter.emit(Events.RoomOccupied, room);
  }
}
